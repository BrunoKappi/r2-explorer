/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Layers, X, Folder, File, Image as ImageIcon, Video, FileText, Database, CloudLightning, Hash, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigationStore } from '../../stores/navigationStore';
import { r2Service } from '../../services/r2Service';
import { R2Item } from '../../types';
import { formatBytes, getShareUrl } from '../../utils/fileUtils';
import Backdrop from '../../components/Backdrop';

function getFileIcon(mime: string) {
  if (mime === 'directory') return <Folder className="text-zinc-400 shrink-0" size={16} />;
  if (mime.startsWith('image/')) return <ImageIcon className="text-zinc-400 shrink-0" size={16} />;
  if (mime.startsWith('video/')) return <Video className="text-zinc-400 shrink-0" size={16} />;
  if (mime.includes('pdf')) return <FileText className="text-amber-500 shrink-0" size={16} />;
  return <File className="text-zinc-400 shrink-0" size={16} />;
}

export default function DetailsModal() {
  const { t, i18n } = useTranslation();
  const { closeDialog, activeDialogTarget } = useNavigationStore();
  const [item, setItem] = useState<R2Item | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const targetPath = activeDialogTarget || '';

  useEffect(() => {
    let active = true;
    const fetchItem = async () => {
      setLoading(true);
      try {
        const parts = targetPath.split('/');
        const parentOfTarget = parts.slice(0, parts.length - 1).join('/');
        
        // Check cache first
        const bucketName = useNavigationStore.getState().activeBucketName || 'bkappi';
        const cached = queryClient.getQueryData<R2Item[]>(['objects', bucketName, parentOfTarget]);
        let found = cached?.find((i) => i.path === targetPath);
        
        if (!found) {
          // Fetch from API
          const data = await r2Service.listObjects(parentOfTarget);
          found = data.find((i) => i.path === targetPath);
        }
        
        if (active && found) {
          setItem(found);
        }
      } catch (err) {
        console.error('Error fetching item details:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchItem();
    return () => { active = false; };
  }, [targetPath, queryClient]);

  const handleCopyLink = () => {
    if (!item?.path) return;
    const bucketName = useNavigationStore.getState().activeBucketName;
    const cdnUrl = item.publicUrl || getShareUrl(bucketName, item.path);
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cdnUrl)
        .then(() => {
          alert(t('modals.details.copied'));
        })
        .catch((err) => {
          console.error('Clipboard API failed, using fallback:', err);
          fallbackCopyText(cdnUrl);
        });
    } else {
      fallbackCopyText(cdnUrl);
    }
  };

  const fallbackCopyText = (text: string) => {
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
      alert(t('modals.details.copied'));
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <Backdrop onClose={closeDialog}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Layers size={15} className="text-zinc-500 dark:text-zinc-400 shrink-0" />
          {t('modals.details.title')}
        </h3>
        <button onClick={closeDialog} className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors text-zinc-400 dark:text-zinc-500">
          <X size={15} />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-4 text-xs font-sans max-h-[80vh] overflow-y-auto scrollbar-thin">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-zinc-350 dark:border-zinc-700 border-t-zinc-900 dark:border-t-zinc-300 animate-spin"></div>
            <span className="text-zinc-400 dark:text-zinc-555 text-xs">Loading metadata...</span>
          </div>
        ) : !item ? (
          <div className="py-6 text-center text-zinc-500 dark:text-zinc-400">{t('emptyState.noItemsFound')}</div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Image/Video Preview Window */}
            {item.type === 'file' && item.publicUrl && (item.mimeType.startsWith('image/') || item.mimeType.startsWith('video/')) && (
              <div className="w-full h-44 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-hidden overflow-hidden flex items-center justify-center relative select-none">
                {item.mimeType.startsWith('image/') ? (
                   <img
                    src={item.publicUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <video
                    src={item.publicUrl}
                    controls
                    className="w-full h-full object-contain p-1"
                    playsInline
                  />
                )}
              </div>
            )}

            {/* General Header */}
            <div className="flex items-start gap-3 p-3 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800 rounded-xl">
              <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shrink-0">
                {getFileIcon(item.mimeType)}
              </div>
              <div className="overflow-hidden w-full">
                <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 text-xs break-all leading-snug">{item.name}</h4>
                <p className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 uppercase">
                  {item.type === 'folder' ? 'Folder' : formatBytes(item.size)}
                </p>
              </div>
            </div>

            {/* Key-Value monospaced attributes table */}
            <div className="flex flex-col border border-zinc-200/60 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950/40 font-sans">
              {/* Path */}
              <div className="flex border-b border-zinc-100 dark:border-zinc-800/80 py-2.5 px-3">
                <div className="w-1/3 font-semibold text-zinc-400 dark:text-zinc-505 text-[10px] uppercase tracking-wider flex items-center gap-1 max-w-[120px]">
                  <Database size={11} />
                  {t('modals.details.fileName')}
                </div>
                <div className="w-2/3 font-mono text-[10.5px] text-zinc-800 dark:text-zinc-200 break-all select-all pt-0.5">
                  {item.path}
                </div>
              </div>

              {/* Type */}
              <div className="flex border-b border-zinc-100 dark:border-zinc-800/80 py-2.5 px-3">
                <div className="w-1/3 font-semibold text-zinc-400 dark:text-zinc-505 text-[10px] uppercase tracking-wider flex items-center gap-1 max-w-[120px]">
                  <CloudLightning size={11} />
                  {t('modals.details.type')}
                </div>
                <div className="w-2/3 font-mono text-[10.5px] text-zinc-800 dark:text-zinc-200 truncate pt-0.5">
                  {item.mimeType}
                </div>
              </div>

              {/* Etag */}
              {item.etag && (
                <div className="flex border-b border-zinc-100 dark:border-zinc-800/80 py-2.5 px-3">
                  <div className="w-1/3 font-semibold text-zinc-400 dark:text-zinc-505 text-[10px] uppercase tracking-wider flex items-center gap-1 max-w-[120px]">
                    <Hash size={11} />
                    {t('modals.details.md5')}
                  </div>
                  <div className="w-2/3 font-mono text-[10.5px] text-zinc-700 dark:text-zinc-350 select-all pt-0.5 truncate">
                    {item.etag}
                  </div>
                </div>
              )}

              {/* Date Created */}
              <div className="flex border-b border-zinc-100 dark:border-zinc-800/80 py-2.5 px-3">
                <div className="w-1/3 font-semibold text-zinc-400 dark:text-zinc-555 text-[10px] uppercase tracking-wider flex items-center gap-1 max-w-[120px]">
                  <Calendar size={11} />
                  Created
                </div>
                <div className="w-2/3 font-mono text-[10.5px] text-zinc-700 dark:text-zinc-350 pt-0.5">
                  {new Date(item.createdAt).toLocaleString(i18n.language)}
                </div>
              </div>

              {/* Date Modified */}
              <div className="flex py-2.5 px-3">
                <div className="w-1/3 font-semibold text-zinc-400 dark:text-zinc-505 text-[10px] uppercase tracking-wider flex items-center gap-1 max-w-[120px]">
                  <Calendar size={11} />
                  {t('modals.details.lastModified')}
                </div>
                <div className="w-2/3 font-mono text-[10.5px] text-zinc-700 dark:text-zinc-350 pt-0.5">
                  {new Date(item.updatedAt).toLocaleString(i18n.language)}
                </div>
              </div>
            </div>

            {/* Custom Metadata Object Tags */}
            {item.metadata && Object.keys(item.metadata).length > 0 && (
              <div className="flex flex-col gap-1.5 mt-1">
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-1">{t('modals.details.metadataTitle')}</label>
                <div className="border border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/20 rounded-xl p-2.5 flex flex-col gap-1.5 font-mono text-[10px] text-zinc-600 dark:text-zinc-400">
                  {Object.entries(item.metadata).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center gap-2">
                      <span className="text-zinc-500 dark:text-zinc-400 truncate">{k}</span>
                      <span className="text-zinc-800 dark:text-zinc-200 font-semibold text-right break-all max-w-[170px]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Download */}
            <div className="flex justify-between gap-2 pt-3 mt-1 border-t border-zinc-100 dark:border-zinc-800/80">
              {item.publicUrl && (
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 h-8.5 text-xs text-zinc-650 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer font-medium flex items-center gap-1.5 transition-colors"
                >
                  <ImageIcon size={13} />
                  {t('modals.details.publicUrl')}
                </button>
              )}
              <div className="flex gap-2 ms-auto">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="px-4 h-8.5 text-xs font-semibold text-white dark:text-zinc-900 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 border border-transparent rounded-md cursor-pointer transition-colors shadow-xs"
                >
                  {t('modals.close')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Backdrop>
  );
}
