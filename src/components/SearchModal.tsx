/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { r2Service } from '../services/r2Service';
import { useNavigationStore } from '../stores/navigationStore';
import { X, Search, File, ImageIcon, FileText, FileSpreadsheet, FolderOpen, Download, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function formatBytes(bytes?: number): string {
  if (bytes === undefined || bytes === null || bytes === 0) return '—';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getReadableType(mime: string, name: string): string {
  const ext = name.split('.').pop()?.toUpperCase() || 'FILE';
  if (mime.includes('pdf')) return 'PDF';
  if (mime.startsWith('image/')) return `${ext} Image`;
  if (mime.includes('json')) return 'JSON Config';
  if (mime.includes('javascript') || mime.includes('typescript') || name.endsWith('.tsx') || name.endsWith('.ts')) return 'Source Code';
  return `${ext}`;
}

function getFileIcon(mime: string) {
  if (mime.startsWith('image/')) {
    return <ImageIcon size={18} className="text-blue-500 shrink-0" />;
  }
  if (mime.includes('pdf')) {
    return <FileText size={18} className="text-amber-600/80 shrink-0" />;
  }
  if (mime.includes('sheet') || mime.includes('excel') || mime.includes('csv')) {
    return <FileSpreadsheet size={18} className="text-emerald-600/85 shrink-0" />;
  }
  return <File size={18} className="text-zinc-400 shrink-0" />;
}

export default function SearchModal() {
  const { searchQuery, setSearchQuery, activeBucketName, setCurrentPath, openDialog } = useNavigationStore();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close search when pressing Escape while modal is active
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchQuery]);

  // Query search results recursively from the server using our updated flat-only routine
  const { data: results, isLoading, error } = useQuery({
    queryKey: ['search-results', activeBucketName, searchQuery],
    queryFn: () => r2Service.listObjects('', searchQuery),
    enabled: !!searchQuery && !!activeBucketName,
  });

  if (!searchQuery) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        {/* Backdrop clickable space */}
        <div className="absolute inset-0" onClick={() => setSearchQuery('')} />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative bg-white w-full max-w-4xl max-h-[85vh] rounded-xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/40">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-zinc-100 text-zinc-600">
                <Search size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 text-sm">Search Results</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Searching for &ldquo;<span className="font-medium text-zinc-600 font-mono">{searchQuery}</span>&rdquo; without folder prefixes
                </p>
              </div>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="text-zinc-400 hover:text-zinc-600 p-1.5 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
              title="Close search"
            >
              <X size={16} />
            </button>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto p-6 min-h-[300px]">
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-white">
                <Loader2 size={24} className="text-zinc-500 animate-spin" />
                <span className="text-xs text-zinc-400 font-sans">Searching items in Cloudflare R2...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <AlertCircle size={32} className="text-rose-500 mb-2" />
                <h4 className="font-semibold text-zinc-800 text-sm">Failed to search objects</h4>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm">{(error as any)?.message || 'Unexpected error'}</p>
              </div>
            ) : !results || results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-12 w-12 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 mb-3 border border-zinc-100">
                  <Search size={20} />
                </div>
                <h4 className="font-semibold text-zinc-800 text-xs">No matching files</h4>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                  We couldn't find any files with that name or path in the bucket.
                </p>
              </div>
            ) : (
              <div className="border border-zinc-100 rounded-lg overflow-hidden bg-white shadow-3xs">
                <table className="w-full border-collapse text-left text-xs text-zinc-600">
                  <thead className="bg-zinc-50 border-b border-zinc-100 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider sticky top-0">
                    <tr>
                      <th className="pl-4 pr-3 py-2.5">Full File Path</th>
                      <th className="px-3 py-2.5 text-right w-24">Size</th>
                      <th className="px-3 py-2.5 hidden sm:table-cell w-36">Modified</th>
                      <th className="px-3 py-2.5 hidden md:table-cell w-24">Type</th>
                      <th className="px-4 py-2.5 text-right w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((item) => (
                      <tr 
                        key={item.id} 
                        onDoubleClick={() => openDialog('details', item.path)}
                        className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 transition-colors h-11 cursor-pointer"
                      >
                        {/* Full path display */}
                        <td className="pl-4 pr-3 py-2 max-w-sm truncate">
                          <div className="flex items-center gap-2.5">
                            {getFileIcon(item.mimeType)}
                            <span className="font-mono text-[11.5px] text-zinc-800 truncate select-all" title={item.path}>
                              {item.path}
                            </span>
                          </div>
                        </td>

                        {/* Size */}
                        <td className="px-3 py-2 font-mono text-right text-zinc-400 tabular-nums">
                          {formatBytes(item.size)}
                        </td>

                        {/* Last Modified */}
                        <td className="px-3 py-2 hidden sm:table-cell font-mono text-zinc-400 text-[10.5px]">
                          {new Date(item.updatedAt).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>

                        {/* Type Label */}
                        <td className="px-3 py-2 hidden md:table-cell text-zinc-400 text-[10.5px]">
                          {getReadableType(item.mimeType, item.name)}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setCurrentPath(item.parentPath);
                                setSearchQuery(''); // automatically closes search and navigates
                              }}
                              className="h-7 px-2 bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-350 text-[11px] font-medium text-zinc-650 rounded-md flex items-center gap-1 transition-all cursor-pointer shadow-3xs"
                              title="Locate file in folder"
                            >
                              <FolderOpen size={11} className="stroke-[2.5]" />
                              <span>Open Folder</span>
                            </button>
                            <button
                              onClick={() => r2Service.downloadFile(item.path).catch(err => alert(err.message || 'Error downloading file.'))}
                              className="h-7 w-7 bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-350 rounded-md flex items-center justify-center text-zinc-600 transition-all cursor-pointer shadow-3xs"
                              title="Download file"
                            >
                              <Download size={11} className="stroke-[2.5]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer status bar */}
          <div className="px-6 py-3 border-t border-zinc-100 bg-zinc-50/50 flex justify-between items-center text-[10.5px] text-zinc-405 font-sans shrink-0">
            <span>
              Total results: <strong className="text-zinc-600">{results?.length || 0}</strong>
            </span>
            <span>S3 Flat Style</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
