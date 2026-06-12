/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Folder,
  File,
  ImageIcon,
  FileText,
  FileSpreadsheet,
  Calendar,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { R2Item } from "../types";
import { useNavigationStore } from "../stores/navigationStore";
import { r2Service } from "../services/r2Service";
import { formatBytes, getReadableType } from "../utils/fileUtils";

interface FileRowProps {
  key?: string;
  item: R2Item;
  allVisiblePaths: string[];
  allObjects?: R2Item[];
}

function getRowIcon(mime: string, isSelected: boolean) {
  if (mime === "directory") {
    return (
      <Folder
        size={16.5}
        className={`${isSelected ? "text-blue-500 fill-blue-100/30" : "text-zinc-400 fill-zinc-100/60"} shrink-0 select-none transition-colors`}
      />
    );
  }
  if (mime.startsWith("image/")) {
    return (
      <ImageIcon
        size={16.5}
        className={`${isSelected ? "text-blue-500" : "text-zinc-400"} shrink-0 select-none transition-colors`}
      />
    );
  }
  if (mime.includes("pdf")) {
    return (
      <FileText
        size={16.5}
        className={`${isSelected ? "text-blue-600" : "text-amber-600/80"} shrink-0 select-none transition-colors`}
      />
    );
  }
  if (
    mime.includes("sheet") ||
    mime.includes("excel") ||
    mime.includes("csv")
  ) {
    return (
      <FileSpreadsheet
        size={16.5}
        className={`${isSelected ? "text-blue-600" : "text-emerald-600/85"} shrink-0 select-none transition-colors`}
      />
    );
  }
  return (
    <File
      size={16.5}
      className={`${isSelected ? "text-blue-500" : "text-zinc-450"} shrink-0 select-none transition-colors`}
    />
  );
}

