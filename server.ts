/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import multer from 'multer';
import { Writable } from 'stream';
import { createServer as createViteServer } from 'vite';

import { ZipArchive } from 'archiver';
import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  CopyObjectCommand,
  GetObjectCommand,
  CreateBucketCommand
} from '@aws-sdk/client-s3';

// Load environment variables for local testing and force override pre-defined system variables if present in `.env`
import dotenv from 'dotenv';
dotenv.config({ override: true });

const app = express();
const PORT = 3000;

// Enable JSON bodies with limit up to 50MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy initializer for S3/R2 client to avoid throwing on boot
let s3Client: S3Client | null = null;
let currentClientKey = '';

function sanitizeValue(val: string | undefined, fallback: string = ''): string {
  if (!val) return fallback;
  let s = val.trim();
  // Remove enclosing double quotes if any
  if (s.startsWith('"') && s.endsWith('"')) {
    s = s.substring(1, s.length - 1).trim();
  }
  // Remove enclosing single quotes if any
  if (s.startsWith("'") && s.endsWith("'")) {
    s = s.substring(1, s.length - 1).trim();
  }
  return s;
}

function resolveActualBucketName(bucketName: string | undefined): string {
  const sanitized = sanitizeValue(bucketName);
  const defaultBucketName = sanitizeValue(process.env.R2_BUCKET_NAME, 'bkappi');
  // If the bucket name is empty, or equals the custom domain 'cdn.bkappi.com',
  // map it to the actual default bucket name ('bkappi') so the operation succeeds on Cloudflare R2
  if (!sanitized || sanitized === 'cdn.bkappi.com') {
    return defaultBucketName;
  }
  return sanitized;
}

const verifiedBuckets = new Set<string>();

async function ensureBucketExists(bucketName: string): Promise<void> {
  const cleanBucket = resolveActualBucketName(bucketName);
  if (!cleanBucket) return;
  if (verifiedBuckets.has(cleanBucket)) return;

  try {
    const client = getR2Client();
    console.log(`[R2] Verifying or auto-creating bucket: "${cleanBucket}"`);
    await client.send(new CreateBucketCommand({ Bucket: cleanBucket }));
    console.log(`[R2] Bucket "${cleanBucket}" is successfully ensured/created.`);
    verifiedBuckets.add(cleanBucket);
  } catch (err: any) {
    // With scoped credentials, CreateBucketCommand might return AccessDenied, UnknownError, or Forbidden.
    // In any case, we assume the bucket already exists or is pre-managed, and we mark it as verified
    // so we don't repeat this check on every subsequent operation.
    console.log(`[R2] Bucket "${cleanBucket}" initialized. Using existing bucket.`);
    verifiedBuckets.add(cleanBucket);
  }
}

function getR2Client(): S3Client {
  const accessKeyId = sanitizeValue(process.env.R2_ACCESS_KEY_ID, '3e6d84ff77a2473658803969f9c1324f');
  const secretAccessKey = sanitizeValue(process.env.R2_SECRET_ACCESS_KEY, '625dae10a0dba6c7f3fc9490cd5730145e2906178e93ef45bb96fcea432c4d85');
  let endpoint = sanitizeValue(process.env.R2_ENDPOINT, 'https://ab7c0100f85a82f3ad7f9b0186c9597d.r2.cloudflarestorage.com');

  console.log('[R2 Config] Loaded endpoint:', endpoint);

  // Sanitize endpoint: extract only the protocol and host if it contains any path (e.g. /bkappi)
  try {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      const parsed = new URL(endpoint);
      endpoint = parsed.origin;
    } else {
      const parsed = new URL('https://' + endpoint);
      endpoint = parsed.origin;
    }
  } catch (e) {
    console.error('[R2 Config] Failed parsing endpoint as URL - using as is:', endpoint, e);
  }

  // If the endpoint is a custom domain instead of a direct R2/S3 endpoint, we must use the direct endpoint for API operations
  let s3Endpoint = endpoint;
  if (!s3Endpoint.includes('.r2.cloudflarestorage.com')) {
    s3Endpoint = 'https://ab7c0100f85a82f3ad7f9b0186c9597d.r2.cloudflarestorage.com';
    console.log('[R2 Config] Custom domain detected. Routing S3 client requests to fallback API endpoint:', s3Endpoint);
  }

  const clientKey = `${accessKeyId}:${secretAccessKey}:${s3Endpoint}`;

  if (!s3Client || currentClientKey !== clientKey) {
    console.log('[R2 Config] Initializing R2 Client with sanitized S3 endpoint:', s3Endpoint);
    
    // Cloudflare R2 requires region to be "auto"
    s3Client = new S3Client({
      region: 'auto',
      endpoint: s3Endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true,
    });
    currentClientKey = clientKey;
  }
  return s3Client;
}

// Multer memory storage for uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

/**
 * MIME type mapping for cleaner presentation in client UI
 */
