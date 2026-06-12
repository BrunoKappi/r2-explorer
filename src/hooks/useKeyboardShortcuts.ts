/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { useNavigationStore } from '../stores/navigationStore';
import { R2Item } from '../types';

interface UseKeyboardShortcutsOptions {
  allVisiblePaths: string[];
  sortedDisplayItems: R2Item[];
  onPaste: () => void;
  onShowToast: (msg: string) => void;
}

export function useKeyboardShortcuts({
  allVisiblePaths,
  sortedDisplayItems,
  onPaste,
  onShowToast,
}: UseKeyboardShortcutsOptions) {
  const {
    selectedPaths,
    selectAll,
    copySelectionToClipboard,
    clipboardPaths,
    openDialog,
    setCurrentPath,
  } = useNavigationStore();

  useEffect(() => {
    const handleGlobalHotkeys = (e: KeyboardEvent) => {
      // Skip hotkeys if user is editing inputs or textareas
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      // Ctrl + A or Cmd + A -> Select all visible items
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        selectAll(allVisiblePaths);
      }

      // Ctrl + C or Cmd + C -> Copy selected files to clipboard helper
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        if (selectedPaths.length > 0) {
          e.preventDefault();
          copySelectionToClipboard();
          onShowToast(`${selectedPaths.length} item(s) copiado(s). Use Ctrl+V para colar.`);
        }
      }

      // Ctrl + V or Cmd + V -> Paste copied files with copy suffix
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        if (clipboardPaths.length > 0) {
          e.preventDefault();
          onPaste();
        }
      }

      // Delete key -> Delete selected items
      if (e.key === 'Delete' && selectedPaths.length > 0) {
        e.preventDefault();
        openDialog('delete', selectedPaths);
      }

      // F2 key -> Rename selected item (applies only for single item)
      if (e.key === 'F2' && selectedPaths.length === 1) {
        e.preventDefault();
        openDialog('rename', selectedPaths[0]);
      }

      // Enter key -> Open folder or Preview File
      if (e.key === 'Enter' && selectedPaths.length === 1) {
        e.preventDefault();
        const path = selectedPaths[0];
        const selectedItem = sortedDisplayItems.find((i) => i.path === path);
        if (selectedItem) {
          if (selectedItem.type === 'folder') {
            setCurrentPath(selectedItem.path);
          } else {
            openDialog('details', selectedItem.path);
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalHotkeys);
    return () => window.removeEventListener('keydown', handleGlobalHotkeys);
  }, [
    selectedPaths,
    allVisiblePaths,
    clipboardPaths,
    sortedDisplayItems,
    selectAll,
    copySelectionToClipboard,
    openDialog,
    setCurrentPath,
    onPaste,
    onShowToast,
  ]);
}
