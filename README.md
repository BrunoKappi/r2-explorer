# 📂 R2 Explorer — Cloudflare R2 Storage Manager

A robust, modern, and complete **full-stack platform** for managing, visualizing, and performing deep operations on your **Cloudflare R2** storage buckets. Built with React 19, TypeScript, Express.js, and AWS SDK v3.

> **Free and open-source** — Apache 2.0 License

---

## 📷 Screenshots

### Folder View (Dark Theme)

![R2 Explorer — Folder View Dark](https://cdn.bkappi.com/ProjectsAssets/R2-Explorer/GithubReadmeAssets/FoldersViewDark.png)

### Bucket Statistics

![R2 Explorer — Statistics View](https://cdn.bkappi.com/ProjectsAssets/R2-Explorer/GithubReadmeAssets/StatisticsView.png)

---

## ✨ Features

### 🌍 Full Internationalization (i18n)
- **5 languages** supported out of the box:
  - 🇺🇸 English (default fallback)
  - 🇧🇷 Português (pt-BR)
  - 🇪🇸 Español
  - 🇩🇪 Deutsch
  - 🇫🇷 Français
- **Automatic browser language detection** via `i18next-browser-languagedetector`
- On-the-fly language switching via the globe popover in the toolbar
- Every label, button, modal, toast, and dialog is fully translated

---

### 🚀 Recursive File & Folder Uploads
- **External Drag & Drop**: Drag entire folders from Windows Explorer or macOS Finder directly onto the file explorer window
- Recursively processes all nested sub-folders, recreating the exact directory tree structure in Cloudflare R2
- **Floating Upload Progress Panel**: Real-time progress tracking with:
  - Per-file upload status
  - Completed / failed / queued counters
  - Estimated transfer speed indicator
  - Error retry support
  - Minimize/expand controls

---

### 🔄 Internal Drag & Drop (Reorganize in Bucket)
- Move files and folders by dragging rows and dropping onto target folder rows within the explorer
- Strictly separated from OS file-drop events — no interference or visual overlap
- Visual drop target highlighting during drag operations

---

### 📦 Bulk Actions
- **Multi-selection** via Ctrl+Click, Shift+Click, Cmd+Click
- **Marquee selection box**: Click-drag on empty area to lasso-select multiple items
- **Batch operation bar** that appears when items are selected:
  - **Download as ZIP**: Server-side streaming ZIP archive of any combination of files and folders
  - **Mass Move**: Move all selected items to any directory
  - **Mass Delete**: Delete multiple items simultaneously with a single confirmation
  - **Copy Paths**: Copy all selected CDN/storage paths to clipboard
  - Estimated raw size and estimated ZIP payload size indicators

---

### 👁️ 6 View Layout Modes
Switch between six distinct display modes via the **View Layout** dropdown:
| Mode | Description |
|---|---|
| **Details** | Traditional list view with columns (name, type, size, modified date) |
| **Small Icons** | Compact grid with small icons |
| **Medium Icons** | Medium-sized icon grid |
| **Large Icons** | Large icon grid cards |
| **Extra-Large Icons** | Maximum-size icon grid |
| **Mosaic** | Image-first masonry/mosaic layout with thumbnail previews |

---

### 🖱️ Right-Click Context Menu
Right-click any file, folder, or empty area for a context-aware menu:
- **Open** — Navigate into folder or view file details
- **Create Subfolder** — Create a virtual sub-directory inside the selected folder
- **Rename** — Rename virtual path/filename with an inline input field
- **Move** — Open advanced move modal with searchable folder tree
- **Copy Path** — Copy the CDN/public URL to clipboard
- **Share Link** — Copy the direct CDN public link
- **Download File** — Direct file download
- **Download Folder (.zip)** — Download entire folder as ZIP
- **Properties** — Open the object details modal with metadata
- **Delete** — Permanent deletion with confirmation dialog
- **New Folder** — Create a new folder in the current directory (empty area)
- **Upload File / Upload Folder** — Trigger upload dialogs (empty area)
- **Refresh** — Refetch current directory listing

---

### 🔍 Search & Navigation
- **Global search**: Searches the entire bucket (not just current directory) via a full-scan query
- **Debounced local filter**: Reactive filtering as you type in the local search bar
- **Interactive breadcrumbs**: Click any segment in the breadcrumb trail to navigate directly to that directory
- **Search results navigation**: Click a search result to jump to its parent directory

---

### 📊 Bucket Statistics
A comprehensive statistics modal accessible from the toolbar:
- Bucket name display
- **Total file count** (recursive)
- **Total folder count** (recursive)
- **Cumulative storage size** with a visual progress bar (relative to 10 GB reference)
- Storage percentage used
- Real-time calculation

---

### 🗂️ Object Properties & Metadata
Inspect full metadata for any file or folder via the Properties dialog:
- **File/Object path** (full S3 key)
- **MIME type** (auto-detected from extension)
- **MD5 hash** (ETag from S3)
- **Creation date** (localized to current language)
- **Last modified date** (localized)
- **Inline image preview** for image files
- **Inline video player** for video files
- **Custom Cloudflare metadata tags** (key/value pairs from R2 object metadata)
- **Copy CDN URL** button

---

### 🔑 Keyboard Shortcuts
Native OS-like keyboard navigation:
| Shortcut | Action |
|---|---|
| `Ctrl+A` / `Cmd+A` | Select all visible items |
| `Ctrl+C` / `Cmd+C` | Copy selected paths to clipboard |
| `Ctrl+V` / `Cmd+V` | Paste (duplicate) copied items |
| `Delete` | Delete selected items |
| `F2` | Rename selected item (single selection) |
| `Enter` | Open folder or view file properties |

---

### 🌓 Light / Dark Theme
- Detects browser `prefers-color-scheme` preference automatically
- Manual toggle via the sun/moon button in the toolbar
- Smooth transitions with low-brightness dark skeletons to eliminate flickering
- Full high-contrast support in both modes
- Persisted preference across sessions

---

### 📁 Prefix Mode Toggle
- **Folder mode** (default): Uses S3 `delimiter: '/'` to present a virtual folder tree — objects are grouped into navigable folders
- **Flat mode**: Lists all S3 object keys recursively without any grouping — shows raw prefix paths as-is
- Toggle via the "View prefixes as folders" checkbox in the toolbar

---

### 🔒 Password Protection & Security
- A configurable **access password** protects the entire interface
- Password is stored in `localStorage` to persist sessions
- All R2 API credentials (`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`) are **strictly server-side** — never exposed to the browser
- Configurable **CORS origins** via `ALLOWED_ORIGINS` environment variable
- Password verification happens server-side via the `X-Access-Password` header

---

### 🪄 Additional UX Details
- **Marquee selection box**: Visual lasso selection when clicking and dragging on empty space
- **Toast notifications**: Non-intrusive success/error toast messages for all operations
- **Animated loading states**: Skeleton loaders and spinners for all async operations
- **Empty state placeholders**: Contextual empty states for empty directories and empty search results
- **Immersive drag overlay**: Translucent backdrop with animated upload icon when dragging files over the window
- **Auto-create bucket**: The application auto-creates the configured bucket if it doesn't exist on first load
- **Smart MIME detection**: Server-side MIME type detection from file extension for 20+ common types

---

## ⚙️ Environment Variables

Create a **`.env`** file in the **project root** and a separate **`backend/.env`** if running the backend independently.

| Variable | Required | Description |
|---|---|---|
| `R2_ACCESS_KEY_ID` | ✅ | Your Cloudflare R2 API Token Access Key ID |
| `R2_SECRET_ACCESS_KEY` | ✅ | Your Cloudflare R2 API Token Secret Access Key |
| `R2_ENDPOINT` | ✅ | Your Cloudflare R2 S3 endpoint URL: `https://ACCOUNT_ID.r2.cloudflarestorage.com` |
| `R2_BUCKET_NAME` | ✅ | The exact name of the R2 bucket to manage |
| `ACCESS_PASSWORD` | ✅ | Password to protect the dashboard |
| `ALLOWED_ORIGINS` | ✅ | Comma-separated list of allowed CORS origins |
| `VITE_API_URL` | ⚙️ | Public URL of the backend API (used for Netlify/Vercel redirects) |
| `R2_CUSTOM_DOMAIN` | ⚙️ | Optional custom domain for CDN public URLs |

### Getting Your Cloudflare R2 Credentials

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2** in the left sidebar
3. Click **"Manage R2 API Tokens"** → **"Create API Token"**
4. Select **Object Read & Write** permissions for your bucket
5. Copy the **Access Key ID** and **Secret Access Key** (shown only once)
6. Your **endpoint** format: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
   - Find your Account ID in the Cloudflare dashboard right sidebar

### Example `.env` File

```env
# Cloudflare R2 Credentials
R2_ACCESS_KEY_ID="your_access_key_id_here"
R2_SECRET_ACCESS_KEY="your_secret_access_key_here"
R2_ENDPOINT="https://abc123def456.r2.cloudflarestorage.com"
R2_BUCKET_NAME="my-bucket"

# Access Control
ACCESS_PASSWORD="your_strong_password_here"
ALLOWED_ORIGINS="https://my-app.netlify.app,http://localhost:5173,http://localhost:3000"

# Optional: Custom CDN domain for public file URLs
R2_CUSTOM_DOMAIN="cdn.example.com"

# Optional: Backend API URL (for separate frontend/backend deployments)
VITE_API_URL="https://my-backend.vercel.app"
```

> ⚠️ **Never commit `.env` files to version control.** The `.gitignore` is pre-configured to exclude `.env` and `.env.production`.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- A **Cloudflare account** with R2 enabled
- Your R2 API credentials (see above)

### 1. Clone the Repository

```bash
git clone https://github.com/BrunoKappi/r2-explorer.git
cd r2-explorer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Then edit .env with your credentials
```

### 4. Run in Development Mode

```bash
npm run dev
```

This starts both the **Express backend** (port 3080) and the **Vite frontend** (port 5173) concurrently via a dev runner script. Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
```

Generates optimized bundles in `dist/`. The `generate-redirects.js` script also runs to create the Netlify `_redirects` file.

### 6. Start Production Server

After building, serve the application:

```bash
npm run start
```

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Starts frontend + backend concurrently in development mode |
| `npm run dev:frontend` | Starts only the Vite frontend dev server |
| `npm run dev:backend` | Starts only the Express backend with `tsx` hot-reload |
| `npm run build` | Builds frontend (Vite) and generates redirect rules |
| `npm run start` | Starts the production Express server (requires `npm run build` first) |
| `npm run lint` | TypeScript type-check without emitting files (`tsc --noEmit`) |
| `npm run clean` | Removes the `dist/` directory |

---

## 📁 Project Structure

```
r2-explorer/
├── backend/
│   ├── api/
│   │   └── index.ts          # Express server — all API routes
│   └── package.json
├── src/
│   ├── components/
│   │   ├── file-explorer/    # Header, Table, Status subcomponents
│   │   ├── BatchActionBar.tsx # Multi-select action bar
│   │   ├── ContextMenu.tsx    # Right-click context menu
│   │   ├── FileExplorer.tsx   # Main explorer shell
│   │   ├── FileGridCard.tsx   # Icon grid card component
│   │   ├── FileRow.tsx        # Table row component
│   │   └── SearchModal.tsx    # Global search overlay
│   ├── features/
│   │   ├── bucket-navigation/ # Breadcrumbs component
│   │   ├── file-operations/   # Rename, Move, Delete, Details, Create Folder, Stats modals
│   │   └── uploads/           # Upload modal + floating progress popup
│   ├── hooks/
│   │   ├── useFileExplorer.ts   # Core data + actions hook
│   │   ├── useFolderDragAndDrop.ts # OS drag-drop handler
│   │   └── useKeyboardShortcuts.ts # Keyboard shortcut bindings
│   ├── i18n/
│   │   ├── config.ts          # i18next configuration
│   │   └── translations.ts    # All language translations (EN, PT-BR, ES, DE, FR)
│   ├── services/
│   │   └── r2Service.ts       # API client (all HTTP calls to backend)
│   ├── stores/
│   │   └── navigationStore.ts # Zustand store (path, selection, theme, dialogs)
│   ├── types.ts               # TypeScript interfaces (R2Item, etc.)
│   └── utils/
│       └── fileUtils.ts       # File size formatting, URL helpers
├── .env.example               # Environment variable template
├── landing-page/              # Static landing page (HTML/CSS/JS)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🏗️ Technical Architecture

### Frontend Stack
- **React 19** with functional components and hooks throughout
- **Zustand** for global UI state (current path, selected items, active bucket, theme, open dialogs)
- **TanStack Query (React Query v5)** for:
  - Server state caching and synchronization
  - Optimistic cache invalidation after mutations (upload, delete, rename, move)
  - Automatic refetch triggers
  - 5-minute cache stale time to minimize redundant requests
- **i18next + react-i18next** with `i18next-browser-languagedetector` for automatic locale detection
- **Motion (Framer Motion)** for animated batch action bar and search modal transitions
- **Tailwind CSS v4** for styling with precision dark/light mode support
- **Lucide React** for consistent iconography

### Backend Stack
- **Express.js** REST API server with:
  - CORS middleware with configurable origins
  - `express.json` body parsing up to 50MB
  - `multer` with in-memory storage for file uploads up to 100MB per file
  - **Password authentication** via `X-Access-Password` request header
- **AWS SDK v3 (`@aws-sdk/client-s3`)** for all S3-compatible Cloudflare R2 operations:
  - `ListBucketsCommand`, `ListObjectsV2Command`
  - `PutObjectCommand`, `DeleteObjectCommand`, `DeleteObjectsCommand`
  - `CopyObjectCommand`, `GetObjectCommand`, `CreateBucketCommand`
- **Archiver** for server-side streaming ZIP generation
- **esbuild** for bundling the TypeScript backend into a single optimized CJS bundle

### Key Design Patterns
- **Lazy S3 client initialization**: The R2 client is created on-demand and cached with a composite key — reinitializing only when credentials change
- **Bucket auto-creation**: On first API call, the system verifies the configured bucket exists and creates it if not
- **Virtual folders via S3 prefix/delimiter**: Folders don't exist as real S3 objects — they're simulated using the `delimiter: '/'` S3 API parameter
- **Optimistic updates**: Mutations immediately invalidate the affected React Query cache keys, providing instant UI feedback without waiting for refetches

---

## ☁️ Deployment

### Netlify (Frontend) + Any Backend Host

1. Build the project: `npm run build`
2. The build script generates a `_redirects` file in `dist/` pointing API calls to your `VITE_API_URL`
3. Deploy the `dist/` folder to Netlify
4. Deploy the `backend/` folder separately (e.g., Railway, Render, Heroku, VPS)

### Vercel

You can deploy the backend to Vercel using the included `backend/vercel.json`.

> ⚠️ **Vercel Limitation**: Vercel Serverless Functions have a **request body size limit of 4.5 MB** (Hobby plan) or up to **50 MB** (Pro plan). This means **file uploads larger than 4.5 MB will fail** when the backend is hosted on Vercel Free tier. For large file uploads, use a different backend host (Railway, Render, VPS, or self-hosted).

### Self-Hosted / VPS

```bash
# Clone and build
git clone https://github.com/BrunoKappi/r2-explorer.git
cd r2-explorer
npm install
npm run build

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Start production server
npm run start
# Server runs at http://0.0.0.0:3080
```

Use nginx or Caddy as a reverse proxy to expose it on port 80/443 with SSL.

---

## ⚠️ Limitations

| Limitation | Details |
|---|---|
| **Single bucket per instance** | Each deployment instance manages one configured bucket (`R2_BUCKET_NAME`). To manage multiple buckets, deploy separate instances. |
| **100 MB per file upload** | The Express backend's `multer` is configured with a `100 MB` per-file memory limit. Uploading files larger than this will fail. |
| **Vercel file size** | On Vercel Free tier, the serverless body limit is 4.5 MB per request. Use Pro plan (50 MB) or a different host for larger uploads. |
| **No real-time sync** | There is no WebSocket or polling mechanism. The explorer shows the state at the time of the last fetch. Use the Refresh button to reload. |
| **Virtual folders only** | R2 (like S3) does not have real directories. Folders are simulated via S3 key prefixes. Empty folders are represented as zero-byte objects ending with `/`. |
| **No access control tiers** | The current password system is a single shared password — there are no per-user roles or fine-grained access control. |
| **Browser memory** | Very large ZIP downloads (multi-GB) may strain browser memory depending on the client machine's resources. |
| **No versioning** | R2 object versioning is not exposed in the current UI. Overwriting a file replaces it permanently. |

---

## 🛠️ Development Notes

### Adding a New Language

1. Open `src/i18n/translations.ts`
2. Add a new language key (e.g., `'ja'`) following the same structure as existing translations
3. Add the language to the `languages` array in `src/components/file-explorer/FileExplorerHeader.tsx`

### Adding a New API Route

1. Add the route handler to `backend/api/index.ts`
2. Add the corresponding service method to `src/services/r2Service.ts`
3. Update the TypeScript types in `src/types.ts` if needed

### Running Backend and Frontend Separately

```bash
# Terminal 1 — Backend
npm run dev:backend

# Terminal 2 — Frontend
npm run dev:frontend
```

---

## 📄 License

Licensed under the **Apache License 2.0**. See [LICENSE](LICENSE) for details.

Free for personal and commercial use, modification, and distribution.

---

## 👤 Developer

**Bruno Kappi**
*Fullstack Developer & Systems Analyst*
📍 Novo Hamburgo, Rio Grande do Sul, Brazil

With a background in both industrial automation and modern web development, Bruno brings a rare blend of technical depth and product vision to everything he builds.

- 🌐 [Portfolio](https://myportfolio.bkappi.com/)
- 💼 [LinkedIn](https://www.linkedin.com/in/brunokappi/)
- 📝 [Blog](https://blog.bkappi.com/)
- 🐙 [GitHub](https://github.com/BrunoKappi)

---

*If you find this project useful, consider giving it a ⭐ on GitHub!*