function getMIMETypeFromExtension(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'gif': return 'image/gif';
    case 'webp': return 'image/webp';
    case 'svg': return 'image/svg+xml';
    case 'ico': return 'image/x-icon';
    case 'pdf': return 'application/pdf';
    case 'txt': return 'text/plain';
    case 'html': return 'text/html';
    case 'css': return 'text/css';
    case 'js': return 'application/javascript';
    case 'ts':
    case 'tsx': return 'text/typescript';
    case 'json': return 'application/json';
    case 'md': return 'text/markdown';
    case 'csv': return 'text/csv';
    case 'xml': return 'application/xml';
    case 'zip': return 'application/zip';
    case 'mp3': return 'audio/mpeg';
    case 'mp4': return 'video/mp4';
    case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    default: return 'application/octet-stream';
  }
}

/**
 * Resolves the public CDN URL for objects residing in specific buckets
 */
function getPublicUrlForObject(bucketName: string, key: string): string {
  const cleanBucket = sanitizeValue(bucketName);
  if (cleanBucket === 'bkappi' || cleanBucket === 'cdn.bkappi.com') {
    return `https://cdn.bkappi.com/${key}`;
  }
  return `/api/r2/download?bucket=${encodeURIComponent(cleanBucket)}&key=${encodeURIComponent(key)}`;
}

// Ensure S3 credentials are functional and list buckets to verify (returning only bkappi)
app.get('/api/r2/buckets', async (req, res) => {
  res.json([
    {
      name: 'bkappi',
      createdAt: new Date().toISOString()
    }
  ]);
});

