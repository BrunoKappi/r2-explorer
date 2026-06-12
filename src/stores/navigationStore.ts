/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { UploadProgress } from '../types';

interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  targetPath: string | null;
  targetType: 'file' | 'folder' | 'empty';
}

interface NavigationState {
  currentPath: string; // Current folder path e.g. "" (root), "assets", "assets/imagens"
  selectedPaths: string[]; // List of paths currently selected
  lastSelectedPath: string | null; // Keeps track of the last clicked path for Shift range-selection
  searchQuery: string; // Global or local search string
  activeUploads: UploadProgress[]; // Current active mock uploads
  viewMode: 'list' | 'grid'; // View preference
  buckets: { name: string; createdAt: string }[]; // Cloudflare R2 Buckets in account
  activeBucketName: string | null; // Currently explored bucket name

  // Context Menu State
  contextMenu: ContextMenuState;

  // Dialog State Management
  activeDialog: 'create_folder' | 'rename' | 'delete' | 'details' | 'move' | 'upload' | 'stats' | null;
  activeDialogTarget: string | null; // Primary target path (e.g. item to preview or rename)
  activeDialogTargets: string[]; // Multi-target paths (e.g. items to delete or move in bulk)

  // Navigation Actions
  setCurrentPath: (path: string) => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: 'list' | 'grid') => void;
  setBuckets: (buckets: { name: string; createdAt: string }[]) => void;
  setActiveBucketName: (bucketName: string | null) => void;
  
  // Dialog Actions
  openDialog: (
    type: 'create_folder' | 'rename' | 'delete' | 'details' | 'move' | 'upload' | 'stats',
    target?: string | string[]
  ) => void;
  closeDialog: () => void;
  
  // Context Menu Actions
  openContextMenu: (x: number, y: number, targetPath: string | null, targetType: 'file' | 'folder' | 'empty') => void;
  closeContextMenu: () => void;

  // Selection Actions
  selectPath: (
    path: string,
    options: { ctrlKey: boolean; shiftKey: boolean; allVisiblePaths: string[] }
  ) => void;
  selectAll: (allVisiblePaths: string[]) => void;
  clearSelection: () => void;
  toggleSingleSelection: (path: string) => void;

  // Upload Actions
  addUpload: (upload: UploadProgress) => void;
  updateUploadProgress: (id: string, progress: number, status?: UploadProgress['status']) => void;
  clearUploads: () => void;
  skippedUploads: { skipped: number; total: number } | null;
  setSkippedUploads: (skipped: number, total: number) => void;
  clearSkippedUploads: () => void;

  // Clipboard Actions
  clipboardPaths: string[];
  copySelectionToClipboard: () => void;
  clearClipboard: () => void;

  // Prefixes view preference
  viewPrefixesAsFolders: boolean;
  setViewPrefixesAsFolders: (val: boolean) => void;

  // Sorting State
  sortColumn: 'name' | 'type' | 'size' | 'updatedAt';
  sortDirection: 'asc' | 'desc';
  setSort: (column: 'name' | 'type' | 'size' | 'updatedAt') => void;

  // Theme State
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentPath: '',
  selectedPaths: [],
  lastSelectedPath: null,
  searchQuery: '',
  activeUploads: [],
  viewMode: 'list',
  buckets: [],
  activeBucketName: 'bkappi',
  clipboardPaths: [],
  viewPrefixesAsFolders: localStorage.getItem('viewPrefixesAsFolders') !== 'false',
  skippedUploads: null,
  sortColumn: 'name',
  sortDirection: 'asc',
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',

  // Context Menu Defaults
  contextMenu: {
    isOpen: false,
    x: 0,
    y: 0,
    targetPath: null,
    targetType: 'empty',
  },

  // Dialog Defaults
  activeDialog: null,
  activeDialogTarget: null,
  activeDialogTargets: [],

  setCurrentPath: (path) =>
    set({
      currentPath: path,
      selectedPaths: [], // Clear selection when navigating
      lastSelectedPath: null,
      searchQuery: '', // Clear query on directory shift
    }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setViewMode: (mode) => set({ viewMode: mode }),

  setBuckets: (buckets) => set({ buckets }),

  setActiveBucketName: (bucketName) =>
    set({
      activeBucketName: bucketName,
      currentPath: '', // Reset to root of bucket when switching buckets
      selectedPaths: [],
      lastSelectedPath: null,
    }),

  openDialog: (type, target) =>
    set(() => {
      let activeDialogTarget: string | null = null;
      let activeDialogTargets: string[] = [];

      if (target) {
        if (Array.isArray(target)) {
          activeDialogTargets = target;
          activeDialogTarget = target[0] || null;
        } else {
          activeDialogTarget = target;
          activeDialogTargets = [target];
        }
      }

      return {
        activeDialog: type,
        activeDialogTarget,
        activeDialogTargets,
      };
    }),

  closeDialog: () =>
    set({
      activeDialog: null,
      activeDialogTarget: null,
      activeDialogTargets: [],
    }),

  openContextMenu: (x, y, targetPath, targetType) =>
    set({
      contextMenu: {
        isOpen: true,
        x,
        y,
        targetPath,
        targetType,
      },
    }),

  closeContextMenu: () =>
    set((state) => ({
      contextMenu: {
        ...state.contextMenu,
        isOpen: false,
      },
    })),

  selectPath: (path, { ctrlKey, shiftKey, allVisiblePaths }) =>
    set((state) => {
      let nextSelection = [...state.selectedPaths];
      let nextLastSelected = path;

      if (shiftKey && state.lastSelectedPath && allVisiblePaths.includes(state.lastSelectedPath)) {
        const startIndex = allVisiblePaths.indexOf(state.lastSelectedPath);
        const endIndex = allVisiblePaths.indexOf(path);
        const [low, high] = startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
        
        const range = allVisiblePaths.slice(low, high + 1);
        
        if (ctrlKey) {
          const uniqueNew = range.filter((p) => !nextSelection.includes(p));
          nextSelection = [...nextSelection, ...uniqueNew];
        } else {
          nextSelection = range;
        }
        nextLastSelected = state.lastSelectedPath;
      } else if (ctrlKey) {
        if (nextSelection.includes(path)) {
          nextSelection = nextSelection.filter((p) => p !== path);
        } else {
          nextSelection.push(path);
        }
      } else {
        nextSelection = [path];
      }

      return {
        selectedPaths: nextSelection,
        lastSelectedPath: nextLastSelected,
      };
    }),

  selectAll: (allVisiblePaths) =>
    set({
      selectedPaths: allVisiblePaths,
      lastSelectedPath: allVisiblePaths[0] || null,
    }),

  clearSelection: () =>
    set({
      selectedPaths: [],
      lastSelectedPath: null,
    }),

  toggleSingleSelection: (path) =>
    set((state) => {
      const isSelected = state.selectedPaths.includes(path);
      return {
        selectedPaths: isSelected ? [] : [path],
        lastSelectedPath: isSelected ? null : path,
      };
    }),

  addUpload: (upload) =>
    set((state) => ({
      activeUploads: [upload, ...state.activeUploads],
    })),

  updateUploadProgress: (id, progress, status) =>
    set((state) => ({
      activeUploads: state.activeUploads.map((up) =>
        up.id === id ? { ...up, progress, ...(status ? { status } : {}) } : up
      ),
    })),

  clearUploads: () =>
    set({
      activeUploads: [],
    }),

  setSkippedUploads: (skipped, total) =>
    set({
      skippedUploads: { skipped, total },
    }),

  clearSkippedUploads: () =>
    set({
      skippedUploads: null,
    }),

  copySelectionToClipboard: () =>
    set((state) => ({
      clipboardPaths: [...state.selectedPaths],
    })),

  clearClipboard: () =>
    set({
      clipboardPaths: [],
    }),

  setViewPrefixesAsFolders: (val: boolean) => {
    localStorage.setItem('viewPrefixesAsFolders', String(val));
    set({ viewPrefixesAsFolders: val });
  },

  setSort: (column) =>
    set((state) => {
      const isSameColumn = state.sortColumn === column;
      const nextDirection = isSameColumn
        ? state.sortDirection === 'asc'
          ? 'desc'
          : 'asc'
        : 'asc';
      return {
        sortColumn: column,
        sortDirection: nextDirection,
      };
    }),

  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', nextTheme);
      const root = window.document.documentElement;
      if (nextTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      return { theme: nextTheme };
    }),
}));
