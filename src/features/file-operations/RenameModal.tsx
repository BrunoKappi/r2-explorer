/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FolderSymlink, X, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigationStore } from '../../stores/navigationStore';
import { r2Service } from '../../services/r2Service';
import Backdrop from '../../components/Backdrop';

export default function RenameModal() {
  const { t } = useTranslation();
  const { closeDialog, activeDialogTarget, currentPath } = useNavigationStore();
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const oldPath = activeDialogTarget || '';
  const currentName = oldPath.split('/').pop() || '';

  const mutation = useMutation({
    mutationFn: async () => {
      if (!newName.trim()) throw new Error('Name cannot be empty.');
      if (newName.includes('/') || newName.includes('\\')) throw new Error('Filename cannot contain slashes.');
      return r2Service.renameObject(oldPath, newName.trim());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objects', useNavigationStore.getState().activeBucketName, currentPath] });
      queryClient.invalidateQueries({ queryKey: ['folders-count'] });
      closeDialog();
    },
    onError: (err: any) => {
      setError(err?.message || 'An error occurred.');
    }
  });

  useEffect(() => {
    if (currentName) {
      setNewName(currentName);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Select only name, keeping extension unselected if file
          const dotIndex = currentName.lastIndexOf('.');
          if (dotIndex > 0 && currentName.includes('.')) {
            inputRef.current.setSelectionRange(0, dotIndex);
          } else {
            inputRef.current.select();
          }
        }
      }, 100);
    }
  }, [currentName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    mutation.mutate();
  };

  return (
    <Backdrop onClose={closeDialog}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <FolderSymlink size={15} className="text-zinc-500 dark:text-zinc-400" />
          {t('modals.rename.title')}
        </h3>
        <button onClick={closeDialog} className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors text-zinc-400 dark:text-zinc-500">
          <X size={15} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
        <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono bg-zinc-50 dark:bg-zinc-950/45 py-1.5 px-2.5 rounded-md border border-zinc-100 dark:border-zinc-800 text-ellipsis overflow-hidden">
          From: <span className="text-zinc-655 dark:text-zinc-350 font-semibold">{oldPath}</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{t('modals.rename.label')}</label>
          <input
            ref={inputRef}
            type="text"
            required
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={mutation.isPending}
            className="h-9 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-350 dark:hover:border-zinc-700 focus:border-zinc-450 dark:focus:border-zinc-600 focus:outline-hidden text-xs rounded-md transition-all placeholder-zinc-400 dark:placeholder-zinc-500 text-zinc-800 dark:text-zinc-100"
          />
        </div>

        {error && (
          <div className="text-[11px] text-red-655 bg-red-50/60 dark:bg-red-950/20 p-2.5 rounded-md border border-red-100 dark:border-red-900/30 flex items-start gap-1.5 font-medium">
            <AlertTriangle size={13} className="shrink-0 mt-0.5 text-red-655" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800/85 pt-4 mt-1">
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={closeDialog}
            className="px-3 h-8.5 text-xs font-medium text-zinc-650 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors disabled:opacity-50"
          >
            {t('modals.cancel')}
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-3.5 h-8.5 text-xs font-semibold text-white dark:text-zinc-900 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {mutation.isPending ? t('modals.rename.renaming') : t('modals.confirm')}
          </button>
        </div>
      </form>
    </Backdrop>
  );
}
