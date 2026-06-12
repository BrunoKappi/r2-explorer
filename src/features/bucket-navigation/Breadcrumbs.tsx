/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChevronRight, Database } from 'lucide-react';
import { useNavigationStore } from '../../stores/navigationStore';
import { BreadcrumbItem } from '../../types';

export default function Breadcrumbs() {
  const { currentPath, setCurrentPath, activeBucketName } = useNavigationStore();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [{ label: activeBucketName || 'bkappi', path: '' }];
    
    if (!currentPath) return items;

    const parts = currentPath.split('/');
    let accum = '';
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part) {
        accum = accum ? `${accum}/${part}` : part;
        items.push({ label: part, path: accum });
      }
    }
    
    return items;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="flex items-center space-x-1.5 font-sans text-sm text-zinc-500 py-1 select-none overflow-x-auto whitespace-nowrap scrollbar-none">
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <div key={item.path} className="flex items-center space-x-1.5">
            {index > 0 && <ChevronRight size={14} className="text-zinc-300 shrink-0" />}
            
            <button
              onClick={() => setCurrentPath(item.path)}
              disabled={isLast}
              className={`flex items-center gap-1.5 px-1.5 py-1 rounded transition-colors text-xs font-medium cursor-pointer ${
                isLast
                  ? 'text-zinc-900 dark:text-zinc-100 font-semibold cursor-default bg-zinc-50 dark:bg-zinc-800/80'
                  : 'hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {index === 0 && <Database size={13} className="text-zinc-400 dark:text-zinc-500" />}
              <span>{item.label}</span>
            </button>
          </div>
        );
      })}
    </nav>
  );
}
