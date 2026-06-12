/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { R2Item } from '../types';
import { useNavigationStore } from '../stores/navigationStore';

export const r2Service = {
  /**
   * Lists buckets in the account
   */
  async listBuckets(): Promise<{ name: string; createdAt: string }[]> {
    const res = await fetch('/api/r2/buckets');
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Não foi possível listar os buckets no Cloudflare R2.');
    }
    return res.json();
  },

  /**
   * Lists elements in a given absolute folder path
   * @param currentPath Path inside bucket, e.g. "" (root), "assets", "assets/imagens"
   */
  async listObjects(currentPath: string, search: string = ''): Promise<R2Item[]> {
    const bucket = useNavigationStore.getState().activeBucketName;
    if (!bucket) {
      return [];
    }
    const flatMode = !useNavigationStore.getState().viewPrefixesAsFolders;
    const url = search
      ? `/api/r2/objects?bucket=${encodeURIComponent(bucket)}&search=${encodeURIComponent(search)}`
      : `/api/r2/objects?bucket=${encodeURIComponent(bucket)}&prefix=${encodeURIComponent(currentPath)}${flatMode ? '&flat=true' : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao carregar objetos do bucket R2.');
    }
    return res.json();
  },

  /**
   * Creates a folder in the current active folder path
   */
  async createFolder(parentPath: string, folderName: string): Promise<R2Item> {
    const bucket = useNavigationStore.getState().activeBucketName;
    if (!bucket) {
      throw new Error('Selecione um bucket primeiro.');
    }
    const res = await fetch('/api/r2/folder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucketName: bucket,
        parentPath,
        folderName,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Não foi possível criar a pasta.');
    }
    const data = await res.json();
    return data.folder;
  },

  /**
   * Upload an object
   */
  async uploadObject(
    parentPath: string,
    fileObj: any, // either metadata or actual File
    onProgress?: (progress: number) => void
  ): Promise<R2Item> {
    const bucket = useNavigationStore.getState().activeBucketName;
    if (!bucket) {
      throw new Error('Nenhum bucket selecionado para upload.');
    }

    if (fileObj instanceof File) {
      const formData = new FormData();
      formData.append('file', fileObj);
      formData.append('bucketName', bucket);
      formData.append('parentPath', parentPath);

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/r2/upload');

        if (onProgress) {
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              onProgress(progress);
            }
          };
        }

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve(data.file);
            } catch {
              reject(new Error('Resposta inválida do servidor.'));
            }
          } else {
            try {
              const err = JSON.parse(xhr.responseText);
              reject(new Error(err.error || 'Erro ao enviar arquivo.'));
            } catch {
              reject(new Error(`Erro ${xhr.status} no upload.`));
            }
          }
        };

        xhr.onerror = () => {
          reject(new Error('Falha de conexão ao subir arquivo.'));
        };

        xhr.send(formData);
      });
    }

    // Default raw metadata upload case if fallback is needed
    const res = await fetch('/api/r2/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucketName: bucket,
        parentPath,
        fileName: fileObj.name,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Falha ao processar upload.');
    }
    const data = await res.json();
    return data.file;
  },

  /**
   * Renames a single object (file or folder).
   */
  async renameObject(oldPath: string, newName: string): Promise<any> {
    const bucket = useNavigationStore.getState().activeBucketName;
    if (!bucket) {
      throw new Error('Bucket não selecionado.');
    }
    const res = await fetch('/api/r2/rename', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucketName: bucket,
        oldPath,
        newName,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao renomear objeto no R2.');
    }
    return res.json();
  },

  /**
   * Deletes objects
   */
  async deleteObjects(paths: string[]): Promise<void> {
    const bucket = useNavigationStore.getState().activeBucketName;
    if (!bucket) {
      throw new Error('Nenhum bucket selecionado.');
    }
    const res = await fetch('/api/r2/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucketName: bucket,
        paths,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Falha ao deletar arquivos selecionados do R2.');
    }
  },

  /**
   * Move multiple objects/folders to a target path.
   */
  async moveObjects(paths: string[], targetPath: string): Promise<void> {
    const bucket = useNavigationStore.getState().activeBucketName;
    if (!bucket) {
      throw new Error('Bucket não selecionado.');
    }
    const res = await fetch('/api/r2/move', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucketName: bucket,
        paths,
        targetPath,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Não foi possível mover os arquivos.');
    }
  },

  /**
   * Resets the entire database (no-op now as we use real bucket)
   */
  async resetDatabase(): Promise<R2Item[]> {
    return [];
  },

  /**
   * Retrieve folder tree for the "Move To" selection picker
   */
  async getAllFolders(): Promise<R2Item[]> {
    const bucket = useNavigationStore.getState().activeBucketName;
    if (!bucket) {
      return [];
    }
    const res = await fetch(`/api/r2/objects?bucket=${encodeURIComponent(bucket)}&recursive=true`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Não foi possível ler diretórios do bucket R2.');
    }
    return res.json();
  },

  /**
   * Retrieve all files recursively inside the bucket for global statistics
   */
  async getAllFilesRecursively(): Promise<R2Item[]> {
    const bucket = useNavigationStore.getState().activeBucketName;
    if (!bucket) {
      return [];
    }
    const res = await fetch(`/api/r2/objects?bucket=${encodeURIComponent(bucket)}&prefix=&flat=true`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Não foi possível ler todos os arquivos para estatísticas.');
    }
    return res.json();
  },

  /**
   * Performs dynamic ZIP packaging extraction download
   */
  async downloadZip(paths: string[]): Promise<void> {
    const bucket = useNavigationStore.getState().activeBucketName || 'bkappi';
    const response = await fetch('/api/r2/download-zip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucketName: bucket,
        paths,
      }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao gerar download compactado.');
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // Customize file name based on paths
    const fileName = paths.length === 1 ? `${paths[0].split('/').pop() || 'backup'}.zip` : 'bkappi_selecao.zip';
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  /**
   * Download a single clean file directly using fetch+blob to bypass iframe sandbox restrictions
   */
  async downloadFile(path: string): Promise<void> {
    const bucket = useNavigationStore.getState().activeBucketName || 'bkappi';
    const downloadUrl = `/api/r2/download?bucket=${encodeURIComponent(bucket)}&key=${encodeURIComponent(path)}`;
    
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Não foi possível baixar o arquivo.');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = path.split('/').pop() || 'arquivo';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  /**
   * Duplicates/copies multiple paths into the target destinationFolder with copy suffixes
   */
  async copyObjects(paths: string[], destinationFolder: string): Promise<void> {
    const bucket = useNavigationStore.getState().activeBucketName;
    if (!bucket) {
      throw new Error('Nenhum bucket selecionado.');
    }

    const response = await fetch('/api/r2/copy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucketName: bucket,
        paths,
        destinationFolder,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao duplicar arquivos/pastas.');
    }
  }
};
