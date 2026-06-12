/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UploadItem {
  file: File;
  relativePath: string;
}

/**
 * Traverses a FileSystemEntry (HTML5 Drag and Drop Directory) recursively to find all files.
 */
export async function traverseDirectoryEntry(
  entry: FileSystemEntry,
  relativePath: string = ''
): Promise<UploadItem[]> {
  const results: UploadItem[] = [];
  if (entry.isFile) {
    const fileEntry = entry as FileSystemFileEntry;
    const file = await new Promise<File>((resolve, reject) => {
      fileEntry.file(resolve, reject);
    });
    results.push({ file, relativePath: relativePath + file.name });
  } else if (entry.isDirectory) {
    const dirEntry = entry as FileSystemDirectoryEntry;
    const dirReader = dirEntry.createReader();
    const entries = await new Promise<FileSystemEntry[]>((resolve, reject) => {
      dirReader.readEntries(resolve, reject);
    });
    for (const nestedEntry of entries) {
      const nestedFiles = await traverseDirectoryEntry(nestedEntry, relativePath + entry.name + '/');
      results.push(...nestedFiles);
    }
  }
  return results;
}

/**
 * Format bytes to readable size
 */
export function formatBytes(bytes?: number): string {
  if (bytes === undefined || bytes === null || bytes === 0) return '—';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Get human readable file details from MIME type and filename
 */
export function getReadableType(mime: string, name: string): string {
  if (mime === 'directory') return 'Pasta';
  const ext = name.split('.').pop()?.toUpperCase() || 'ARQUIVO';
  if (mime.includes('pdf')) return 'PDF';
  if (mime.startsWith('image/')) return `Imagem ${ext}`;
  if (mime.includes('json')) return 'Configuração JSON';
  if (mime.includes('javascript') || mime.includes('typescript') || name.endsWith('.tsx') || name.endsWith('.ts')) return 'Código-fonte';
  return `${ext} File`;
}

/**
 * Resolves the functional public URL for an object (mimicking the backend pattern)
 */
export function getShareUrl(bucketName: string | null, path: string): string {
  const activeBucket = bucketName || 'bkappi';
  if (activeBucket === 'bkappi' || activeBucket === 'cdn.bkappi.com') {
    return `https://cdn.bkappi.com/${path}`;
  }
  // Otherwise, fallback to download proxy URL from current window origin
  const origin = window.location.origin;
  return `${origin}/api/r2/download?bucket=${encodeURIComponent(activeBucket)}&key=${encodeURIComponent(path)}`;
}