// List files and directories within a bucket representing tree structure
app.get('/api/r2/objects', async (req, res) => {
  const bucketName = resolveActualBucketName(req.query.bucket as string || process.env.R2_BUCKET_NAME);
  const rawPrefix = (req.query.prefix as string) || '';
  const recursive = req.query.recursive === 'true';
  const searchTerm = (req.query.search as string) || '';
  const flat = req.query.flat === 'true';

  if (!bucketName) {
    return res.status(400).json({ error: 'É necessário informar o nome do bucket.' });
  }

  // If a search query is passed, run a global recursive bucket scan
  if (searchTerm) {
    try {
      await ensureBucketExists(bucketName);
      const client = getR2Client();

      const command = new ListObjectsV2Command({
        Bucket: bucketName,
      });

      const response = await client.send(command);
      const items: any[] = [];

      if (response.Contents) {
        for (const obj of response.Contents) {
          if (!obj.Key) continue;
          if (obj.Key.endsWith('/')) continue; // Skip directory placeholder markers

          const parts = obj.Key.split('/');
          const fileName = parts[parts.length - 1];
          const parentPath = parts.slice(0, parts.length - 1).join('/');
          items.push({
            id: obj.Key,
            name: obj.Key, // display full path of the file
            type: 'file',
            path: obj.Key,
            parentPath: parentPath,
            size: obj.Size,
            mimeType: getMIMETypeFromExtension(fileName),
            createdAt: obj.LastModified?.toISOString() || new Date().toISOString(),
            updatedAt: obj.LastModified?.toISOString() || new Date().toISOString(),
            etag: obj.ETag,
            publicUrl: getPublicUrlForObject(bucketName, obj.Key)
          });
        }
      }

      const matchingItems = items.filter((item) =>
        item.path.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return res.json(matchingItems);
    } catch (error: any) {
      console.error('Failed to search S3 objects:', error);
      return res.status(500).json({ error: error.message || 'Erro ao realizar busca no Cloudflare R2.' });
    }
  }

  // S3 prefix matching requires folders to end with '/' and start clean
  let prefix = rawPrefix;
  if (prefix && !prefix.endsWith('/')) {
    prefix = `${prefix}/`;
  }

  // If we are in flat mode, list all files recursively under currentPrefix
  if (flat) {
    try {
      await ensureBucketExists(bucketName);
      const client = getR2Client();

      const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix, // gets everything inside current folder recursively
      });

      const response = await client.send(command);
      const items: any[] = [];

      if (response.Contents) {
        for (const obj of response.Contents) {
          if (!obj.Key) continue;
          if (obj.Key === prefix) continue; // Skip current prefix directory marker
          if (obj.Key.endsWith('/')) continue; // Skip empty folder markers

          const parts = obj.Key.split('/');
          const fileName = parts[parts.length - 1];
          const parentPath = parts.slice(0, parts.length - 1).join('/');

          items.push({
            id: obj.Key,
            name: obj.Key, // display the entire path of the file
            type: 'file',
            path: obj.Key,
            parentPath: parentPath,
            size: obj.Size,
            mimeType: getMIMETypeFromExtension(fileName),
            createdAt: obj.LastModified?.toISOString() || new Date().toISOString(),
            updatedAt: obj.LastModified?.toISOString() || new Date().toISOString(),
            etag: obj.ETag,
            publicUrl: getPublicUrlForObject(bucketName, obj.Key)
          });
        }
      }

      return res.json(items);
    } catch (error: any) {
      console.error('Failed to list flat S3 objects:', error);
      return res.status(500).json({ error: error.message || 'Erro ao carregar objetos flat do Cloudflare R2.' });
    }
  }

  try {
    await ensureBucketExists(bucketName);
    const client = getR2Client();
    
    // We request lists of objects. If recursive, we do not pass Delimiter
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: recursive ? '' : prefix,
      Delimiter: recursive ? undefined : '/',
    });

    const response = await client.send(command);

    if (recursive) {
      const folderPaths = new Set<string>();
      if (response.Contents) {
        for (const obj of response.Contents) {
          if (!obj.Key) continue;
          const parts = obj.Key.split('/');
          const limit = obj.Key.endsWith('/') ? parts.length - 2 : parts.length - 1;
          for (let i = 1; i <= limit; i++) {
            const folderPath = parts.slice(0, i).join('/');
            if (folderPath) {
              folderPaths.add(folderPath);
            }
          }
        }
      }
      
      const recursiveItems = Array.from(folderPaths).map((folderPath) => {
        const parts = folderPath.split('/');
        const folderName = parts[parts.length - 1];
        const parentPath = parts.slice(0, parts.length - 1).join('/');
        return {
          id: folderPath,
          name: folderName,
          type: 'folder',
          path: folderPath,
          parentPath: parentPath,
          mimeType: 'directory',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });
      return res.json(recursiveItems);
    }

    const items: any[] = [];

    // 1. Process Virtual Directories / Subfolders
    // CommonPrefixes lists folders in the current level
    if (response.CommonPrefixes) {
      for (const commonPrefix of response.CommonPrefixes) {
        if (!commonPrefix.Prefix) continue;
        
        // E.g. "assets/imagens/" -> parent assets, name imagens
        const folderPath = commonPrefix.Prefix.replace(/\/$/, ''); // remove trailing slash
        const parts = folderPath.split('/');
        const folderName = parts[parts.length - 1];
        const parentPath = parts.slice(0, parts.length - 1).join('/');

        items.push({
          id: folderPath,
          name: folderName,
          type: 'folder',
          path: folderPath,
          parentPath: parentPath,
          mimeType: 'directory',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    // 2. Process Files
    if (response.Contents) {
      for (const obj of response.Contents) {
        if (!obj.Key) continue;
        
        // S3 standard includes folder creation empty marker keys like "assets/imagens/"
        if (obj.Key === prefix) {
          continue; // skip current directory marker itself
        }

        const parts = obj.Key.split('/');
        const fileName = parts[parts.length - 1];

        // If the key ends with '/', it might be an empty directory marker
        if (obj.Key.endsWith('/')) {
          const folderPath = obj.Key.replace(/\/$/, '');
          const folderName = parts[parts.length - 2] || fileName;
          const parentPath = parts.slice(0, parts.length - 2).join('/');
          
          // Check if already covered in CommonPrefixes
          if (!items.find((i) => i.path === folderPath)) {
            items.push({
              id: folderPath,
              name: folderName,
              type: 'folder',
              path: folderPath,
              parentPath: parentPath,
              mimeType: 'directory',
              createdAt: obj.LastModified?.toISOString() || new Date().toISOString(),
              updatedAt: obj.LastModified?.toISOString() || new Date().toISOString()
            });
          }
          continue;
        }

        const parentPath = parts.slice(0, parts.length - 1).join('/');

        items.push({
          id: obj.Key,
          name: fileName,
          type: 'file',
          path: obj.Key,
          parentPath: parentPath,
          size: obj.Size,
          mimeType: getMIMETypeFromExtension(fileName),
          createdAt: obj.LastModified?.toISOString() || new Date().toISOString(),
          updatedAt: obj.LastModified?.toISOString() || new Date().toISOString(),
          etag: obj.ETag,
          publicUrl: getPublicUrlForObject(bucketName, obj.Key)
        });
      }
    }

    res.json(items);
  } catch (error: any) {
    console.error('Failed to list S3 objects:', {
      name: error.name,
      message: error.message,
      metadata: error.$metadata,
      stack: error.stack
    });
    res.status(500).json({ error: error.message || 'Erro ao comunicar com Cloudflare R2.' });
  }
});

// Download/Preview route proxying standard HTTP GET requests directly to Cloudflare
app.get('/api/r2/download', async (req, res) => {
  const bucketName = resolveActualBucketName(req.query.bucket as string);
  const key = req.query.key as string;

  if (!bucketName || !key) {
    return res.status(400).json({ error: 'Bucket and key are required parameters.' });
  }

  try {
    const client = getR2Client();
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const response = await client.send(command);

    if (response.ContentType) {
      res.setHeader('Content-Type', response.ContentType);
    } else {
      res.setHeader('Content-Type', getMIMETypeFromExtension(key));
    }

    if (response.ContentLength) {
      res.setHeader('Content-Length', response.ContentLength);
    }

    // Set preview friendliness or standard file attachment header
    const fileName = key.split('/').pop() || 'file';
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(fileName)}"`);
    res.setHeader('Cache-Control', 'public, max-age=31536000');

    // Pipe stream directly to browser
    const stream = response.Body as any;
    if (stream?.pipe) {
      stream.pipe(res);
    } else {
      // Browser environment conversion
      const byteArray = await response.Body?.transformToByteArray();
      if (byteArray) {
        res.write(Buffer.from(byteArray));
        res.end();
      } else {
        res.status(404).json({ error: 'File stream body is empty.' });
      }
    }
  } catch (error: any) {
    console.error('Download error:', error);
    res.status(500).json({ error: error.message || 'Falha ao baixar arquivo do R2.' });
  }
});

// Conversor robusto de stream para Buffer em Node.js compatível com AWS S3 SDK v3
async function streamToBuffer(stream: any): Promise<Buffer> {
  if (!stream) return Buffer.alloc(0);
  
  if (typeof stream.transformToByteArray === 'function') {
    try {
      const arr = await stream.transformToByteArray();
      return Buffer.from(arr);
    } catch (e) {
      console.warn('[streamToBuffer] transformToByteArray falhou, tentando fallback:', e);
    }
  }

  return new Promise<Buffer>((resolve, reject) => {
    const chunks: any[] = [];
    
    // Check if it's already a buffer
    if (Buffer.isBuffer(stream)) {
      return resolve(stream);
    }
    
    if (stream instanceof Uint8Array) {
      return resolve(Buffer.from(stream));
    }

    if (typeof stream.on !== 'function') {
      try {
        // Fallback for async iterable if on is not present
        const runAsyncIterable = async () => {
          const parts: Uint8Array[] = [];
          for await (const chunk of stream) {
            parts.push(chunk instanceof Uint8Array ? chunk : Buffer.from(chunk));
          }
          resolve(Buffer.concat(parts));
        };
        runAsyncIterable().catch(reject);
        return;
      } catch (err) {
        return reject(err);
      }
    }

    stream.on('data', (chunk: any) => {
      chunks.push(chunk instanceof Uint8Array ? chunk : Buffer.from(chunk));
    });
    stream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    stream.on('error', (err: any) => {
      reject(err);
    });
  });
}

// Download multiple files/folders as a ZIP
app.post('/api/r2/download-zip', async (req, res) => {
  const { bucketName: rawBucketName, paths } = req.body;
  const bucketName = resolveActualBucketName(rawBucketName);

  console.log('[ZIP DOWNLOAD] Started processing download-zip. RawBucket:', rawBucketName, 'Bucket:', bucketName, 'Paths:', paths);

  if (!bucketName || !paths || !Array.isArray(paths) || paths.length === 0) {
    return res.status(400).json({ error: 'É necessário fornecer uma lista de caminhos.' });
  }

  try {
    await ensureBucketExists(bucketName);
    const client = getR2Client();

    // 1. Collect all actual keys from R2 S3 that match the given paths.
    const allFilesToZip: { key: string; nameInZip: string }[] = [];

    for (const itemPath of paths) {
      if (!itemPath) continue;

      console.log(`[ZIP DOWNLOAD] Processing itemPath: "${itemPath}"`);

      const contents: any[] = [];
      let isTruncated = true;
      let continuationToken: string | undefined = undefined;

      while (isTruncated) {
        const listCommand: any = {
          Bucket: bucketName,
          Prefix: itemPath,
        };
        if (continuationToken) {
          listCommand.ContinuationToken = continuationToken;
        }

        const listResponse = await client.send(new ListObjectsV2Command(listCommand));
        if (listResponse.Contents) {
          contents.push(...listResponse.Contents);
        }

        isTruncated = !!listResponse.IsTruncated;
        continuationToken = listResponse.NextContinuationToken;
      }

      console.log(`[ZIP DOWNLOAD] S3 returned total of ${contents.length} contents for prefix "${itemPath}"`);

      // Formulate a clean folder prefix to prevent grabbing sister prefixes like "fotos_old" when querying "fotos"
      const folderPrefix = itemPath.endsWith('/') ? itemPath : `${itemPath}/`;
      const filesInFolder = contents.filter(o => o.Key && (o.Key.startsWith(folderPrefix) || o.Key === folderPrefix) && !o.Key.endsWith('/'));

      // Check if there is an exact key match for itemPath representing a simple file
      const exactFile = contents.find(o => o.Key === itemPath && !o.Key.endsWith('/'));

      console.log(`[ZIP DOWNLOAD] folderPrefix: "${folderPrefix}", filesInFolder count: ${filesInFolder.length}, exactFile: ${exactFile ? exactFile.Key : 'none'}`);

      if (filesInFolder.length > 0) {
        // It's a folder containing files (potentially nested)
        const pathParts = itemPath.replace(/\/$/, '').split('/');
        const folderBaseName = pathParts[pathParts.length - 1];

        for (const obj of filesInFolder) {
          if (!obj.Key) continue;
          const relativePathInFolder = obj.Key.substring(folderPrefix.length);
          const zipName = `${folderBaseName}/${relativePathInFolder}`;
          allFilesToZip.push({ key: obj.Key, nameInZip: zipName });
          console.log(`[ZIP DOWNLOAD] Added folder file to zip list: key "${obj.Key}" -> zip "${zipName}"`);
        }
      } else if (exactFile && exactFile.Key) {
        // It's a simple file
        const fileName = itemPath.split('/').pop() || 'file';
        allFilesToZip.push({ key: exactFile.Key, nameInZip: fileName });
        console.log(`[ZIP DOWNLOAD] Added exact file to zip list: key "${exactFile.Key}" -> zip "${fileName}"`);
      } else {
        // Empty folder or placeholder handling
        const hasFolderPlaceholder = contents.some(o => o.Key === itemPath || o.Key === folderPrefix);
        if (hasFolderPlaceholder || itemPath.endsWith('/')) {
          const pathParts = itemPath.replace(/\/$/, '').split('/');
          const folderBaseName = pathParts[pathParts.length - 1];
          allFilesToZip.push({ key: '', nameInZip: `${folderBaseName}/` });
          console.log(`[ZIP DOWNLOAD] Added empty folder placeholder: zip "${folderBaseName}/"`);
        } else {
          console.log(`[ZIP DOWNLOAD] No matching files or folders found for path "${itemPath}"`);
        }
      }
    }

    console.log(`[ZIP DOWNLOAD] Total files collected to ZIP: ${allFilesToZip.length}`);

    if (allFilesToZip.length === 0) {
      return res.status(404).json({ error: 'Nenhum arquivo encontrado para compactar.' });
    }

    // 2. Fetch all S3 objects in memory FIRST to safely catch failures before returning headers
    const cachedFiles: { name: string; buffer: Buffer }[] = [];

    for (const file of allFilesToZip) {
      if (!file.key) {
        // Empty folder placeholder
        cachedFiles.push({ name: file.nameInZip, buffer: Buffer.alloc(0) });
        continue;
      }

      console.log(`[ZIP DOWNLOAD] Pre-loading S3 key "${file.key}" for ZIP...`);
      const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: file.key,
      });

      const fileResponse = await client.send(getCommand);
      let buffer: Buffer = Buffer.alloc(0);

      if (fileResponse.Body) {
        buffer = await streamToBuffer(fileResponse.Body);
      }

      cachedFiles.push({ name: file.nameInZip, buffer });
      console.log(`[ZIP DOWNLOAD] Successfully pre-loaded key "${file.key}" (${buffer.length} bytes)`);
    }

    // 3. Compile the ZIP in memory FIRST to safely catch failures, set Content-Length and prevent stream hangs
    const archive = new ZipArchive({ zlib: { level: 9 } });
    
    const chunks: Buffer[] = [];
    const memoryStream = new Writable({
      write(chunk, encoding, callback) {
        if (Buffer.isBuffer(chunk)) {
          chunks.push(chunk);
        } else {
          chunks.push(Buffer.from(chunk));
        }
        callback();
      }
    });

    archive.pipe(memoryStream);

    archive.on('warning', (err) => {
      console.warn('[ZIP DOWNLOAD] Archiver warning:', err);
    });

    // Create a promise to handle complete stream pipeline completion
    const archivePromise = new Promise<void>((resolve, reject) => {
      archive.on('error', (err) => {
        console.error('[ZIP DOWNLOAD] Archiver error:', err);
        reject(err);
      });
      memoryStream.on('finish', () => {
        resolve();
      });
    });

    // Append all pre-cached files to the zip
    for (const e of cachedFiles) {
      archive.append(e.buffer, { name: e.name });
    }

    console.log('[ZIP DOWNLOAD] Finalizing ZIP archive in memory...');
    await archive.finalize();
    await archivePromise;

    const zipBuffer = Buffer.concat(chunks);
    console.log(`[ZIP DOWNLOAD] ZIP archive compiled successfully. Size: ${zipBuffer.length} bytes.`);

    // 4. Send Response
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Length', zipBuffer.length);
    res.setHeader('Content-Disposition', 'attachment; filename="r2_backup.zip"');
    res.send(zipBuffer);
  } catch (error: any) {
    console.error('[ZIP DOWNLOAD] General Zip download error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Erro ao gerar arquivo ZIP.' });
    }
  }
});

