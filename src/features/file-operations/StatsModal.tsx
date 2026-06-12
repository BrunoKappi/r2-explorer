/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Database, X, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigationStore } from '../../stores/navigationStore';
import { r2Service } from '../../services/r2Service';
import { formatBytes } from '../../utils/fileUtils';
import Backdrop from '../../components/Backdrop';

export default function StatsModal() {
  const { t } = useTranslation();
  const { closeDialog, activeBucketName } = useNavigationStore();
  
  // 1. Fetch ALL files inside the bucket recursively
  const { data: allFiles = [], isLoading: isLoadingFiles } = useQuery<any[]>({
    queryKey: ['all-files-recursive', activeBucketName],
    queryFn: () => r2Service.getAllFilesRecursively(),
  });

  // 2. Fetch all folders
  const { data: allFolders = [], isLoading: isLoadingFolders } = useQuery<any[]>({
    queryKey: ['folders-count', activeBucketName],
    queryFn: () => r2Service.getAllFolders(),
  });

  const totalFiles = allFiles.length;
  const totalFolders = allFolders.length;

  // Calculate cumulative size of all files
  const totalSizeBytes = allFiles.reduce((acc, f) => acc + (f.size || 0), 0);
  
  // Let the reference limit be 10 GB
  const LIMIT_BYTES = 10 * 1024 * 1024 * 1024; // 10 GB
  const percentage = Math.min(100, Math.max(0.1, (totalSizeBytes / LIMIT_BYTES) * 100));
  const percentageStr = totalSizeBytes > 0 ? `${percentage.toFixed(2)}%` : '0%';

  const isLoading = isLoadingFiles || isLoadingFolders;

  return (
    <Backdrop onClose={closeDialog}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Database size={15} className="text-zinc-500 dark:text-zinc-400" />
          {t('modals.stats.title')}: {activeBucketName || 'bkappi'}
        </h3>
        <button onClick={closeDialog} className="text-zinc-400 dark:text-zinc-555 hover:text-zinc-600 dark:hover:text-zinc-200 rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors">
          <X size={15} />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-4 text-xs font-sans font-medium">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-zinc-500">
            <Loader2 size={24} className="animate-spin text-zinc-400 dark:text-zinc-500" />
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{t('modals.stats.refreshing')}</span>
          </div>
        ) : (
          <div className="bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800 p-4 rounded-xl flex flex-col gap-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Bucket Name</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-mono font-bold">{activeBucketName || 'bkappi'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">{t('modals.stats.totalFiles')}</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-mono font-bold">{totalFiles}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">{t('modals.stats.totalFolders')}</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-mono font-bold">{totalFolders}</span>
            </div>

            <div className="h-px bg-zinc-200/60 dark:bg-zinc-800 my-1" />
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[10.5px] font-bold text-zinc-500 dark:text-zinc-400 font-mono">
                <span>{t('modals.stats.totalSize')}</span>
                <span>{formatBytes(totalSizeBytes)} / 10 GB</span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-zinc-800 dark:bg-zinc-100 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${totalSizeBytes > 0 ? percentage : 0}%` }}
                ></div>
              </div>
              <div className="flex justify-end text-[9px] text-zinc-400 dark:text-zinc-505 font-mono">
                S3 Flat: {percentageStr} used
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-zinc-200/60 dark:border-zinc-800/85 pt-4 mt-1">
          <button
            type="button"
            onClick={closeDialog}
            className="px-4 h-8.5 text-xs font-semibold text-white dark:text-zinc-900 bg-zinc-900 dark:bg-zinc-100 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer shadow-sm transition-all"
          >
            {t('modals.close')}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}
