/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigationStore } from '../stores/navigationStore';
import { r2Service } from '../services/r2Service';
import { R2Item } from '../types';
import { UploadItem } from '../utils/fileUtils';

export function useFileExplorer() {
  const queryClient = useQueryClient();

  const {
    currentPath,
    searchQuery,
    setSearchQuery,
    activeBucketName,
    clipboardPaths,
    clearSelection,
    addUpload,
    updateUploadProgress,
    viewPrefixesAsFolders,
    setSkippedUploads,
    sortColumn,
    sortDirection,
  } = useNavigationStore();

  const [localToast, setLocalToast] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Debounce effect: automatically trigger search after 500ms of inactivity
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (localSearch !== searchQuery) {
        setSearchQuery(localSearch);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [localSearch, searchQuery, setSearchQuery]);

  const showLocalToast = (msg: string) => {
    setLocalToast(msg);
    setTimeout(() => {
      setLocalToast((curr) => (curr === msg ? null : curr));
    }, 3000);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchQuery(localSearch);
  };

  // 1. Fetch direct objects in the active directory path
  const {
    data: items,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['objects', activeBucketName, currentPath, searchQuery, viewPrefixesAsFolders],
    queryFn: () => r2Service.listObjects(currentPath, searchQuery),
  });

  // 2. Fetch all folders for statistics
  const { data: allFolders = [] } = useQuery({
    queryKey: ['folders-count', activeBucketName],
    queryFn: async () => {
      return r2Service.getAllFolders();
    },
  });

  // Fetch all items recursively to calculate accurate folder sizes/counts
  const { data: allObjects = [] } = useQuery<R2Item[]>({
    queryKey: ['all-objects-recursive', activeBucketName],
    queryFn: () => r2Service.getAllFilesRecursively(),
    enabled: !!activeBucketName,
  });

  // 3. Paste mutation
  const pasteMutation = useMutation({
    mutationFn: async () => {
      if (clipboardPaths.length === 0) return;
      await r2Service.copyObjects(clipboardPaths, currentPath);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objects', activeBucketName, currentPath] });
      showLocalToast('Itens duplicados com sucesso!');
      clearSelection();
    },
    onError: (err: any) => {
      alert(err.message || 'Erro ao copiar/colar itens.');
    },
  });

  // 4. Reset Database callback
  const handleResetDatabase = async () => {
    if (
      confirm(
        'Deseja mesmo restaurar o bucket para o estado inicial? Todas as suas alterações locais do localStorage serão removidas.'
      )
    ) {
      await r2Service.resetDatabase();
      queryClient.invalidateQueries();
    }
  };

  // 5. Mass Upload execution
  const performUploadItems = async (uploadItems: UploadItem[]) => {
    let itemsToUpload = uploadItems;
    if (uploadItems.length > 100) {
      setSkippedUploads(uploadItems.length - 100, uploadItems.length);
      itemsToUpload = uploadItems.slice(0, 100);
    }

    const uploadPromises = itemsToUpload.map(async (item) => {
      const uploadId = 'up-' + Math.random().toString(36).substring(2, 11);

      const parts = item.relativePath.split('/');
      const fileParentRelPath = parts.slice(0, parts.length - 1).join('/');
      const targetParentPath = currentPath
        ? fileParentRelPath
          ? `${currentPath}/${fileParentRelPath}`
          : currentPath
        : fileParentRelPath;

      addUpload({
        id: uploadId,
        name: item.relativePath,
        size: item.file.size,
        progress: 0,
        status: 'uploading',
      });

      try {
        await r2Service.uploadObject(targetParentPath, item.file, (progress) => {
          updateUploadProgress(uploadId, progress, 'uploading');
        });
        updateUploadProgress(uploadId, 100, 'completed');
      } catch (err) {
        console.error('File upload failed inside batch:', err);
        updateUploadProgress(uploadId, 0, 'failed');
      }
    });

    await Promise.all(uploadPromises);

    // Invalidate react query to show the files on the screen automatically!
    queryClient.invalidateQueries({ queryKey: ['objects'] });
    queryClient.invalidateQueries({ queryKey: ['folders-count'] });
  };

  // 6. Search filter and partition folders & files alphabetically or dynamically
  const filteredItems = items || [];

  const getFolderRecursiveDetails = (item: R2Item) => {
    if (item.type !== 'folder') return { size: item.size || 0, count: 0, updatedAt: item.updatedAt };
    const folderPrefix = item.path.endsWith('/') ? item.path : `${item.path}/`;
    const filesInFolder = allObjects.filter(
      (obj) =>
        obj.type === 'file' &&
        (obj.path.startsWith(folderPrefix) || obj.path === item.path)
    );
    const size = filesInFolder.reduce((sum, f) => sum + (f.size || 0), 0);
    
    let updatedAt = item.updatedAt;
    if (filesInFolder.length > 0) {
      const dates = filesInFolder
        .map(f => f.updatedAt ? new Date(f.updatedAt).getTime() : 0)
        .filter(t => t > 0);
      if (dates.length > 0) {
        updatedAt = new Date(Math.max(...dates)).toISOString();
      }
    }

    return { size, count: filesInFolder.length, updatedAt };
  };

  const compareItems = (a: R2Item, b: R2Item) => {
    let comparison = 0;
    if (sortColumn === 'name') {
      comparison = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    } else if (sortColumn === 'type') {
      comparison = a.type.localeCompare(b.type);
      if (comparison === 0) {
        comparison = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
      }
    } else if (sortColumn === 'size') {
      const sizeA = a.type === 'folder' ? getFolderRecursiveDetails(a).size : (a.size || 0);
      const sizeB = b.type === 'folder' ? getFolderRecursiveDetails(b).size : (b.size || 0);
      comparison = sizeA - sizeB;
      if (comparison === 0) {
        comparison = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
      }
    } else if (sortColumn === 'updatedAt') {
      const dateA = a.type === 'folder' ? getFolderRecursiveDetails(a).updatedAt : a.updatedAt;
      const dateB = b.type === 'folder' ? getFolderRecursiveDetails(b).updatedAt : b.updatedAt;
      const timeA = dateA ? new Date(dateA).getTime() : 0;
      const timeB = dateB ? new Date(dateB).getTime() : 0;
      comparison = timeA - timeB;
      if (comparison === 0) {
        comparison = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
      }
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  };

  const foldersList = filteredItems
    .filter((i) => i.type === 'folder')
    .sort(compareItems);
  const filesList = filteredItems
    .filter((i) => i.type === 'file')
    .sort(compareItems);

  const sortedDisplayItems = [...foldersList, ...filesList];
  const allVisiblePaths = sortedDisplayItems.map((i) => i.path);

  return {
    items: filteredItems,
    isLoading,
    isRefetching,
    refetch,
    allFolders,
    allObjects,
    foldersList,
    filesList,
    sortedDisplayItems,
    allVisiblePaths,
    localSearch,
    setLocalSearch,
    handleSearchSubmit,
    localToast,
    showLocalToast,
    pasteMutation,
    handleResetDatabase,
    performUploadItems,
  };
}
