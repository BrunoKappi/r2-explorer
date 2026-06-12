/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FolderX, Plus, UploadCloud } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigationStore } from '../stores/navigationStore';

interface EmptyStateProps {
  isSearch: boolean;
}

export default function EmptyState({ isSearch }: EmptyStateProps) {
  const { t } = useTranslation();
  const { openDialog } = useNavigationStore();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center select-none font-sans max-w-sm mx-auto animate-in fade-in duration-300">
      <div className="p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full text-zinc-400 dark:text-zinc-500 mb-4 shrink-0 transition-colors">
        <FolderX size={26} className="stroke-[1.5]" />
      </div>

      <h3 className="text-zinc-800 dark:text-zinc-200 font-semibold text-xs uppercase tracking-wider transition-colors">
        {isSearch ? t('emptyState.noItemsFound') : t('emptyState.emptyDirectory')}
      </h3>
      
      <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-normal mt-1.5 font-medium transition-colors">
        {isSearch
          ? t('emptyState.noResultsMatch')
          : t('emptyState.emptyBucketPrefix')}
      </p>

      {!isSearch && (
        <div className="flex items-center gap-2 mt-6 flex-nowrap whitespace-nowrap shrink-0">
          <button
            onClick={() => openDialog('create_folder')}
            className="whitespace-nowrap h-8.5 px-3 border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-300 bg-white dark:bg-zinc-900 rounded-md text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 shrink-0"
          >
            <Plus size={13} />
            {t('emptyState.newFolder')}
          </button>
          
          <button
            onClick={() => openDialog('upload')}
            className="whitespace-nowrap h-8.5 px-3 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-md text-xs font-semibold cursor-pointer shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
          >
            <UploadCloud size={13} />
            {t('emptyState.uploadFile')}
          </button>
        </div>
      )}
    </div>
  );
}
