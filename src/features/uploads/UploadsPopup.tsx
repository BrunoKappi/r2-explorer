/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigationStore } from '../../stores/navigationStore';
import { motion, AnimatePresence } from 'motion/react';

export default function UploadsPopup() {
  const { t } = useTranslation();
  const { activeUploads, clearUploads, skippedUploads, clearSkippedUploads } = useNavigationStore();
  const [closedByUser, setClosedByUser] = useState(false);

  // If there's any actively uploading item, make sure to automatically show the window!
  const hasActiveUploads = activeUploads.some((up) => up.status === 'uploading');
  
  useEffect(() => {
    if (hasActiveUploads) {
      setClosedByUser(false);
    }
  }, [hasActiveUploads]);

  // Auto-dismiss completed/failed uploads after 6 seconds of being fully done
  useEffect(() => {
    if (activeUploads.length > 0 && !hasActiveUploads) {
      const timer = setTimeout(() => {
        clearUploads();
        clearSkippedUploads();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [activeUploads, hasActiveUploads, clearUploads, clearSkippedUploads]);

  if (activeUploads.length === 0 || closedByUser) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, x: '-50%', scale: 0.95 }}
        animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
        exit={{ opacity: 0, y: 20, x: '-50%', scale: 0.95 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-80 sm:w-85 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-xl p-4 flex flex-col gap-3 font-sans select-none transition-colors duration-200"
      >
        <div className="flex items-center justify-between pb-1 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            {hasActiveUploads ? (
              <RefreshCw size={13} className="text-zinc-600 dark:text-zinc-400 animate-spin" />
            ) : (
              <CheckCircle2 size={13} className="text-emerald-500" />
            )}
            <span className="text-[10px] font-bold text-zinc-900 dark:text-zinc-200 tracking-wider uppercase">
              {hasActiveUploads ? t('uploadsPopup.queued') : t('uploadsPopup.done')}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
               onClick={() => {
                 clearUploads();
                 clearSkippedUploads();
               }}
               title="Clear all logs"
               className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer transition-colors"
            >
              <Trash2 size={12.5} />
            </button>
            <button
              onClick={() => setClosedByUser(true)}
              title="Dismiss / Minimize"
              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300 cursor-pointer transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {skippedUploads && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-lg p-2.5 flex items-start gap-2 text-[10px] text-amber-800 dark:text-amber-200 leading-normal">
            <AlertCircle size={15} className="text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block text-amber-900 dark:text-amber-200 leading-tight">Upload Batch Limited</span>
              Only the first 100 files were processed. The remaining {skippedUploads.skipped} of the {skippedUploads.total} selected files were omitted due to the limit.
            </div>
            <button 
              onClick={() => clearSkippedUploads()} 
              className="text-amber-400 hover:text-amber-600 p-0.5 rounded focus:outline-none cursor-pointer transition-colors shrink-0"
              title="Dismiss alert"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto scrollbar-thin">
          {activeUploads.map((up) => (
            <div
              key={up.id}
              className="bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-200/50 dark:border-zinc-800/80 p-2.5 rounded-lg flex flex-col gap-1.5 text-[10.5px]"
            >
              <div className="flex justify-between items-center gap-2">
                <span className="text-zinc-700 dark:text-zinc-200 font-medium truncate max-w-[170px]" title={up.name}>
                  {up.name}
                </span>
                <span className="font-mono text-zinc-400 dark:text-zinc-500 font-bold shrink-0">
                  {up.progress}%
                </span>
              </div>

              <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-150 ${
                    up.status === 'completed'
                      ? 'bg-emerald-500'
                      : up.status === 'failed'
                      ? 'bg-red-500'
                      : 'bg-zinc-900 dark:bg-zinc-100'
                  }`}
                  style={{ width: `${up.progress}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 dark:text-zinc-500">
                <span className="flex items-center gap-1 font-semibold truncate max-w-[150px]">
                  {up.status === 'completed' && (
                    <span className="text-emerald-500 dark:text-emerald-400 flex items-center gap-0.5">
                      <CheckCircle2 size={10} className="stroke-[2.5]" /> {t('uploadsPopup.completedCount')}
                    </span>
                  )}
                  {up.status === 'failed' && (
                    <span className="text-red-500 dark:text-red-400 flex items-center gap-0.5">
                      <AlertCircle size={10} className="stroke-[2.5]" /> {t('uploadsPopup.failedCount')}
                    </span>
                  )}
                  {up.status === 'uploading' && t('modals.createFolder.creating')}
                </span>
                <span className="capitalize">
                  {(up.size / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
          ))}
        </div>

        {!hasActiveUploads && (
          <p className="text-[9px] text-zinc-400 dark:text-zinc-500 leading-normal text-right italic pt-0.5 font-medium">
            Closing automatically in a few seconds...
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
