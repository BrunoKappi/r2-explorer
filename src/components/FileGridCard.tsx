/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Folder, File, ImageIcon, FileText, FileSpreadsheet, Calendar } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { R2Item } from "../types";
import { useNavigationStore } from "../stores/navigationStore";
import { r2Service } from "../services/r2Service";
import { formatBytes, getReadableType, getShareUrl } from "../utils/fileUtils";

interface FileGridCardProps {
  key?: string;
  item: R2Item;
  viewMode: 'icons-sm' | 'icons-md' | 'icons-lg' | 'icons-xl' | 'mosaic';
  allVisiblePaths: string[];
  allObjects?: R2Item[];
}

function getGridIcon(mime: string, isSelected: boolean, size = 20) {
  if (mime === "directory") {
    return (
      <Folder
        size={size}
        className={`${isSelected ? "text-blue-500 fill-blue-100/30" : "text-zinc-400 fill-zinc-100/60"} shrink-0 select-none transition-colors`}
      />
    );
  }
  if (mime.startsWith("image/")) {
    return (
      <ImageIcon
        size={size}
        className={`${isSelected ? "text-blue-500" : "text-zinc-400 dark:text-zinc-500"} shrink-0 select-none transition-colors`}
      />
    );
  }
  if (mime.includes("pdf")) {
    return (
      <FileText
        size={size}
        className={`${isSelected ? "text-blue-600" : "text-amber-600 dark:text-amber-500/80"} shrink-0 select-none transition-colors`}
      />
    );
  }
  if (mime.includes("sheet") || mime.includes("excel") || mime.includes("csv")) {
    return (
      <FileSpreadsheet
        size={size}
        className={`${isSelected ? "text-blue-600" : "text-emerald-600 dark:text-emerald-500/85"} shrink-0 select-none transition-colors`}
      />
    );
  }
  return (
    <File
      size={size}
      className={`${isSelected ? "text-blue-500" : "text-zinc-400 dark:text-zinc-500"} shrink-0 select-none transition-colors`}
    />
  );
}