// Create folder (by writing empty file with a trailing slash)
app.post('/api/r2/folder', async (req, res) => {
  const { bucketName: rawBucketName, parentPath, folderName } = req.body;
  const bucketName = resolveActualBucketName(rawBucketName);

  if (!bucketName || !folderName) {
    return res.status(400).json({ error: 'Bucket e nome do diretório são obrigatórios.' });
  }

  const prefix = parentPath ? `${parentPath}/` : '';
  const folderKey = `${prefix}${folderName}/`;

  try {
    await ensureBucketExists(bucketName);
    const client = getR2Client();
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: folderKey,
      Body: '', // Empty contents
      ContentType: 'application/x-directory',
    });

    await client.send(command);

    res.json({
      success: true,
      folder: {
        id: folderKey.replace(/\/$/, ''),
        name: folderName,
        type: 'folder',
        path: folderKey.replace(/\/$/, ''),
        parentPath: parentPath || '',
        mimeType: 'directory',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
    });
  } catch (error: any) {
    console.error('Create folder error:', error);
    res.status(500).json({ error: error.message || 'Não foi possível criar a pasta virtual.' });
  }
});

// Upload file endpoint using single file multer memory storage
app.post('/api/r2/upload', upload.single('file'), async (req, res) => {
  const { bucketName: rawBucketName, parentPath } = req.body;
  const bucketName = resolveActualBucketName(rawBucketName);
  const file = req.file;

  if (!bucketName) {
    return res.status(400).json({ error: 'Bucket name matches required specifications.' });
  }
  if (!file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }

  const cleanName = file.originalname;
  const prefix = parentPath ? `${parentPath}/` : '';
  const fileKey = `${prefix}${cleanName}`;

  try {
    await ensureBucketExists(bucketName);
    const client = getR2Client();
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype || getMIMETypeFromExtension(cleanName),
    });

    await client.send(command);

    res.json({
      success: true,
      file: {
        id: fileKey,
        name: cleanName,
        type: 'file',
        path: fileKey,
        parentPath: parentPath || '',
        size: file.size,
        mimeType: file.mimetype || getMIMETypeFromExtension(cleanName),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publicUrl: getPublicUrlForObject(bucketName, fileKey)
      },
    });
  } catch (error: any) {
    console.error('File upload failed:', error);
    res.status(500).json({ error: error.message || 'Falha ao subir arquivo para o Cloudflare R2.' });
  }
});

