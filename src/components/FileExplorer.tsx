/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigationStore } from '../stores/navigationStore';

// Custom Hooks
import { useFileExplorer } from '../hooks/useFileExplorer';
import { useFolderDragAndDrop } from '../hooks/useFolderDragAndDrop';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

// Modular Subcomponents
import { FileExplorerHeader } from './file-explorer/FileExplorerHeader';
import { FileExplorerTable } from './file-explorer/FileExplorerTable';
import { FileExplorerStatus } from './file-explorer/FileExplorerStatus';

import EmptyState from './EmptyState';
import LoadingState from './LoadingState';
import ContextMenu from './ContextMenu';
import Dialogs from './Dialogs';
import BatchActionBar from './BatchActionBar';

export default function FileExplorer() {
  const { t } = useTranslation();
  const explorerRef = useRef<HTMLDivElement>(null);

  const {
    currentPath,
    closeContextMenu,
    openContextMenu,
    searchQuery,
  } = useNavigationStore();

  const {
    items,
    isLoading,
    isRefetching,
    refetch,
    sortedDisplayItems,
    allVisiblePaths,
    allObjects,
    localSearch,
    setLocalSearch,
    handleSearchSubmit,
    localToast,
    showLocalToast,
    pasteMutation,
    performUploadItems,
  } = useFileExplorer();

  const {
    isDragActive,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useFolderDragAndDrop({
    onUploadItems: performUploadItems,
  });

  useKeyboardShortcuts({
    allVisiblePaths,
    sortedDisplayItems,
    onPaste: () => pasteMutation.mutate(),
    onShowToast: showLocalToast,
  });

  const marqueeRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only primary left-click

    const target = e.target as HTMLElement;

    // Ignore interactive controls, links, menus, checkboxes, or actions
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('select') ||
      target.closest('textarea') ||
      target.closest('a') ||
      target.closest('.no-row-click') ||
      target.closest('.custom-checkbox') ||
      target.closest('[role="menu"]') ||
      target.closest('.context-menu') ||
      target.closest('.action-button')
    ) {
      return;
    }

    // Ignore if click is on vertical scrollbar
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    if (e.clientX > rect.left + container.clientWidth) {
      return;
    }

    const startX = e.clientX;
    const startY = e.clientY;
    let isSelecting = false;
    const startSelectedPaths = useNavigationStore.getState().selectedPaths;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (!isSelecting && dist > 5) {
        isSelecting = true;
        if (marqueeRef.current) {
          marqueeRef.current.style.display = 'block';
        }
      }

      if (isSelecting) {
        moveEvent.preventDefault();

        const left = Math.min(startX, moveEvent.clientX);
        const top = Math.min(startY, moveEvent.clientY);
        const right = Math.max(startX, moveEvent.clientX);
        const bottom = Math.max(startY, moveEvent.clientY);

        if (marqueeRef.current) {
          marqueeRef.current.style.left = `${left}px`;
          marqueeRef.current.style.top = `${top}px`;
          marqueeRef.current.style.width = `${right - left}px`;
          marqueeRef.current.style.height = `${bottom - top}px`;
        }

        const rows = document.querySelectorAll('[data-explorer-row="true"]');
        const newlyIntersected: string[] = [];

        rows.forEach((row) => {
          const path = row.getAttribute('data-path');
          if (!path) return;

          const rowRect = row.getBoundingClientRect();
          const overlap = !(
            rowRect.right < left ||
            rowRect.left > right ||
            rowRect.bottom < top ||
            rowRect.top > bottom
          );

          if (overlap) {
            newlyIntersected.push(path);
          }
        });

        let nextSelectedPaths: string[];
        if (moveEvent.ctrlKey || moveEvent.metaKey) {
          const mergedSet = new Set([...startSelectedPaths, ...newlyIntersected]);
          nextSelectedPaths = Array.from(mergedSet);
        } else {
          nextSelectedPaths = newlyIntersected;
        }

        const currentSelected = useNavigationStore.getState().selectedPaths;
        const isSame = currentSelected.length === nextSelectedPaths.length &&
          currentSelected.every((p) => nextSelectedPaths.includes(p)) &&
          nextSelectedPaths.every((p) => currentSelected.includes(p));

        if (!isSame) {
          useNavigationStore.setState({ selectedPaths: nextSelectedPaths });
        }
      }
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('selectstart', preventDefault);
      window.removeEventListener('dragstart', preventDefault);

      if (marqueeRef.current) {
        marqueeRef.current.style.display = 'none';
      }

      // If clicked without dragging and it was on an empty area, clear selection
      if (!isSelecting) {
        const upTarget = upEvent.target as HTMLElement;
        if (
          upTarget === container || 
          upTarget.classList.contains('flex-1') || 
          upTarget.tagName === 'TBODY' || 
          upTarget.tagName === 'TABLE' ||
          upTarget.closest('.flex-1.overflow-y-auto') && !upTarget.closest('[data-explorer-row="true"]')
        ) {
          useNavigationStore.getState().clearSelection();
        }
      }
    };

    const preventDefault = (evt: Event) => evt.preventDefault();

    window.addEventListener('mousemove', handleMouseMove, { passive: false });
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('selectstart', preventDefault);
    window.addEventListener('dragstart', preventDefault);
  };

  const handleEmptyAreaRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    closeContextMenu();
    openContextMenu(e.clientX, e.clientY, null, 'empty');
  };

  return (
    <div
      ref={explorerRef}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex-1 flex flex-col md:flex-row bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg shadow-xs overflow-hidden h-[calc(100vh-140px)] relative transition-colors duration-150"
      onClick={() => closeContextMenu()}
    >
      {localToast && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl font-sans z-50 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{localToast}</span>
        </div>
      )}

      {/* Dynamic Immersive Drag overlay */}
      {isDragActive && (
        <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs z-50 flex flex-col items-center justify-center p-6 border-4 border-dashed border-zinc-400 m-2 rounded-lg pointer-events-none transition-all">
          <div className="bg-white p-5 rounded-full shadow-2xl flex items-center justify-center text-zinc-800 animate-bounce">
            <Upload size={32} />
          </div>
          <p className="text-white font-semibold text-lg mt-4 shadow-sm text-center">
            {t('status.draggingOverlayTitle')}
          </p>
          <p className="text-zinc-200 text-xs mt-1 shadow-sm text-center">
            {t('status.draggingOverlaySubtitle', { path: currentPath || '/' })}
          </p>
        </div>
      )}

      {/* LEFT COMPARTMENT (Explorer Table & Toolbar) */}
      <div className="flex-1 flex flex-col min-w-0" onContextMenu={handleEmptyAreaRightClick}>
        <FileExplorerHeader
          localSearch={localSearch}
          setLocalSearch={setLocalSearch}
          handleSearchSubmit={handleSearchSubmit}
          isLoading={isLoading || isRefetching}
          onRefresh={refetch}
        />

        {/* CONTAINER MAIN LIST PANEL */}
        <div 
          onMouseDown={handleMouseDown}
          className="flex-1 overflow-y-auto min-h-0 bg-white dark:bg-zinc-900 relative flex flex-col justify-between transition-colors scrollbar-thin select-none"
        >
          <div>
            {isLoading ? (
              <div className="p-4">
                <LoadingState />
              </div>
            ) : sortedDisplayItems.length === 0 ? (
              <EmptyState isSearch={!!searchQuery} />
            ) : (
              <div className="overflow-x-auto scrollbar-thin">
                <FileExplorerTable
                  sortedDisplayItems={sortedDisplayItems}
                  allVisiblePaths={allVisiblePaths}
                  allObjects={allObjects}
                />
              </div>
            )}
          </div>

          {/* Center Drag & Drop placeholder footer exactly as in screenshot */}
          <div className="flex items-center justify-center gap-2 py-4 text-zinc-400 dark:text-zinc-500 text-xs border-t border-zinc-50 dark:border-zinc-800/80 select-none bg-zinc-50/20 dark:bg-zinc-950/20 shrink-0 transition-colors">
            <Upload size={13} className="text-zinc-400 dark:text-zinc-500" />
            <span>{t('status.dragDropFooter')}</span>
          </div>
        </div>

        <FileExplorerStatus totalItems={items.length} />
      </div>

      {/* Context menus, dialog popups, and batch selection panels */}
      <ContextMenu />
      <Dialogs />
      <BatchActionBar />

      {/* Visual Translucid Selection Box marquee */}
      <div
        ref={marqueeRef}
        className="fixed border border-blue-500/60 bg-blue-500/15 pointer-events-none z-50 rounded shadow-3xs"
        style={{ display: 'none' }}
      />
    </div>
  );
}
