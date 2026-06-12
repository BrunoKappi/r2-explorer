/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import {
  FolderOpen,
  Edit2,
  Trash2,
  Copy,
  Info,
  Download,
  Share2,
  FolderPlus,
  Upload,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigationStore } from '../stores/navigationStore';
import { useQueryClient } from '@tanstack/react-query';
import { r2Service } from '../services/r2Service';
import { getShareUrl } from '../utils/fileUtils';

export default function ContextMenu() {
  const { t } = useTranslation();
  const {
    contextMenu,
    closeContextMenu,
    setCurrentPath,
    openDialog,
    currentPath,
    selectedPaths,
    selectPath,
    activeBucketName,
  } = useNavigationStore();

  const menuRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { isOpen, x, y, targetPath, targetType } = contextMenu;

  // Track position to avoid overflowing viewport
  const [coordinates, setCoordinates] = useState({ posX: 0, posY: 0 });

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const menuWidth = menuRef.current.offsetWidth || 180;
      const menuHeight = menuRef.current.offsetHeight || 280;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      let nextX = x;
      let nextY = y;

      // Avoid overflowing right
      if (x + menuWidth > screenWidth) {
        nextX = screenWidth - menuWidth - 10;
      }
      // Avoid overflowing bottom
      if (y + menuHeight > screenHeight) {
        nextY = screenHeight - menuHeight - 10;
      }

      setCoordinates({ posX: nextX, posY: nextY });
    }
  }, [isOpen, x, y]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeContextMenu();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeContextMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeContextMenu]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
      closeContextMenu();
    }, 1500);
  };

  const contextMenuFallbackCopy = (text: string, successToastKey: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(t(successToastKey));
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  const handleCopyPath = () => {
    if (!targetPath) return;
    const cdnUrl = getShareUrl(activeBucketName, targetPath);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cdnUrl)
        .then(() => {
          showToast(t('contextMenu.toastPathCopied'));
        })
        .catch((err) => {
          console.error('Clipboard copy failed, using fallback:', err);
          contextMenuFallbackCopy(cdnUrl, 'contextMenu.toastPathCopied');
        });
    } else {
      contextMenuFallbackCopy(cdnUrl, 'contextMenu.toastPathCopied');
    }
  };

  const handleShare = () => {
    if (!targetPath) return;
    const cdnUrl = getShareUrl(activeBucketName, targetPath);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cdnUrl)
        .then(() => {
          showToast(t('contextMenu.toastShareCopied'));
        })
        .catch((err) => {
          console.error('Clipboard copy failed, using fallback:', err);
          contextMenuFallbackCopy(cdnUrl, 'contextMenu.toastShareCopied');
        });
    } else {
      contextMenuFallbackCopy(cdnUrl, 'contextMenu.toastShareCopied');
    }
  };

  const handleDownload = async () => {
    if (!targetPath) return;
    const path = targetPath;
    const type = targetType;
    
    // Close the context menu immediately to avoid updating state on unmounted components
    closeContextMenu();

    try {
      if (type === 'folder') {
        showToast(t('contextMenu.toastPrepZip'));
        await r2Service.downloadZip([path]);
      } else {
        showToast(t('contextMenu.toastStartFile'));
        await r2Service.downloadFile(path);
      }
    } catch (err: any) {
      alert(err.message || 'Error downloading.');
    }
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['objects', currentPath] });
    showToast(t('contextMenu.toastDirUpdated'));
  };

  const handleOpenFolder = () => {
    if (targetPath) {
      setCurrentPath(targetPath);
    }
    closeContextMenu();
  };

  return (
    <>
      {/* Tiny floating toast notification inside explorer */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-3 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-md shadow-lg text-xs font-sans font-medium animate-in fade-in slide-in-from-top-2 duration-100 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          {toastMessage}
        </div>
      )}

      <div
        ref={menuRef}
        style={{ top: coordinates.posY, left: coordinates.posX }}
        className="fixed z-40 w-52 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-lg shadow-xl py-1 px-1 flex flex-col font-sans select-none text-xs text-zinc-700 dark:text-zinc-200 animate-in fade-in zoom-in-95 duration-100 transition-colors"
      >
        {targetType === 'folder' && (
          <>
            <button
              onClick={handleOpenFolder}
              className="flex items-center justify-between w-full text-left px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white rounded cursor-pointer"
            >
              <span className="flex items-center gap-2 font-medium">
                <FolderOpen size={14} className="text-zinc-500 shrink-0" />
                {t('contextMenu.open')}
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">Enter</span>
            </button>
            <button
              onClick={() => {
                openDialog('create_folder', targetPath);
                closeContextMenu();
              }}
              className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white rounded cursor-pointer"
            >
              <FolderPlus size={14} className="text-zinc-500 shrink-0" />
              {t('contextMenu.createSubfolder')}
            </button>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1" />
          </>
        )}

        {targetType !== 'empty' && (
          <>
            <button
              onClick={() => {
                if (targetPath) openDialog('details', targetPath);
                closeContextMenu();
              }}
              className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white rounded cursor-pointer font-medium text-zinc-900 dark:text-zinc-100"
            >
              <Eye size={14} className="text-zinc-500 shrink-0" />
              {t('contextMenu.view')}
            </button>
            <button
              onClick={() => {
                if (targetPath) openDialog('rename', targetPath);
                closeContextMenu();
              }}
              className="flex items-center justify-between w-full text-left px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white rounded cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Edit2 size={14} className="text-zinc-500 shrink-0" />
                {t('contextMenu.rename')}
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-550 font-mono">F2</span>
            </button>
            <button
              onClick={() => {
                if (targetPath) openDialog('move', targetPath);
                closeContextMenu();
              }}
              className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white rounded cursor-pointer"
            >
              <FolderOpen size={14} className="text-zinc-500 shrink-0" />
              {t('contextMenu.moveItem')}
            </button>
            <button
              onClick={handleCopyPath}
              className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white rounded cursor-pointer"
            >
              <Copy size={14} className="text-zinc-500 shrink-0" />
              {t('contextMenu.copyPath')}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white rounded cursor-pointer"
            >
              <Share2 size={14} className="text-zinc-500 shrink-0" />
              {t('contextMenu.shareLink')}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white rounded cursor-pointer"
            >
              <Download size={14} className="text-zinc-500 shrink-0" />
              {targetType === 'folder' ? t('contextMenu.downloadFolder') : t('contextMenu.downloadFile')}
            </button>
            <button
              onClick={() => {
                if (targetPath) openDialog('details', targetPath);
                closeContextMenu();
              }}
              className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white rounded cursor-pointer"
            >
              <Info size={14} className="text-zinc-500 shrink-0" />
              {t('contextMenu.properties')}
            </button>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1" />
            <button
              onClick={() => {
                if (targetPath) {
                  const targets = selectedPaths.includes(targetPath) ? selectedPaths : [targetPath];
                  openDialog('delete', targets);
                }
                closeContextMenu();
              }}
              className="flex items-center justify-between w-full text-left px-2 py-1.5 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-705 dark:hover:text-red-400 rounded cursor-pointer font-medium"
            >
              <span className="flex items-center gap-2">
                <Trash2 size={14} className="shrink-0" />
                {t('contextMenu.delete')}
              </span>
              <span className="text-[10px] font-mono">Delete</span>
            </button>
          </>
        )}

        {targetType === 'empty' && (
          <>
            <button
              onClick={() => {
                openDialog('create_folder');
                closeContextMenu();
              }}
              className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white rounded cursor-pointer font-medium text-zinc-900 dark:text-zinc-100"
            >
              <FolderPlus size={14} className="text-zinc-500 shrink-0" />
              {t('contextMenu.newFolder')}
            </button>
            <button
              onClick={() => {
                openDialog('upload');
                closeContextMenu();
              }}
              className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white rounded cursor-pointer text-zinc-700 dark:text-zinc-300"
            >
              <Upload size={14} className="text-zinc-500 shrink-0" />
              {t('contextMenu.uploadFile')}
            </button>
            <button
              onClick={() => {
                openDialog('upload');
                closeContextMenu();
              }}
              className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white rounded cursor-pointer text-zinc-700 dark:text-zinc-300"
            >
              <FolderOpen size={14} className="text-zinc-500 shrink-0" />
              {t('contextMenu.uploadFolder')}
            </button>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1" />
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white rounded cursor-pointer text-zinc-700 dark:text-zinc-300"
            >
              <RefreshCw size={14} className="text-zinc-500 shrink-0" />
              {t('contextMenu.refresh')}
            </button>
          </>
        )}
      </div>
    </>
  );
}
