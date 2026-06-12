/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Upload, X, Plus, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigationStore } from '../../stores/navigationStore';
import { r2Service } from '../../services/r2Service';
import { formatBytes } from '../../utils/fileUtils';
import Backdrop from '../../components/Backdrop';

interface ModalUploadItem {
  file: File;
  relativePath: string;
}

export default function UploadModal() {
  const { t } = useTranslation();
  const { 
    closeDialog, 
    currentPath, 
    addUpload, 
    updateUploadProgress,
    setSkippedUploads,
    clearSkippedUploads
  } = useNavigationStore();
  const queryClient = useQueryClient();
  
  const [selectedItems, setSelectedItems] = useState<ModalUploadItem[]>([]);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [truncatedDetails, setTruncatedDetails] = useState<{ skipped: number; total: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      const items: ModalUploadItem[] = files.map((file) => ({
        file,
        relativePath: file.name,
      }));
      if (items.length > 100) {
        setError(`Warning: R2 limits uploads to 100 files at a time. ${items.length} items were selected, but only the first 100 will be processed. The remaining ${items.length - 100} items were omitted.`);
        setSelectedItems(items.slice(0, 100));
        setTruncatedDetails({ skipped: items.length - 100, total: items.length });
      } else {
        setSelectedItems(items);
        setTruncatedDetails(null);
        setError('');
      }
    }
  };

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      const items: ModalUploadItem[] = files.map((file) => ({
        file,
        relativePath: (file as any).webkitRelativePath || file.name,
      }));
      if (items.length > 100) {
        setError(`Warning: R2 limits uploads to 100 files at a time. ${items.length} items were selected, but only the first 100 will be processed. The remaining ${items.length - 100} items were omitted.`);
        setSelectedItems(items.slice(0, 100));
        setTruncatedDetails({ skipped: items.length - 100, total: items.length });
      } else {
        setSelectedItems(items);
        setTruncatedDetails(null);
        setError('');
      }
    }
  };

  const startUpload = async () => {
    if (selectedItems.length === 0) return;

    setIsUploading(true);
    setError('');

    if (truncatedDetails) {
      setSkippedUploads(truncatedDetails.skipped, truncatedDetails.total);
    } else {
      clearSkippedUploads();
    }

    const uploadPromises = selectedItems.map(async (item) => {
      const uploadId = 'up-' + Math.random().toString(36).substring(2, 11);
      
      const parts = item.relativePath.split('/');
      const fileParentRelPath = parts.slice(0, parts.length - 1).join('/');
      const targetParentPath = currentPath 
        ? (fileParentRelPath ? `${currentPath}/${fileParentRelPath}` : currentPath)
        : fileParentRelPath;

      addUpload({
        id: uploadId,
        name: item.relativePath,
        size: item.file.size,
        progress: 0,
        status: 'uploading'
      });

      try {
        await r2Service.uploadObject(targetParentPath, item.file, (progress) => {
          updateUploadProgress(uploadId, progress, 'uploading');
        });
        updateUploadProgress(uploadId, 100, 'completed');
      } catch (err) {
        console.error('File upload failed inside modal:', err);
        updateUploadProgress(uploadId, 0, 'failed');
      }
    });

    closeDialog();

    Promise.all(uploadPromises).then(() => {
      queryClient.invalidateQueries({ queryKey: ['objects'] });
      queryClient.invalidateQueries({ queryKey: ['folders-count'] });
    }).catch((err) => {
      console.error('Batch finalize failure:', err);
    });
  };

  const totalSize = selectedItems.reduce((acc, curr) => acc + curr.file.size, 0);

  return (
    <Backdrop onClose={closeDialog}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Upload size={15} className="text-zinc-500 dark:text-zinc-400" />
          {t('modals.upload.title')}
        </h3>
        <button onClick={closeDialog} className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors text-zinc-400 dark:text-zinc-500">
          <X size={15} />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-4 text-xs font-sans">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />
        <input
          ref={folderInputRef}
          type="file"
          {...{ webkitdirectory: '', directory: '' }}
          multiple
          onChange={handleFolderChange}
          disabled={isUploading}
          className="hidden"
        />

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex flex-col items-center justify-center p-5 border border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-350 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20 rounded-xl cursor-pointer transition-all gap-2 text-center"
          >
            <Upload size={18} className="text-zinc-500 dark:text-zinc-400" />
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">{t('modals.upload.selectFiles')}</span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-550">Supports multiple files</span>
          </button>

          <button
            onClick={() => folderInputRef.current?.click()}
            disabled={isUploading}
            className="flex flex-col items-center justify-center p-5 border border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-350 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20 rounded-xl cursor-pointer transition-all gap-2 text-center"
          >
            <Plus size={18} className="text-zinc-500 dark:text-zinc-400" />
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">{t('modals.upload.selectFolder')}</span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-550">Recursive upload</span>
          </button>
        </div>

        {selectedItems.length > 0 && (
          <div className="flex flex-col gap-2 p-3 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800 rounded-xl max-h-40 overflow-y-auto">
            <div className="flex justify-between items-center text-[10.5px] border-b border-zinc-200/60 dark:border-zinc-800 pb-1.5 mb-1 bg-zinc-50 dark:bg-zinc-950 sticky top-0">
              <span className="font-bold text-zinc-800 dark:text-zinc-300">
                {t('modals.upload.selectedFilesCount', { count: selectedItems.length })}
              </span>
              <span className="font-mono text-zinc-500 dark:text-zinc-400">{formatBytes(totalSize)}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              {selectedItems.slice(0, 50).map((item, idx) => (
                <div key={idx} className="flex justify-between text-[10px] text-zinc-600 dark:text-zinc-300 truncate gap-2 font-mono">
                  <span className="truncate max-w-[240px] font-sans" title={item.relativePath}>{item.relativePath}</span>
                  <span className="text-zinc-500 dark:text-zinc-500 uppercase font-mono shrink-0">{formatBytes(item.file.size)}</span>
                </div>
              ))}
              {selectedItems.length > 50 && (
                <p className="text-[9.5px] text-zinc-400 dark:text-zinc-400 italic mt-1 text-center font-medium font-sans">
                  ...and {selectedItems.length - 50} more items.
                </p>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="text-[11px] text-red-650 bg-red-50/60 dark:bg-red-950/20 p-2.5 rounded-md border border-red-100 dark:border-red-900/30 flex items-start gap-1.5 font-medium">
            <AlertTriangle size={13} className="shrink-0 mt-0.5 text-red-650" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-between items-center border-t border-zinc-100 dark:border-zinc-800/80 pt-4 mt-1">
          <div className="flex gap-2 ms-auto">
            <button
              type="button"
              disabled={isUploading}
              onClick={closeDialog}
              className="px-3 h-8.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors disabled:opacity-50"
            >
              {t('modals.cancel')}
            </button>
            <button
              type="button"
              onClick={startUpload}
              disabled={isUploading || selectedItems.length === 0}
              className="px-3.5 h-8.5 text-xs font-semibold text-white dark:text-zinc-900 bg-zinc-900 dark:bg-zinc-100 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isUploading ? '...' : t('header.upload')}
            </button>
          </div>
        </div>
      </div>
    </Backdrop>
  );
}
