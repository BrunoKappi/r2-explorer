/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, Info, Upload, Plus, RefreshCw, BarChart3, Sun, Moon, Globe, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigationStore } from '../../stores/navigationStore';
import Breadcrumbs from '../../features/bucket-navigation/Breadcrumbs';

interface FileExplorerHeaderProps {
  localSearch: string;
  setLocalSearch: (val: string) => void;
  handleSearchSubmit: (e?: React.FormEvent) => void;
  isLoading: boolean;
  onRefresh: () => void;
}

const languages = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'pt-BR', label: 'Português', short: 'PT' },
  { code: 'es', label: 'Español', short: 'ES' },
  { code: 'de', label: 'Deutsch', short: 'DE' },
  { code: 'fr', label: 'Français', short: 'FR' },
];

export function FileExplorerHeader({
  localSearch,
  setLocalSearch,
  handleSearchSubmit,
  isLoading,
  onRefresh,
}: FileExplorerHeaderProps) {
  const { t, i18n } = useTranslation();
  const {
    viewPrefixesAsFolders,
    setViewPrefixesAsFolders,
    openDialog,
    theme,
    toggleTheme,
  } = useNavigationStore();

  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langOpen && langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [langOpen]);

  // Find active lang object
  const currentLang = languages.find(l => l.code === i18n.language) 
    || languages.find(l => i18n.language?.startsWith(l.code.split('-')[0])) 
    || languages[0];

  return (
    <div className="flex flex-col px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 select-none transition-colors duration-200">
      {/* Section 1: Search and Preferences */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="w-full max-w-sm">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={t('header.searchPlaceholder')}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="h-8.5 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-350 dark:hover:border-zinc-700 focus:border-zinc-350 dark:focus:border-zinc-700 focus:ring-0 focus:outline-hidden text-xs rounded-md w-full font-sans transition-all text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
            />
            <button
              type="submit"
              className="h-8.5 px-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 font-medium text-xs text-zinc-600 dark:text-zinc-300 rounded-md flex items-center gap-1.5 transition-all cursor-pointer shadow-3xs shrink-0"
            >
              <Search size={13} className="text-zinc-400 dark:text-zinc-500" />
              <span>{t('header.search')}</span>
            </button>
          </div>
        </form>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-sans text-zinc-650 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors cursor-pointer select-none">
            <div
              onClick={() => setViewPrefixesAsFolders(!viewPrefixesAsFolders)}
              className="custom-checkbox h-4 w-4 rounded-md border flex items-center justify-center transition-all duration-150 cursor-pointer border-zinc-300 hover:border-zinc-400 bg-white dark:border-zinc-700 dark:hover:border-zinc-500 dark:bg-zinc-950 data-[state=selected]:bg-zinc-800 data-[state=selected]:border-zinc-800 data-[state=selected]:text-white data-[state=selected]:dark:bg-zinc-100 data-[state=selected]:dark:border-zinc-100 data-[state=selected]:dark:text-zinc-900 data-[state=selected]:shadow-3xs"
              data-state={viewPrefixesAsFolders ? 'selected' : 'unchecked'}
            >
              {viewPrefixesAsFolders && (
                <svg className="w-2.5 h-2.5 stroke-2 stroke-current" viewBox="0 0 24 24" fill="none">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className="text-[11.5px] font-medium text-zinc-650 dark:text-zinc-300">{t('header.viewPrefixes')}</span>
          </label>
          <div
            className="text-zinc-400 dark:text-zinc-500 cursor-help"
            title={t('header.viewPrefixesTooltip')}
          >
            <Info size={14} className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors" />
          </div>

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

          {/* Popover Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className="h-8.5 px-2 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-md text-xs font-medium text-zinc-600 dark:text-zinc-305 flex items-center gap-1.5 cursor-pointer shadow-3xs transition-all shrink-0"
              title="Select language"
            >
              <Globe size={13.5} className="text-zinc-400 dark:text-zinc-500" />
              <span className="font-mono text-[10.5px] font-bold text-zinc-700 dark:text-zinc-350">{currentLang.short}</span>
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl py-1 z-50 text-xs font-sans text-zinc-750 dark:text-zinc-200 animate-in fade-in zoom-in-95 duration-100">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      i18n.changeLanguage(lang.code);
                      setLangOpen(false);
                    }}
                    className="flex items-center justify-between w-full text-left px-3 py-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white transition-colors"
                  >
                    <span className={(i18n.language === lang.code || i18n.language?.startsWith(lang.code.split('-')[0])) ? 'font-semibold text-zinc-950 dark:text-white' : ''}>
                      {lang.label}
                    </span>
                    {(i18n.language === lang.code || i18n.language?.startsWith(lang.code.split('-')[0])) && (
                      <Check size={13} className="text-blue-500 dark:text-blue-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="h-8.5 w-8.5 rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 hover:text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center justify-center cursor-pointer transition-all shadow-3xs shrink-0"
            title={theme === 'light' ? t('header.themeDark') : t('header.themeLight')}
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        </div>
      </div>

      <hr className="border-zinc-100/80 dark:border-zinc-800/80 -mx-5 my-4" />

      {/* Section 2: Path Position and Main Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Breadcrumbs />
        </div>

        <div className="flex items-center gap-2 flex-nowrap whitespace-nowrap shrink-0">
          <button
            onClick={() => openDialog('stats')}
            className="whitespace-nowrap h-8.5 px-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-400 hover:text-zinc-955 dark:hover:text-white rounded-md flex items-center gap-1.5 transition-all cursor-pointer shadow-3xs shrink-0"
            title="View complete Bucket statistics"
          >
            <BarChart3 size={13} className="text-zinc-500 dark:text-zinc-400" />
            <span>{t('header.statistics')}</span>
          </button>

          <button
            onClick={() => openDialog('upload')}
            className="whitespace-nowrap h-8.5 px-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-400 hover:text-zinc-955 dark:hover:text-white rounded-md flex items-center gap-1.5 transition-all cursor-pointer shadow-3xs shrink-0"
          >
            <Upload size={13} className="text-zinc-500 dark:text-zinc-400" />
            <span>{t('header.upload')}</span>
          </button>

          <button
            onClick={() => openDialog('create_folder')}
            disabled={!viewPrefixesAsFolders}
            title={viewPrefixesAsFolders ? t('header.newFolder') : t('header.folderModeOnly')}
            className="whitespace-nowrap h-8.5 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white border border-blue-600 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all cursor-pointer shadow-3xs disabled:opacity-40 disabled:hover:bg-blue-600 shrink-0"
          >
            <Plus size={13} className="stroke-[2.5]" />
            <span>{t('header.addFolder')}</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="h-8.5 w-8.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:border-zinc-350 dark:hover:border-zinc-700 rounded-md flex items-center justify-center cursor-pointer transition-all disabled:opacity-40 shrink-0"
            title={t('header.reload')}
          >
            <RefreshCw size={13} className={`${isLoading ? 'animate-spin' : ''} text-zinc-500 dark:text-zinc-400`} />
          </button>
        </div>
      </div>
    </div>
  );
}
