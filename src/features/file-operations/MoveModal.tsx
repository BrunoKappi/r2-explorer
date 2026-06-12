/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FolderSymlink, X, Database, Folder, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigationStore } from '../../stores/navigationStore';
import { r2Service } from '../../services/r2Service';
import Backdrop from '../../components/Backdrop';

export default function MoveModal() {
  const { t } = useTranslation();
  const { closeDialog, activeDialogTargets, currentPath, clearSelection, activeBucketName } = useNavigationStore();
  const queryClient = useQueryClient();
  const [selectedFolderId, setSelectedFolderId] = useState<string>(''); // Default empty stands for root directory
  const [error, setError] = useState('');
  const [filterQuery, setFilterQuery] = useState('');

  // Fetch all existing directories
  const { data: folders = [], isLoading } = useQuery({
    queryKey: ['folders-tree', activeBucketName],
    queryFn: () => r2Service.getAllFolders(),
  });

  const targetsCount = activeDialogTargets.length;
  const isMulti = targetsCount > 1;

  const mutation = useMutation({
    mutationFn: async () => {
      return r2Service.moveObjects(activeDialogTargets, selectedFolderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objects', activeBucketName, currentPath] });
      queryClient.invalidateQueries({ queryKey: ['folders-tree', activeBucketName] });
      queryClient.invalidateQueries({ queryKey: ['folders-count'] });
      clearSelection();
      closeDialog();
    },
    onError: (err: any) => {
      setError(err?.message || 'Failed to move objects to selected folder.');
    }
  });

  const handleMove = () => {
    setError('');
    mutation.mutate();
  };

  const getFolderDepth = (path: string) => {
    if (!path) return 0;
    return path.split('/').length;
  };

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    folder.path.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <Backdrop onClose={closeDialog}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <FolderSymlink size={15} className="text-zinc-500 dark:text-zinc-400" />
          {t('modals.move.title')}
        </h3>
        <button onClick={closeDialog} className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors text-zinc-400 dark:text-zinc-500">
          <X size={15} />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-4 text-xs font-sans">
        <p className="text-zinc-500 dark:text-zinc-300 leading-snug p-0.5">
          {isMulti 
            ? t('modals.move.targetsText_other', { count: targetsCount }) 
            : t('modals.move.targetsText_one')
          }
        </p>

        {/* Real-time Folder Search/Filter Field */}
        <div className="flex flex-col gap-1.5">
          <input
            type="text"
            placeholder={t('modals.move.filterPlaceholder')}
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="h-8.5 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-600 focus:outline-hidden text-xs rounded-md transition-all placeholder-zinc-400 dark:placeholder-zinc-500 text-zinc-800 dark:text-zinc-150"
          />
        </div>

        {isLoading ? (
          <div className="py-6 flex justify-center items-center">
            <div className="w-5 h-5 rounded-full border-2 border-zinc-200 border-t-zinc-900 dark:border-t-zinc-200 animate-spin"></div>
          </div>
        ) : (
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg max-h-48 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60 select-none bg-zinc-50/30 dark:bg-zinc-950/10 scrollbar-thin">
            {/* Root folder Option */}
            <label
              onClick={() => setSelectedFolderId('')}
              className={`flex items-center justify-between px-3.5 py-2.5 cursor-pointer text-xs transition-colors ${
                selectedFolderId === '' 
                  ? 'bg-zinc-100/80 dark:bg-zinc-800 font-semibold text-zinc-950 dark:text-zinc-50' 
                  : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/30 text-zinc-700 dark:text-zinc-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <Database size={13} className="text-zinc-400 dark:text-zinc-300" />
                <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                  {t('modals.move.rootNode', { bucketName: activeBucketName || 'bkappi' })}
                </span>
              </span>
              <input
                type="radio"
                name="target_folder"
                checked={selectedFolderId === ''}
                readOnly
                className="accent-zinc-900 dark:accent-zinc-100 w-3.5 h-3.5"
              />
            </label>

            {/* List directories recursively - HIGHER LEGIBLE CONTRAST CODES */}
            {filteredFolders.length === 0 ? (
              <div className="py-3 px-4 text-center text-[11px] text-zinc-450 dark:text-zinc-450 font-normal">
                {filterQuery ? 'Nenhuma pasta correspondente encontrada.' : 'No other folders available in the bucket.'}
              </div>
            ) : (
              filteredFolders.map((folder) => {
                const depth = getFolderDepth(folder.path);
                // Check if this folder itself is in target movers
                const isItemParentMove = activeDialogTargets.some((m) => folder.path === m || folder.path.startsWith(m + '/'));
                return (
                  <label
                    key={folder.path}
                    onClick={() => {
                      if (!isItemParentMove) setSelectedFolderId(folder.path);
                    }}
                    className={`flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                      isItemParentMove 
                        ? 'opacity-35 cursor-not-allowed bg-zinc-100/40 dark:bg-zinc-900/60 text-zinc-400 dark:text-zinc-500 font-medium' 
                        : 'cursor-pointer'
                    } ${
                      selectedFolderId === folder.path 
                        ? 'bg-zinc-100 dark:bg-zinc-800 font-bold text-zinc-950 dark:text-white' 
                        : 'hover:bg-zinc-50/90 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-100'
                    }`}
                    style={{ paddingLeft: `${depth * 14 + 14}px` }}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Folder size={13} className="text-zinc-400 dark:text-zinc-300 shrink-0" />
                      <span className="truncate pr-2">{folder.name}</span>
                    </span>
                    {!isItemParentMove && (
                      <input
                        type="radio"
                        name="target_folder"
                        checked={selectedFolderId === folder.path}
                        readOnly
                        className="accent-zinc-900 dark:accent-zinc-100 w-3.5 h-3.5 shrink-0"
                      />
                    )}
                  </label>
                );
              })
            )}
          </div>
        )}

        {error && (
          <div className="text-[11px] text-red-655 bg-red-50/60 dark:bg-red-950/20 p-2.5 rounded-md border border-red-100 dark:border-red-900/30 flex items-start gap-1.5 font-medium">
            <AlertTriangle size={13} className="shrink-0 mt-0.5 text-red-655" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800/80 pt-4 mt-1">
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={closeDialog}
            className="px-3 h-8.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors disabled:opacity-50"
          >
            {t('modals.cancel')}
          </button>
          <button
            type="button"
            onClick={handleMove}
            disabled={mutation.isPending || isLoading}
            className="px-3.5 h-8.5 text-xs font-semibold text-white dark:text-zinc-900 bg-zinc-900 dark:bg-zinc-100 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {mutation.isPending ? t('modals.move.moving') : t('modals.confirm')}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}
