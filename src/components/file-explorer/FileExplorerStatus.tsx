/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useTranslation } from 'react-i18next';
import { useNavigationStore } from '../../stores/navigationStore';

interface FileExplorerStatusProps {
  totalItems: number;
}

export function FileExplorerStatus({ totalItems }: FileExplorerStatusProps) {
  const { t } = useTranslation();
  const { selectedPaths, activeBucketName, currentPath } = useNavigationStore();

  return (
    <div className="h-9 px-4 bg-zinc-50 dark:bg-zinc-900/90 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between font-sans text-[10.5px] text-zinc-500 dark:text-zinc-400 select-none shrink-0 transition-colors duration-200">
      <div className="flex items-center gap-3">
        <span>{t('status.objectsListed', { count: totalItems })}</span>
        {selectedPaths.length > 0 && (
          <span className="text-zinc-800 dark:text-zinc-200 font-semibold md:flex md:items-center md:gap-1">
            <span className="w-1.5 h-1.5 bg-zinc-300 dark:bg-zinc-600 rounded-full inline-block mr-1"></span>
            {t('status.selectedOf', { selected: selectedPaths.length, total: totalItems })}
          </span>
        )}
      </div>
      <span className="font-mono text-[9.5px] text-zinc-400 dark:text-zinc-500">
        r2://{activeBucketName || 'bkappi'}/{currentPath}
      </span>
    </div>
  );
}