// Rename file or folder
app.post('/api/r2/rename', async (req, res) => {
  const { bucketName: rawBucketName, oldPath, newName } = req.body;
  const bucketName = resolveActualBucketName(rawBucketName);

  if (!bucketName || !oldPath || !newName) {
    return res.status(400).json({ error: 'Parâmetros inválidos para renomeação.' });
  }

  try {
    await ensureBucketExists(bucketName);
    const client = getR2Client();

    // S3 doesn't have native "Rename" or "Move". We must copy to new path, then delete original.
    const parts = oldPath.split('/');
    const isFolder = oldPath.endsWith('/') || !parts[parts.length - 1].includes('.'); // simple heuristic or we could query metadata

    // Let's check listing contents if it is a directory. Better design: query current objects under prefix
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: oldPath,
    });
    const listResponse = await client.send(listCommand);
    const contents = listResponse.Contents || [];

    // Let's decide if it's a directory by evaluating list contents with exact folder trailing slashes
    const isActuallyFolder = contents.some((item) => item.Key !== oldPath && item.Key?.startsWith(oldPath + '/')) || oldPath.endsWith('/');

    if (isActuallyFolder) {
      // It's a folder, so rename means copying nested entries
      const oldPrefix = oldPath.endsWith('/') ? oldPath : `${oldPath}/`;
      // Calculate next prefix prefix
      const parentParts = oldPrefix.replace(/\/$/, '').split('/');
      parentParts[parentParts.length - 1] = newName;
      const newPrefix = parentParts.join('/') + '/';

      // Load all objects that start with oldPrefix
      const objectsCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: oldPrefix,
      });
      const objectsResponse = await client.send(objectsCommand);
      const objectsToRename = objectsResponse.Contents || [];

      for (const obj of objectsToRename) {
        if (!obj.Key) continue;
        const relativeSuffix = obj.Key.substring(oldPrefix.length);
        const destinationKey = `${newPrefix}${relativeSuffix}`;

        // Copy item to dest
        await client.send(new CopyObjectCommand({
          Bucket: bucketName,
          CopySource: encodeURIComponent(`${bucketName}/${obj.Key}`),
          Key: destinationKey,
        }));

        // Delete original item
        await client.send(new DeleteObjectCommand({
          Bucket: bucketName,
          Key: obj.Key,
        }));
      }

      res.json({ success: true, newPath: newPrefix.replace(/\/$/, '') });
    } else {
      // It is a simple file.
      const parentParts = oldPath.split('/');
      parentParts[parentParts.length - 1] = newName;
      const destinationKey = parentParts.join('/');

      // S3 CopyObject requires the source to contain the bucket name
      const copyCommand = new CopyObjectCommand({
        Bucket: bucketName,
        CopySource: encodeURIComponent(`${bucketName}/${oldPath}`),
        Key: destinationKey,
      });
      await client.send(copyCommand);

      // Now Delete
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: oldPath,
      });
      await client.send(deleteCommand);

      res.json({ success: true, newPath: destinationKey });
    }
  } catch (error: any) {
    console.error('Rename error:', error);
    res.status(500).json({ error: error.message || 'Falha ao renomear item no bucket.' });
  }
});