function formatRowDate(dateInput: string | Date | undefined) {
  if (!dateInput) return "--";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "--";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export default function FileRow({
  item,
  allVisiblePaths,
  allObjects,
}: FileRowProps) {
  const {
    selectedPaths,
    selectPath,
    setCurrentPath,
    openContextMenu,
    searchQuery,
    openDialog,
    currentPath,
  } = useNavigationStore();

  const [isDragOverRow, setIsDragOverRow] = React.useState(false);
  const [draggable, setDraggable] = React.useState(true);
  const queryClient = useQueryClient();

  const isSelected = selectedPaths.includes(item.path);

  // Calculate size and count for folder recursively
  let folderFilesCount = 0;
  let folderFilesSize = 0;
  let folderLastModified: string | undefined = undefined;
  const isFolder = item.type === "folder";

  if (isFolder && allObjects) {
    const folderPrefix = item.path.endsWith("/") ? item.path : `${item.path}/`;
    const filesInFolder = allObjects.filter(
      (obj) =>
        obj.type === "file" &&
        (obj.path.startsWith(folderPrefix) || obj.path === item.path),
    );
    folderFilesCount = filesInFolder.length;
    folderFilesSize = filesInFolder.reduce((sum, f) => sum + (f.size || 0), 0);

    if (filesInFolder.length > 0) {
      const dates = filesInFolder
        .map((f) => (f.updatedAt ? new Date(f.updatedAt).getTime() : 0))
        .filter((t) => t > 0);
      if (dates.length > 0) {
        folderLastModified = new Date(Math.max(...dates)).toISOString();
      }
    }
  }

  // Mouse selection operators (always does a toggle when clicking the checkbox)
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();

    selectPath(item.path, {
      ctrlKey: true,
      shiftKey: false,
      allVisiblePaths,
    });
  };

  const handleRowClick = (e: React.MouseEvent) => {
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

  const handleRowDoubleClick = (e: React.MouseEvent) => {
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
    } else if (item.type === "file") {
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

    // Determine paths to move (single item vs multiple selection)
    const isDraggedSelected = selectedPaths.includes(draggedPath);
    const pathsToMove = isDraggedSelected ? selectedPaths : [draggedPath];

    // Check if moving folder inside its own subdirectory
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
      const bucketName =
        useNavigationStore.getState().activeBucketName || "bkappi";
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
    // Disable drag if clicking checkboxes, buttons, options menu, or holding modifier keys (Ctrl/Shift/Meta)
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

  return (
    <tr
      id={`file-row-${item.id.replace(/[^a-zA-Z0-0]/g, "-")}`}
      data-explorer-row="true"
      data-path={item.path}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onClick={handleRowClick}
      onDoubleClick={handleRowDoubleClick}
      onContextMenu={handleRightClick}
      className={`group border-b border-zinc-100/70 dark:border-zinc-800/40 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 cursor-pointer transition-all select-none text-[12px] h-11 ${
        isDragOverRow
          ? "bg-blue-100/30 dark:bg-blue-950/40 ring-2 ring-blue-500/80 ring-dashed border-transparent"
          : isSelected
            ? "bg-blue-50/30 dark:bg-blue-950/30 text-zinc-900 dark:text-zinc-100 border-zinc-100 dark:border-zinc-800/80 font-medium"
            : "text-zinc-655 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
      }`}>
      {/* Checkbox */}
      <td className="pl-4 pr-1 py-2 w-10 text-left select-none no-row-click">
        <div
          onClick={handleSelect}
          className="custom-checkbox h-4 w-4 rounded-md border flex items-center justify-center transition-all duration-150 cursor-pointer border-zinc-300 hover:border-zinc-400 bg-white dark:border-zinc-700 dark:hover:border-zinc-500 dark:bg-zinc-950 data-[state=selected]:bg-zinc-800 data-[state=selected]:border-zinc-800 data-[state=selected]:text-white data-[state=selected]:dark:bg-zinc-100 data-[state=selected]:dark:border-zinc-100 data-[state=selected]:dark:text-zinc-900 data-[state=selected]:shadow-3xs"
          data-state={isSelected ? "selected" : "unchecked"}>
          {isSelected && (
            <svg
              className="w-2.5 h-2.5 stroke-2 stroke-current"
              viewBox="0 0 24 24"
              fill="none">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </td>

      {/* Objects */}
      <td className="px-3 py-2 max-w-sm truncate">
        <div className="flex items-center gap-2.5">
          {getRowIcon(item.mimeType, isSelected)}
          {item.type === "folder" ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setCurrentPath(item.path);
              }}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium hover:underline cursor-pointer select-none inline-block text-left">
              {item.name.endsWith("/") ? item.name : `${item.name}/`}
            </span>
          ) : (
            <span
              className={`truncate font-medium ${isSelected ? "text-zinc-900 dark:text-zinc-100 font-semibold" : "text-zinc-700 dark:text-zinc-300"}`}>
              {item.name}
            </span>
          )}
          {searchQuery && item.parentPath && (
            <span
              className="text-[10px] font-mono text-zinc-400 dark:text-zinc-550 font-light truncate select-none ml-2"
              title={`Folder: ${item.parentPath}`}>
              in /{item.parentPath}
            </span>
          )}
        </div>
      </td>

      {/* Type */}
      <td className="px-3 py-2 font-sans text-left text-zinc-500 dark:text-zinc-400 w-32 truncate">
        {item.type === "folder"
          ? "Folder"
          : getReadableType(item.mimeType, item.name)}
      </td>

      {/* Items */}
      <td className="px-3 py-2 font-mono text-right tabular-nums w-24 text-zinc-500 dark:text-zinc-400">
        {item.type === "folder" ? folderFilesCount : "--"}
      </td>

      {/* Size */}
      <td className="px-3 py-2 w-24">
        <div className="flex justify-end">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-mono font-medium leading-none bg-zinc-100 text-zinc-600 border border-zinc-200/50 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700/50 transition-colors select-text whitespace-nowrap">
            {item.type === "folder"
              ? formatBytes(folderFilesSize)
              : formatBytes(item.size)}
          </span>
        </div>
      </td>

      {/* Modified */}
      <td className="px-3 py-2 w-48">
        <div className="flex justify-start">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium leading-none bg-zinc-100/80 text-zinc-600 border border-zinc-200/60 dark:bg-zinc-800/50 dark:text-zinc-400 dark:border-zinc-700/40 transition-colors select-text">
            <Calendar
              size={11}
              className="text-zinc-400 dark:text-zinc-500 shrink-0"
            />
            {item.type === "folder"
              ? formatRowDate(folderLastModified || item.updatedAt)
              : formatRowDate(item.updatedAt)}
          </span>
        </div>
      </td>

      {/* Action / Options kebab */}
      <td className="pr-4 pl-1 py-1 text-right w-10 text-zinc-400 dark:text-zinc-500 no-row-click">
        <button
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            openContextMenu(
              rect.left,
              rect.bottom + window.scrollY,
              item.path,
              item.type,
            );
          }}
          className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-650 dark:hover:text-zinc-300 transition-colors cursor-pointer"
          title="Options">
          <span className="font-bold text-sm tracking-widest text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
            ···
          </span>
        </button>
      </td>
    </tr>
  );
}
