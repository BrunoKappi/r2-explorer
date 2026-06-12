/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, FolderSymlink, Copy, DownloadCloud, X, ChevronUp, ChevronDown, FileText, Archive, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigationStore } from '../stores/navigationStore';
import { r2Service } from '../services/r2Service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatBytes, getShareUrl } from '../utils/fileUtils';
import { R2Item } from '../types';

export default function BatchActionBar() {
  const { t } = useTranslation();
  const { selectedPaths, clearSelection, openDialog, activeBucketName, currentPath, searchQuery, viewPrefixesAsFolders } = useNavigationStore();
  const [copiedToast, setCopiedToast] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const queryClient = useQueryClient();

  const isVisible = selectedPaths.length > 0;

  // Query actual items list from cache safely
  const items = queryClient.getQueryData<R2Item[]>([
    'objects',
    activeBucketName,
    currentPath,
    searchQuery,
    viewPrefixesAsFolders,
  ]);

  // Query all items recursively for deep files size identification
  const { data: allObjects = [], isLoading: isLoadingAll } = useQuery<R2Item[]>({
    queryKey: ['all-objects-recursive', activeBucketName],
    queryFn: () => r2Service.getAllFilesRecursively(),
    enabled: isVisible,
  });

  // Map selected paths to files recursively
  const selectedFiles = useMemo(() => {
    const list: { path: string; name: string; size: number }[] = [];
    const seenPaths = new Set<string>();

    selectedPaths.forEach((selPath) => {
      // 1. Exact file match in recursively loaded object dictionary
      const exactObj = allObjects.find(
        (obj) => obj.path === selPath && obj.type === 'file'
      );
      if (exactObj) {
        if (!seenPaths.has(exactObj.path)) {
          seenPaths.add(exactObj.path);
          list.push({
            path: exactObj.path,
            name: exactObj.name,
            size: exactObj.size || 0,
          });
        }
        return;
      }

      // 2. Directory recursive files collection
      const folderPrefix = selPath.endsWith('/') ? selPath : `${selPath}/`;
      const filesInFolder = allObjects.filter(
        (obj) =>
          obj.type === 'file' &&
          (obj.path.startsWith(folderPrefix) || obj.path === selPath)
      );

      if (filesInFolder.length > 0) {
        filesInFolder.forEach((obj) => {
          if (!seenPaths.has(obj.path)) {
            seenPaths.add(obj.path);
            list.push({
              path: obj.path,
              name: obj.name,
              size: obj.size || 0,
            });
          }
        });
        return;
      }

      // 3. Graceful fallback to directly visible context cache items
      const visibleItem = items?.find((i) => i.path === selPath);
      if (visibleItem && visibleItem.type === 'file') {
        if (!seenPaths.has(visibleItem.path)) {
          seenPaths.add(visibleItem.path);
          list.push({
            path: visibleItem.path,
            name: visibleItem.name,
            size: visibleItem.size || 0,
          });
        }
      }
    });

    return list;
  }, [selectedPaths, allObjects, items]);

  const totalRawSize = selectedFiles.reduce((acc, f) => acc + f.size, 0);

  // Estimate ZIP compression file size (compressing text schemas, leaving media)
  const estimatedZipSize = useMemo(() => {
    let est = 0;
    selectedFiles.forEach((f) => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      const highlyCompressible = ['txt', 'json', 'xml', 'csv', 'html', 'js', 'css', 'ts', 'tsx', 'md'];
      if (ext && highlyCompressible.includes(ext)) {
        est += f.size * 0.35; // approx 65% space reduction
      } else if (ext && ['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(ext)) {
        est += f.size * 0.75; // approx 25% space reduction
      } else {
        est += f.size * 0.98; // negligible binary compression
      }
    });
    return Math.max(est, 0);
  }, [selectedFiles]);

  const handleCopyAllPaths = () => {
    const textToCopy = selectedPaths.map(p => getShareUrl(activeBucketName, p)).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  const handleDownloadAll = async () => {
    try {
      setDownloadingZip(true);
      await r2Service.downloadZip(selectedPaths);
    } catch (err: any) {
      alert(err.message || 'Error occurred while performing ZIP compressed download.');
    } finally {
      setDownloadingZip(false);
    }
  };

  const isMulti = selectedPaths.length > 1;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          className="fixed bottom-6 left-0 right-0 mx-auto z-30 w-fit min-w-[280px] md:min-w-[400px] max-w-[calc(100vw-2rem)] md:max-w-2xl bg-zinc-900 border border-zinc-800 shadow-2xl rounded-2xl flex flex-col select-none font-sans text-xs text-zinc-100 overflow-visible"
        >
          {/* Collapsible Details Area */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-b border-zinc-800 bg-zinc-950/40 divide-y divide-zinc-800/80 overflow-hidden"
              >
                <div className="p-4 flex flex-col gap-3 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-zinc-300 text-[11px] uppercase tracking-wider truncate">
                      {t('batchBar.selectedHeading')}
                    </span>
                    <span className="text-[10px] text-zinc-400 italic shrink-0">
                      {isMulti ? t('batchBar.itemsChecked_other', { count: selectedPaths.length }) : t('batchBar.itemsChecked_one')}
                    </span>
                  </div>

                  {/* Scrollable file lists */}
                  <div className="max-h-36 overflow-y-auto flex flex-col gap-1.5 pr-1 custom-scrollbar min-w-0">
                    {isLoadingAll && selectedFiles.length === 0 ? (
                      <div className="py-6 text-center text-zinc-500 font-medium text-[11px] flex flex-col items-center gap-2">
                        <div className="w-4 h-4 border border-t-transparent border-zinc-400 rounded-full animate-spin"></div>
                        {t('batchBar.scanning')}
                      </div>
                    ) : selectedFiles.length === 0 ? (
                      <div className="py-4 text-center text-zinc-500 text-[11px]">
                        {t('batchBar.noFilesDiscovered')}
                      </div>
                    ) : (
                      selectedFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/60 transition-colors hover:bg-zinc-900 min-w-0">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <FileText size={12.5} className="text-zinc-500 shrink-0" />
                            <span className="truncate font-mono text-[10.5px] text-zinc-300" title={file.path}>
                              {file.path}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-zinc-400 bg-zinc-800/40 px-1.5 py-0.5 rounded ml-2 shrink-0">
                            {formatBytes(file.size)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* File size summaries info pane */}
                <div className="grid grid-cols-2 bg-zinc-950 px-4 py-3 divide-x divide-zinc-800/80">
                  <div className="flex flex-col gap-0.5 pr-2">
                    <span className="text-zinc-500 text-[9px] uppercase tracking-wider font-semibold">{t('batchBar.totalRawSize')}</span>
                    <span className="text-zinc-200 font-mono text-xs font-bold">
                      {formatBytes(totalRawSize)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 pl-4 relative">
                    <div className="flex items-center gap-1">
                      <span className="text-zinc-500 text-[9px] uppercase tracking-wider font-semibold">{t('batchBar.zipSize')}</span>
                      <div className="group relative cursor-pointer">
                        <Info size={10} className="text-zinc-400 hover:text-zinc-300" />
                        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-zinc-900 text-zinc-200 text-[9px] px-2 py-1 rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap border border-zinc-800">
                           {t('batchBar.zipTooltip')}
                        </span>
                      </div>
                    </div>
                    <span className="text-emerald-400 font-mono text-xs font-bold">
                      ~{formatBytes(estimatedZipSize)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action trigger row */}
          <div className="px-2 sm:px-3.5 py-1.5 sm:py-2 flex items-center justify-between gap-1 sm:gap-4 flex-nowrap overflow-visible min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 flex-nowrap shrink-0 min-w-0">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-0.5 sm:gap-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg cursor-pointer whitespace-nowrap flex-nowrap shrink-0"
                title="Toggle selection details"
              >
                <span className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-zinc-800 text-[9px] font-mono font-bold text-zinc-400 shrink-0">
                  {selectedPaths.length}
                </span>
                <span className="font-semibold text-[10.5px] sm:text-[11px] whitespace-nowrap xs:hidden inline ml-1">
                  Sel.
                </span>
                <span className="font-semibold text-[11px] whitespace-nowrap hidden xs:inline sm:hidden ml-1">
                  {selectedPaths.length} {isMulti ? t('status.items') : t('status.item')}
                </span>
                <span className="font-semibold text-[11px] whitespace-nowrap hidden sm:inline ml-1">
                  {isMulti ? t('status.selectedNumItems', { count: selectedPaths.length }) : t('status.selectedOneItem')}
                </span>
                {isExpanded ? <ChevronDown size={10} className="text-zinc-500 shrink-0 ml-0.5" /> : <ChevronUp size={10} className="text-zinc-500 shrink-0 ml-0.5" />}
              </button>

              {/* Real-time size preview badge on root bar */}
              {selectedFiles.length > 0 && !isExpanded && (
                <span className="text-[10px] items-center gap-1 text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded-md font-mono hidden hover:bg-zinc-750 transition-colors xs:flex whitespace-nowrap flex-nowrap shrink-0">
                  <Archive size={10} className="text-zinc-500 shrink-0" />
                  ~{formatBytes(estimatedZipSize)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1 font-sans text-[11px] flex-nowrap shrink-0">
              {/* Copy paths */}
              <button
                onClick={handleCopyAllPaths}
                title={copiedToast ? t('batchBar.copied') : t('batchBar.copyPaths')}
                className="h-8 px-1.5 sm:px-2.5 rounded-lg hover:bg-zinc-800 text-zinc-355 hover:text-white transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap flex-nowrap shrink-0"
              >
                <Copy size={12.5} className="shrink-0" />
                <span className="hidden lg:inline whitespace-nowrap">{copiedToast ? t('batchBar.copied') : t('batchBar.copyPaths')}</span>
              </button>

              {/* Move objects */}
              <button
                onClick={() => openDialog('move', selectedPaths)}
                title={t('batchBar.move')}
                className="h-8 px-1.5 sm:px-2.5 rounded-lg hover:bg-zinc-800 text-zinc-355 hover:text-white transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap flex-nowrap shrink-0"
              >
                <FolderSymlink size={12.5} className="shrink-0" />
                <span className="hidden lg:inline whitespace-nowrap">{t('batchBar.move')}</span>
              </button>

              {/* Download ZIP */}
              <button
                onClick={handleDownloadAll}
                disabled={downloadingZip}
                className={`h-8 px-1.5 sm:px-2.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap flex-nowrap shrink-0 ${downloadingZip ? 'opacity-65 pointer-events-none' : ''}`}
                title="Download selected items as a ZIP archive"
              >
                <DownloadCloud size={12.5} className={`shrink-0 ${downloadingZip ? "animate-pulse" : ""}`} />
                <span className="font-semibold whitespace-nowrap hidden lg:inline">{downloadingZip ? t('batchBar.compressing') : t('batchBar.downloadZip')}</span>
              </button>

              <div className="h-4 w-px bg-zinc-800 mx-0.25 sm:mx-1 shrink-0" />

              {/* Batch delete */}
              <button
                onClick={() => openDialog('delete', selectedPaths)}
                title={t('batchBar.delete')}
                className="h-8 px-1.5 sm:px-2.5 rounded-lg hover:bg-red-950/55 hover:text-red-400 text-red-500 transition-all flex items-center gap-1 cursor-pointer font-bold whitespace-nowrap flex-nowrap shrink-0"
              >
                <Trash2 size={12.5} className="shrink-0" />
                <span className="hidden lg:inline whitespace-nowrap">{t('batchBar.delete')}</span>
              </button>

              <div className="h-4 w-px bg-zinc-800 mx-0.25 sm:mx-1 shrink-0" />

              {/* Cancel */}
              <button
                onClick={clearSelection}
                title="Clear selection"
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
              >
                <X size={12.5} className="shrink-0" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