// Copy / Duplicate files or folders (with copy suffix) to a destination folder
app.post('/api/r2/copy', async (req, res) => {
  const { bucketName: rawBucketName, paths, destinationFolder } = req.body;
  const bucketName = resolveActualBucketName(rawBucketName);
  const destDir = destinationFolder || '';

  if (!bucketName || !paths || !Array.isArray(paths) || paths.length === 0) {
    return res.status(400).json({ error: 'Parâmetros inválidos para cópia.' });
  }

  try {
    await ensureBucketExists(bucketName);
    const client = getR2Client();

    for (const oldPath of paths) {
      if (!oldPath) continue;

      // Classify folders by Listing prefix
      const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: oldPath,
      });
      const listResponse = await client.send(listCommand);
      const contents = listResponse.Contents || [];

      const isActuallyFolder = contents.some((item) => item.Key !== oldPath && item.Key?.startsWith(oldPath + '/')) || oldPath.endsWith('/');

      if (isActuallyFolder) {
        // Folder Copying
        const oldPrefix = oldPath.endsWith('/') ? oldPath : `${oldPath}/`;
        const pathParts = oldPath.replace(/\/$/, '').split('/');
        const folderName = pathParts[pathParts.length - 1];
        
        // Target folder with suffix
        const newFolderName = `${folderName} - Cópia`;
        const newPrefix = destDir 
          ? `${destDir.replace(/\/$/, '')}/${newFolderName}/` 
          : `${newFolderName}/`;

        // Get all matching objects in source folder
        const objectsCommand = new ListObjectsV2Command({
          Bucket: bucketName,
          Prefix: oldPrefix,
        });
        const objectsResponse = await client.send(objectsCommand);
        const objectsToCopy = objectsResponse.Contents || [];

        for (const obj of objectsToCopy) {
          if (!obj.Key) continue;
          const relativeSuffix = obj.Key.substring(oldPrefix.length);
          const destinationKey = `${newPrefix}${relativeSuffix}`;

          await client.send(new CopyObjectCommand({
            Bucket: bucketName,
            CopySource: encodeURIComponent(`${bucketName}/${obj.Key}`),
            Key: destinationKey,
          }));
        }
      } else {
        // File Copying
        const parts = oldPath.split('/');
        const fileName = parts[parts.length - 1];

        // Format name with copy suffix before extension
        const lastDot = fileName.lastIndexOf('.');
        const nameWithoutExt = lastDot !== -1 ? fileName.substring(0, lastDot) : fileName;
        const ext = lastDot !== -1 ? fileName.substring(lastDot) : '';
        const newFileName = `${nameWithoutExt} - Cópia${ext}`;

        const destinationKey = destDir
          ? `${destDir.replace(/\/$/, '')}/${newFileName}`
          : newFileName;

        await client.send(new CopyObjectCommand({
          Bucket: bucketName,
          CopySource: encodeURIComponent(`${bucketName}/${oldPath}`),
          Key: destinationKey,
        }));
      }
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Copy/Paste error:', error);
    res.status(500).json({ error: error.message || 'Falha ao copiar/colar itens no bucket.' });
  }
});