export default function FileGridCard({
  item,
  viewMode,
  allVisiblePaths,
  allObjects,
}: FileGridCardProps) {
  const {
    selectedPaths,
    selectPath,
    setCurrentPath,
    openContextMenu,
    searchQuery,
    openDialog,
    currentPath,
    activeBucketName,
  } = useNavigationStore();

  const [isDragOverRow, setIsDragOverRow] = React.useState(false);
  const [draggable, setDraggable] = React.useState(true);
  const queryClient = useQueryClient();

  const isSelected = selectedPaths.includes(item.path);
  const isFolder = item.type === "folder";

  // Calculate folder stats recursively
  let folderFilesCount = 0;
  let folderFilesSize = 0;
  if (isFolder && allObjects) {
    const folderPrefix = item.path.endsWith("/") ? item.path : `${item.path}/`;
    const filesInFolder = allObjects.filter(
      (obj) =>
        obj.type === "file" &&
        (obj.path.startsWith(folderPrefix) || obj.path === item.path),
    );
    folderFilesCount = filesInFolder.length;
    folderFilesSize = filesInFolder.reduce((sum, f) => sum + (f.size || 0), 0);
  }

  // Click & context menu handlers (same as FileRow)
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectPath(item.path, {
      ctrlKey: true,
      shiftKey: false,
      allVisiblePaths,
    });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("input") ||
      target.closest(".no-row-click") ||
      target.closest(".custom-checkbox")
    ) {
      return;
    }
    selectPath(item.path, {
      ctrlKey: e.ctrlKey || e.metaKey,
      shiftKey: e.shiftKey,
      allVisiblePaths,
    });
  };

  const handleCardDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("input") ||
      target.closest(".no-row-click") ||
      target.closest(".custom-checkbox")
    ) {
      return;
    }

    if (item.type === "folder") {
      setCurrentPath(item.path);
    } else {
      openDialog("details", item.path);
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedPaths.includes(item.path)) {
      selectPath(item.path, {
        ctrlKey: false,
        shiftKey: false,
        allVisiblePaths,
      });
    }
    openContextMenu(e.clientX, e.clientY, item.path, item.type);
  };

  // Drag & drop handlers (same as FileRow)
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", item.path);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (item.type === "folder") {
      e.preventDefault();
      setIsDragOverRow(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOverRow(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    setIsDragOverRow(false);
    if (item.type !== "folder") return;

    e.preventDefault();
    const draggedPath = e.dataTransfer.getData("text/plain");
    if (!draggedPath || draggedPath === item.path) return;

    const isDraggedSelected = selectedPaths.includes(draggedPath);
    const pathsToMove = isDraggedSelected ? selectedPaths : [draggedPath];

    for (const path of pathsToMove) {
      const folderPrefix = path.endsWith("/") ? path : `${path}/`;
      const targetPrefix = item.path.endsWith("/") ? item.path : `${item.path}/`;
      if (item.path === path || targetPrefix.startsWith(folderPrefix)) {
        alert("Cannot move a folder inside itself or its own subdirectories.");
        return;
      }
    }

    try {
      await r2Service.moveObjects(pathsToMove, item.path);
      const bucketName = activeBucketName || "bkappi";
      queryClient.invalidateQueries({
        queryKey: ["objects", bucketName, currentPath],
      });
      queryClient.invalidateQueries({ queryKey: ["folders-tree", bucketName] });
      queryClient.invalidateQueries({ queryKey: ["folders-count"] });

      if (isDraggedSelected) {
        useNavigationStore.getState().clearSelection();
      }
    } catch (err: any) {
      alert(err?.message || "Error moving item.");
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("input") ||
      target.closest(".no-row-click") ||
      target.closest(".custom-checkbox") ||
      e.ctrlKey || e.metaKey || e.shiftKey
    ) {
      setDraggable(false);
    } else {
      setDraggable(true);
    }
  };

  const handleMouseLeave = () => {
    setDraggable(true);
  };

  const shareUrl = getShareUrl(activeBucketName, item.path);
  const hasPreview = item.type === "file" && item.mimeType.startsWith("image/");

  // Small Icons View layout (Horizontal Layout)
  if (viewMode === 'icons-sm') {
    return (
      <div
        id={`file-row-${item.id.replace(/[^a-zA-Z0-9]/g, "-")}`}
        data-explorer-row="true"
        data-path={item.path}
        draggable={draggable}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        onDoubleClick={handleCardDoubleClick}
        onContextMenu={handleRightClick}
      className={`group border border-transparent rounded-lg cursor-pointer transition-all select-none flex items-center gap-2 p-1.5 text-[11.5px] h-9 max-w-full truncate ${
          isDragOverRow
            ? "bg-blue-100/25 dark:bg-blue-955/35 ring-2 ring-blue-500/80 ring-dashed"
            : isSelected
              ? "bg-blue-50/30 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60 text-zinc-900 dark:text-zinc-100 font-medium"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 hover:text-zinc-900 dark:hover:text-zinc-200"
        }`}
      >
        {/* Floating Checkbox (visible on hover or if selected) */}
        <div className="no-row-click flex items-center shrink-0">
          <div
            onClick={handleSelect}
            className={`custom-checkbox h-3.5 w-3.5 rounded-md border flex items-center justify-center transition-all duration-150 cursor-pointer ${
              isSelected 
                ? "bg-zinc-800 border-zinc-800 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900"
                : "border-zinc-300 hover:border-zinc-400 bg-white dark:border-zinc-700 dark:bg-zinc-950 opacity-0 group-hover:opacity-100"
            }`}
            data-state={isSelected ? "selected" : "unchecked"}
          >
            {isSelected && (
              <svg className="w-2.5 h-2.5 stroke-2 stroke-current" viewBox="0 0 24 24" fill="none">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </div>

        {/* Small thumbnail or icon */}
        <div className="w-5 h-5 flex items-center justify-center overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-200/60 dark:border-zinc-800/50 rounded shrink-0 select-none">
          {hasPreview ? (
            <img
              src={item.publicUrl || shareUrl}
              alt={item.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            getGridIcon(item.mimeType, isSelected, 12)
          )}
        </div>

        {/* Name */}
        <div className="truncate font-sans min-w-0 flex-1 text-left">
          {item.type === "folder" ? (
            <span className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer">
              {item.name.endsWith("/") ? item.name : `${item.name}/`}
            </span>
          ) : (
            <span className="truncate font-medium">{item.name}</span>
          )}
        </div>
      </div>
    );
  }

  // Size configuration for Grid Views (MD, LG, XL, MOSAIC)
  const sizes = {
    'icons-md': {
      cardHeight: 'h-28 w-24',
      previewSize: 'w-12 h-12',
      iconSize: 24,
      imagePading: 'p-0.5',
      showSubtext: false,
      imageStyle: 'w-full h-full object-cover',
    },
    'icons-lg': {
      cardHeight: 'h-40 w-36',
      previewSize: 'w-20 h-20',
      iconSize: 40,
      imagePading: 'p-1',
      showSubtext: true,
      imageStyle: 'w-full h-full object-cover',
    },
    'icons-xl': {
      cardHeight: 'h-56 w-52',
      previewSize: 'w-32 h-32',
      iconSize: 64,
      imagePading: 'p-1.5',
      showSubtext: true,
      imageStyle: 'w-full h-full object-cover',
    },
    'mosaic': {
      cardHeight: 'h-36 flex-grow min-w-[140px] max-w-[360px]',
      previewSize: 'w-full h-24',
      iconSize: 32,
      imagePading: 'p-0',
      showSubtext: true,
      imageStyle: 'w-full h-full object-cover',
    },
  };

  const conf = sizes[viewMode as keyof typeof sizes] || sizes['icons-md'];

  return (
    <div
      id={`file-row-${item.id.replace(/[^a-zA-Z0-9]/g, "-")}`}
      data-explorer-row="true"
      data-path={item.path}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      onDoubleClick={handleCardDoubleClick}
      onContextMenu={handleRightClick}
      className={`group border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-all select-none flex relative flex-col items-center p-3 text-[11.5px] ${conf.cardHeight} ${
        isDragOverRow
          ? "bg-blue-100/20 dark:bg-blue-950/30 ring-2 ring-blue-500/80 ring-dashed border-transparent"
          : isSelected
            ? "bg-blue-50/20 dark:bg-blue-950/15 border-blue-300 dark:border-blue-900 ring-1 ring-blue-300/40 dark:ring-blue-800/40"
            : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50/40 dark:hover:bg-zinc-800/10 hover:text-zinc-900 dark:hover:text-zinc-200"
      }`}
    >
      {/* Absolute Checkbox top-left */}
      <div className="absolute top-2.5 left-2.5 no-row-click z-10">
        <div
          onClick={handleSelect}
          className={`custom-checkbox h-4 w-4 rounded-md border flex items-center justify-center transition-all duration-150 cursor-pointer shadow-3xs ${
            isSelected 
              ? "bg-zinc-800 border-zinc-800 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900"
              : "border-zinc-300 hover:border-zinc-400 bg-white dark:border-zinc-700 dark:bg-zinc-950 opacity-0 group-hover:opacity-100"
          }`}
          data-state={isSelected ? "selected" : "unchecked"}
        >
          {isSelected && (
            <svg className="w-2.5 h-2.5 stroke-2 stroke-current" viewBox="0 0 24 24" fill="none">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </div>

      {/* Centered Preview Container */}
      <div className={`${conf.previewSize} flex items-center justify-center bg-zinc-50/60 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shrink-0 select-none transition-all shadow-3xs group-hover:shadow-2xs`}>
        {hasPreview ? (
          <img
            src={item.publicUrl || shareUrl}
            alt={item.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className={`${conf.imageStyle || 'w-full h-full object-cover'} ${conf.imagePading}`}
          />
        ) : (
          getGridIcon(item.mimeType, isSelected, conf.iconSize)
        )}
      </div>

      {/* Filename & Info Container */}
      <div className="mt-3 w-full flex flex-col items-center justify-center text-center overflow-hidden min-w-0">
        {item.type === "folder" ? (
          <span 
            onClick={(e) => {
              e.stopPropagation();
              setCurrentPath(item.path);
            }}
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer truncate max-w-full text-center block"
          >
            {item.name.endsWith("/") ? item.name : `${item.name}/`}
          </span>
        ) : (
          <span className="truncate max-w-full text-center block font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 leading-tight">
            {item.name}
          </span>
        )}

        {/* Subtext info for LG and XL view modes */}
        {conf.showSubtext && (
          <span className="text-[10px] text-zinc-400 dark:text-zinc-550 select-none mt-1 font-sans font-normal block leading-none">
            {item.type === "folder" 
              ? `${folderFilesCount} ${folderFilesCount === 1 ? 'item' : 'itens'}` 
              : formatBytes(item.size)}
          </span>
        )}
      </div>
    </div>
  );
}
