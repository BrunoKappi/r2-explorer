/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigationStore } from '../../stores/navigationStore';
import { r2Service } from '../../services/r2Service';
import Backdrop from '../../components/Backdrop';

export default function DeleteModal() {
  const { t } = useTranslation();
  const { closeDialog, activeDialogTargets, currentPath, clearSelection } = useNavigationStore();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  const targetsCount = activeDialogTargets.length;
  const isMulti = targetsCount > 1;

  const mutation = useMutation({
    mutationFn: async () => {
      await r2Service.deleteObjects(activeDialogTargets);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objects', useNavigationStore.getState().activeBucketName, currentPath] });
      queryClient.invalidateQueries({ queryKey: ['folders-count'] });
      clearSelection();
      closeDialog();
    },
    onError: (err: any) => {
      setError(err?.message || 'Failed to delete items.');
    }
  });

  const getCleanLabel = (path: string) => {
    return path.split('/').pop() || path;
  };

  return (
    <Backdrop onClose={closeDialog}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-red-50/20 dark:bg-red-950/10">
        <h3 className="text-sm font-semibold text-red-800 dark:text-red-400 flex items-center gap-2">
          <AlertTriangle size={15} className="text-red-600 shrink-0" />
          {t('modals.delete.title')}
        </h3>
        <button onClick={closeDialog} className="text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-200 rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors text-zinc-400 dark:text-zinc-500">
          <X size={15} />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-4 text-xs font-sans">
        <p className="text-zinc-655 dark:text-zinc-300 leading-relaxed font-sans">
          {t('modals.delete.confirmationMessage')}
          <span className="block mt-2 font-medium">
            {isMulti ? (
              <span>
                {t('modals.delete.itemsDetail', { count: targetsCount })}
              </span>
            ) : (
              <span>
                {t('modals.delete.itemsDetail', { count: 1 })}: <strong className="text-zinc-800 dark:text-zinc-100 font-bold">"{getCleanLabel(activeDialogTargets[0] || '')}"</strong>
              </span>
            )}
          </span>
          <span className="block mt-2 text-red-655 dark:text-red-450 font-semibold italic text-[11px]">
            {t('modals.delete.warningTrash')}
          </span>
        </p>

        {isMulti && (
          <div className="max-h-24 overflow-y-auto border border-zinc-100 dark:border-zinc-800 rounded-md bg-zinc-50/50 dark:bg-zinc-950/40 py-1.5 px-2.5 divide-y divide-zinc-100 dark:divide-zinc-800/80 scrollbar-thin">
            {activeDialogTargets.map((item) => (
              <div key={item} className="text-[10px] text-zinc-505 dark:text-zinc-400 font-mono py-1 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-zinc-400 dark:bg-zinc-650 shrink-0"></span>
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-[11px] text-red-605 bg-red-50/60 dark:bg-red-950/20 p-2.5 rounded-md border border-red-100 dark:border-red-900/30 flex items-start gap-1.5 font-medium">
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-2">
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={closeDialog}
            className="px-3 h-8.5 text-xs font-medium text-zinc-650 dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors disabled:opacity-50"
          >
            {t('modals.cancel')}
          </button>
          <button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="px-3.5 h-8.5 text-xs font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 cursor-pointer shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {mutation.isPending ? t('modals.delete.deleting') : t('contextMenu.delete')}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}
