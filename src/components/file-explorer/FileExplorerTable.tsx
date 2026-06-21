/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigationStore } from '../../stores/navigationStore';
import { R2Item } from '../../types';
import FileRow from '../FileRow';
import FileGridCard from '../FileGridCard';

interface FileExplorerTableProps {
  sortedDisplayItems: R2Item[];
  allVisiblePaths: string[];
  allObjects?: R2Item[];
}

export function FileExplorerTable({ sortedDisplayItems, allVisiblePaths, allObjects }: FileExplorerTableProps) {
  const { t } = useTranslation();
  const { 
    selectedPaths, 
    selectAll, 
    clearSelection,
    sortColumn,
    sortDirection,
    setSort,
    viewMode,
  } = useNavigationStore();

  const areAllSelected =
    sortedDisplayItems.length > 0 && selectedPaths.length === sortedDisplayItems.length;

  const handleSelectAllClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (areAllSelected) {
      clearSelection();
    } else {
      selectAll(allVisiblePaths);
    }
  };

  const renderSortHeader = (
    label: string, 
    col: 'name' | 'type' | 'size' | 'updatedAt', 
    textAlign: 'left' | 'right' = 'left', 
    widthClass?: string
  ) => {
    const isSorted = sortColumn === col;
    return (
      <th
        onClick={() => setSort(col)}
        className={`px-3 py-2 ${textAlign === 'right' ? 'text-right' : 'text-left'} font-semibold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer select-none group/col transition-colors ${widthClass || ''}`}
      >
        <div className={`flex items-center gap-1 ${textAlign === 'right' ? 'justify-end' : 'justify-start'}`}>
          <span>{label}</span>
          <span className={`inline-flex transition-all duration-150 ${isSorted ? 'opacity-100' : 'opacity-0 group-hover/col:opacity-100'}`}>
            {isSorted ? (
              sortDirection === 'asc' ? <ArrowUp size={11} className="text-zinc-650 dark:text-zinc-300" /> : <ArrowDown size={11} className="text-zinc-650 dark:text-zinc-300" />
            ) : (
              <ArrowUp size={11} className="text-zinc-350 dark:text-zinc-600" />
            )}
          </span>
        </div>
      </th>
    );
  };

  if (viewMode !== 'details') {
    const isMosaic = viewMode === 'mosaic';
    return (
      <div 
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            clearSelection();
          }
        }}
        className={isMosaic
          ? "p-5 flex flex-row flex-wrap gap-4 transition-all duration-150 select-none"
          : `p-5 grid transition-all duration-150 select-none ${
              viewMode === 'icons-sm' ? 'grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2.5' :
              viewMode === 'icons-md' ? 'grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3' :
              viewMode === 'icons-lg' ? 'grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4' :
              'grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5' // icons-xl
            }`
        }
      >
        {sortedDisplayItems.map((item) => (
          <FileGridCard 
            key={item.id} 
            item={item} 
            viewMode={viewMode}
            allVisiblePaths={allVisiblePaths} 
            allObjects={allObjects} 
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full relative select-none">
      <table className="w-full border-collapse text-left select-none relative">
        {/* Core Table Header */}
        <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 text-[10.5px] font-semibold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider sticky top-0 z-10 select-none transition-colors">
          <tr className="h-9">
            <th className="pl-4 pr-1 py-2 w-10 text-left font-semibold">
              <div
                onClick={handleSelectAllClick}
                className={`h-4 w-4 rounded-md border flex items-center justify-center transition-all duration-150 cursor-pointer ${
                  areAllSelected
                    ? 'bg-zinc-800 border-zinc-800 text-white shadow-3xs dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900'
                    : 'border-zinc-300 hover:border-zinc-400 bg-white dark:border-zinc-700 dark:hover:border-zinc-600 dark:bg-zinc-950/40'
                }`}
              >
                {areAllSelected && (
                  <svg className="w-2.5 h-2.5 stroke-2 stroke-current" viewBox="0 0 24 24" fill="none">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </th>
            {renderSortHeader(t('table.name'), 'name', 'left')}
            {renderSortHeader(t('table.type'), 'type', 'left', 'w-32')}
            <th className="px-3 py-2 text-right w-24 font-semibold text-zinc-400 dark:text-zinc-500">{t('table.items')}</th>
            {renderSortHeader(t('table.size'), 'size', 'right', 'w-24')}
            {renderSortHeader(t('table.lastModified'), 'updatedAt', 'left', 'w-48')}
            <th className="pr-4 pl-1 py-2 text-right w-10 font-semibold text-zinc-400 dark:text-zinc-500"></th>
          </tr>
        </thead>

        {/* Item Rows body */}
        <tbody onClick={(e) => {
          // Clear selection ONLY if clicking the direct empty body spacing, not rows
          if (e.target === e.currentTarget) {
            clearSelection();
          }
        }} className="relative">
          {sortedDisplayItems.map((item) => (
            <FileRow key={item.id} item={item} allVisiblePaths={allVisiblePaths} allObjects={allObjects} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
