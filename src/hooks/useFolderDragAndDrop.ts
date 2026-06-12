/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { traverseDirectoryEntry, UploadItem } from '../utils/fileUtils';

interface UseFolderDragAndDropOptions {
  onUploadItems: (items: UploadItem[]) => Promise<void> | void;
}

export function useFolderDragAndDrop({ onUploadItems }: UseFolderDragAndDropOptions) {
  const [isDragActive, setIsDragActive] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only handle external file/folder uploads from OS
    const isFileDrag = e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files');
    if (!isFileDrag) return;

    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isFileDrag = e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files');
    if (!isFileDrag) return;

    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragActive(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isFileDrag = e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files');
    if (isFileDrag) {
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isFileDrag = e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files');
    if (!isFileDrag) {
      setIsDragActive(false);
      dragCounter.current = 0;
      return;
    }

    setIsDragActive(false);
    dragCounter.current = 0;

    let uploadItems: UploadItem[] = [];

    if (e.dataTransfer.items) {
      const entries: FileSystemEntry[] = [];
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        const item = e.dataTransfer.items[i];
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            entries.push(entry);
          }
        }
      }

      if (entries.length > 0) {
        for (const entry of entries) {
          const items = await traverseDirectoryEntry(entry);
          uploadItems.push(...items);
        }
      }
    } else if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files) as File[];
      uploadItems = files.map((file) => ({
        file,
        relativePath: file.name,
      }));
    }

    if (uploadItems.length > 0) {
      await onUploadItems(uploadItems);
    }
  };

  return {
    isDragActive,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
