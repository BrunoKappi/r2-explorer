/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface R2Item {
  id: string; // usually same as path
  name: string;
  type: 'file' | 'folder';
  path: string; // e.g. "compras/notas.pdf"
  parentPath: string; // e.g. "compras" or "" for root
  size?: number; // size in bytes (undefined for folders)
  mimeType: string; // e.g. "application/pdf", "image/png", or "directory"
  createdAt: string;
  updatedAt: string;
  etag?: string;
  publicUrl?: string;
  metadata?: Record<string, string>;
}

export interface UploadProgress {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'completed' | 'failed';
}

export interface BreadcrumbItem {
  label: string;
  path: string;
}

export interface FileDetails {
  item: R2Item;
  dimensions?: string; // for images
  etag: string;
  contentType: string;
  storageClass: string;
}