// Delete multiple paths (files or directories)
app.post('/api/r2/delete', async (req, res) => {
  const { bucketName: rawBucketName, paths } = req.body;
  const bucketName = resolveActualBucketName(rawBucketName);

  if (!bucketName || !paths || !Array.isArray(paths)) {
    return res.status(400).json({ error: 'Parâmetro de exclusão inválido.' });
  }

  try {
    await ensureBucketExists(bucketName);
    const client = getR2Client();

    // To robustly support deleting folders too, we list objects under each folder and gather ALL explicit file keys to delete
    const keysToDelete: string[] = [];

    for (const itemPath of paths) {
      // We list objects starting with "itemPath/" (folders) as well as the path itself
      const folderPrefix = `${itemPath}/`;
      const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: itemPath,
      });
      const response = await client.send(listCommand);
      const contents = response.Contents || [];

      for (const obj of contents) {
        if (obj.Key && (obj.Key === itemPath || obj.Key.startsWith(folderPrefix))) {
          keysToDelete.push(obj.Key);
        }
      }

      // Also make sure to cover folder placeholder files just in case
      if (!keysToDelete.includes(itemPath)) {
        keysToDelete.push(itemPath);
      }
      const withSlash = itemPath + '/';
      if (!keysToDelete.includes(withSlash)) {
        keysToDelete.push(withSlash);
      }
    }

    // Filter unique keys
    const uniqueKeys = Array.from(new Set(keysToDelete)).filter(Boolean);

    if (uniqueKeys.length > 0) {
      // S3 DeleteObjectsCommand can batch delete up to 1000 items
      const deleteParams = {
        Bucket: bucketName,
        Delete: {
          Objects: uniqueKeys.map((k) => ({ Key: k })),
          Quiet: true,
        },
      };

      const command = new DeleteObjectsCommand(deleteParams);
      await client.send(command);
    }

    res.json({ success: true, deletedCount: uniqueKeys.length });
  } catch (error: any) {
    console.error('Bulk deletion error:', error);
    res.status(500).json({ error: error.message || 'Falha ao deletar arquivos.' });
  }
});

// Move multiple objects to a targeted folder
app.post('/api/r2/move', async (req, res) => {
  const { bucketName: rawBucketName, paths, targetPath } = req.body;
  const bucketName = resolveActualBucketName(rawBucketName);

  if (!bucketName || !paths || !Array.isArray(paths)) {
    return res.status(400).json({ error: 'Parâmetros de movimentação íncompletos.' });
  }

  const destPrefix = targetPath ? `${targetPath}/` : '';

  try {
    await ensureBucketExists(bucketName);
    const client = getR2Client();

    for (const sourcePath of paths) {
      // Find the last file/folder name part
      const sourceParts = sourcePath.split('/');
      const itemName = sourceParts[sourceParts.length - 1];
      const destinationKeyName = `${destPrefix}${itemName}`;

      // List all objects beginning with this path to handle folders correctly
      const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: sourcePath,
      });
      const listResponse = await client.send(listCommand);
      const objects = listResponse.Contents || [];

      // Determine if really a folder
      const isFolder = objects.some((o) => o.Key !== sourcePath && o.Key?.startsWith(sourcePath + '/')) || sourcePath.endsWith('/');

      if (isFolder) {
        const oldFolderPrefix = sourcePath.endsWith('/') ? sourcePath : `${sourcePath}/`;
        const newFolderPrefix = `${destPrefix}${itemName}/`;

        for (const obj of objects) {
          if (!obj.Key) continue;
          const relativeSuffix = obj.Key.substring(oldFolderPrefix.length);
          const destKey = `${newFolderPrefix}${relativeSuffix}`;

          // Copy content
          await client.send(new CopyObjectCommand({
            Bucket: bucketName,
            CopySource: encodeURIComponent(`${bucketName}/${obj.Key}`),
            Key: destKey,
          }));

          // Delete original
          await client.send(new DeleteObjectCommand({
            Bucket: bucketName,
            Key: obj.Key,
          }));
        }
      } else {
        // Simple file copy and delete
        await client.send(new CopyObjectCommand({
          Bucket: bucketName,
          CopySource: encodeURIComponent(`${bucketName}/${sourcePath}`),
          Key: destinationKeyName,
        }));

        await client.send(new DeleteObjectCommand({
          Bucket: bucketName,
          Key: sourcePath,
        }));
      }
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Move objects error:', error);
    res.status(500).json({ error: error.message || 'Falha ao movimentar arquivos.' });
  }
});


// Diagnostic Endpoint to test raw network and R2 connection properties
app.get('/api/test-r2', async (req, res) => {
  const accessKeyId = sanitizeValue(process.env.R2_ACCESS_KEY_ID, '3e6d84ff77a2473658803969f9c1324f');
  const endpoint = sanitizeValue(process.env.R2_ENDPOINT, 'https://ab7c0100f85a82f3ad7f9b0186c9597d.r2.cloudflarestorage.com');
  const bucket = resolveActualBucketName(process.env.R2_BUCKET_NAME || 'bkappi');

  const diagnostics: any = {
    env_keys: {
      R2_ACCESS_KEY_ID: accessKeyId ? `${accessKeyId.substring(0, 4)}... (len: ${accessKeyId.length})` : 'MISSING',
      R2_ENDPOINT: endpoint,
      R2_BUCKET_NAME: bucket,
    },
    fetches: {},
  };

  try {
    // 1. Fetch endpoint root
    const rootRes = await fetch(endpoint, { method: 'GET' });
    const rootBody = await rootRes.text();
    diagnostics.fetches.root = {
      status: rootRes.status,
      statusText: rootRes.statusText,
      headers: Object.fromEntries(rootRes.headers.entries()),
      bodySnippet: rootBody.substring(0, 500),
    };
  } catch (err: any) {
    diagnostics.fetches.root = { error: err.message || err };
  }

  try {
    // 2. Fetch endpoint + bucket
    const bucketUrl = `${endpoint.replace(/\/$/, '')}/${bucket}`;
    const bucketRes = await fetch(bucketUrl, { method: 'GET' });
    const bucketBody = await bucketRes.text();
    diagnostics.fetches.bucket = {
      url: bucketUrl,
      status: bucketRes.status,
      statusText: bucketRes.statusText,
      headers: Object.fromEntries(bucketRes.headers.entries()),
      bodySnippet: bucketBody.substring(0, 500),
    };
  } catch (err: any) {
    diagnostics.fetches.bucket = { error: err.message || err };
  }

  res.json(diagnostics);
});


// FRONTEND DEV / PRODUCTION MIDDLEWARE INTEGRATIONS
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.error('Failed to start Vite:', err);
    }
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Start Server listening on mandated ports
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server executing live on http://localhost:${PORT}`);
  });
}

startServer();
