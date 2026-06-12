# 📂 Bkappi Cloudflare R2 Explorer & Console

A robust, complete, and modern full-stack platform for managing, visualizing, and performing deep operations on buckets within **Cloudflare R2 Storage**. The user-centric design features a rich, responsive, highly polished interface that fully supports high-contrast **Light Mode** and **Dark Mode** themes.

---

### 📷 Project Visual Preview

Here are some screenshots showcasing the web interface:

#### ☀️ Light Theme
![Bkappi Bucket Light Theme](https://cdn.bkappi.com/GithubReadmeAssets/BkappiBucketLightTheme.png)

#### 🌙 Dark Theme
![Bkappi Bucket Dark Theme](https://cdn.bkappi.com/GithubReadmeAssets/BkappiBucketDarkTheme.png)

---

## ✨ Main Features

This manager has been designed to simulate the native experience of traditional operating systems:

### 🌍 Full Internationalization (i18n)
- **5-Language Coverage**: The entire workspace interface is fully translateable into:
  - 🇺🇸 **English** (default fallback)
  - 🇧🇷 **Português (pt-BR)**
  - 🇪🇸 **Español**
  - 🇩🇪 **Deutsch**
  - 🇫🇷 **Français**
- **Dynamic Selector & Browser-Detection**: The system detects the language preferences of your browser automatically, while supporting on-the-fly swaps via an elegant globe Popover adjacent to the theme controls. Every button, label, dynamic dialog, toast alert, and list is mapped dynamically.

### 🚀 Recursive File and Folder Uploads (External Drag & Drop)
- **Smart Folder and File Upload**: Drag an entire folder structure directly from your operating system (Windows Explorer/macOS Finder) onto any location in the application window. The manager recursively processes files and nested sub-folders, reproducing the exact original tree structure within Cloudflare R2.
- **Floating Progress Queue**: Monitor batch uploads in real-time through a reactive floating panel that tracks overall progress, completed items, errors, and estimated transfer speed.

### 🔄 Internal Drag & Drop (Move Items within Bucket)
- **Fluid Local Sorting**: Re-arrange and move files/folders seamlessly by dragging items in the list and dropping them over a row representing a target folder.
- **Isotropic Event Handling**: Internal operations are strictly separated from OS file-drop events, ensuring smooth catalog reorganizations inside the workspace without trigger-overlay interference or visual interruptions.

### 🛠️ Object Controls & Context Menu
Right-click any item (or use the fast action buttons on the far right of any row) to access:
- **Object Details & Metadata**: Instantly inspect MIME types, MD5 hashes (ETag), sizes, created/updated timestamps, and **custom Cloudflare metadata tags** with live media previews for documents, images, and videos.
- **Instant Rename**: Safely modify virtual paths and filenames under clean visual input limits.
- **Manual Move**: An advanced move modal displaying the bucket folder hierarchy (with enhanced high-contrast text ratios for comfortable dark mode navigation) with a **dynamic search/typing filter** to quickly target deeply nested folders.
- **Secure Destruction**: Transparent delete indicators and warnings for single or multi-selected objects.
- **Share Link Copying**: Copy the CDN public url for the selected file in a single swift click.

### 📦 Dynamic Bulk Actions
- **Zipped Downloads**: Select multiple files or folders and package them into a dynamically generated `.zip` archive processed on-the-fly server-side.
- **Mass Mutations**: Perform moves or deletions over numerous items simultaneously with extreme reliability.

### 🔍 Search & Fast Traversal
- **Inter-Character Debounced Query**: A high-efficiency search bar with local reactive filtering that automatically processes query results after typing pauses, avoiding manual clicks.
- **Breadcrumb Navigation**: Naturally navigate sub-directories through interactive breadcrumb tracks matching virtual path hierarchies.

---

## ⚙️ Variáveis de Ambiente & Configuração

Para garantir a segurança dos dados e isolamento seguro de credenciais, as chaves e rotas da API do Cloudflare R2 permanecem **estritamente em nível de servidor (backend Express)** e nunca são enviadas ao navegador.

Crie um arquivo chamado **`.env`** no diretório raiz do projeto e preencha as variáveis conforme o modelo abaixo. Veja o significado detalhado de cada variável para configurá-lo corretamente:

### Explicação Detalhada das Variáveis:

1. **`R2_ACCESS_KEY_ID`**:
   - **O que significa**: É o identificador único da sua chave de acesso da API do Cloudflare R2.
   - **Para que serve**: Funciona como um "nome de usuário" para assinar solicitações do S3 Client. Ele informa ao Cloudflare R2 qual credencial do token de API está tentando acessar os buckets.
   - **Como obter**: No painel da Cloudflare -> vá para **R2** -> clique em **"Create/Manage R2 API Tokens"** -> gere um token com permissão de leitura/escrita (**Read/Write**) e copie o valor de "Access Key ID".

2. **`R2_SECRET_ACCESS_KEY`**:
   - **O que significa**: É a chave secreta de assinatura associada ao seu `R2_ACCESS_KEY_ID`.
   - **Para que serve**: Funciona como uma "senha ultra secreta" usada para gerar assinaturas criptográficas de verificação que validam cada solicitação feita à API. **Nunca** exponha ou compartilhe essa chave.
   - **Como obter**: Exibido apenas uma vez no momento da criação do R2 API Token junto com o Access Key ID.

3. **`R2_ENDPOINT`**:
   - **O que significa**: É a URL ou o ponto de extremidade de conexão S3 seguro do Cloudflare R2 que aponta diretamente para o ID exclusivo da sua conta.
   - **Para que serve**: Direciona todas as solicitações SDK do AWS S3 client para a infraestrutura geográfica correta da Cloudflare sob o guarda-chuva da sua conta.
   - **Como configurar**: Geralmente segue o formato: `https://<ID_DA_SUA_CONTA>.r2.cloudflarestorage.com`. Você pode encontrar o ID da sua conta diretamente no painel R2 do Cloudflare ou na barra lateral direita do painel principal da Cloudflare.

4. **`R2_BUCKET_NAME`**:
   - **O que significa**: É o nome exato do Bucket R2 onde os arquivos serão lidos, gravados, renomeados, movidos e excluídos.
   - **Para que serve**: Define o escopo das chamadas de API, garantindo que o explorador opere apenas no bucket desejado (por exemplo, `bkappi`).
   - **Como configurar**: Certifique-se de que o nome inserido corresponda exatamente ao nome do bucket criado no painel do Cloudflare R2. O aplicativo criará o bucket automaticamente no primeiro carregamento caso ele não exista.

```env
# Modelo de configuração para o seu arquivo .env
R2_ACCESS_KEY_ID="sua_chave_de_acesso_aqui"
R2_SECRET_ACCESS_KEY="sua_chave_secreta_aqui"
R2_ENDPOINT="https://seu_id_de_conta_aqui.r2.cloudflarestorage.com"
R2_BUCKET_NAME="bkappi"
```

> 🛑 **Importante:** Nunca adicione o arquivo `.env` ao seu repositório de controle de versão (como Git). As regras padrão do `.gitignore` já vêm pré-configuradas para omitir arquivos `.env` e `.env.production` das alterações submetidas.

---

## 🚀 Getting Started

### Install Dependencies
Ensure you have Node.js v18+ installed, then run:
```bash
npm install
```

### Dev Mode
Spin up the Express API server concurrently with the Vite hot-rebuilt client and Tailwind CSS v4 assets:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Build and Production
1. Build highly optimized bundles using esbuild-powered compression:
   ```bash
   npm run build
   ```
2. Start the optimized, standalone web application server:
   ```bash
   npm run start
   ```

---

## 📁 Technical Architecture & Patterns

The platform leverages modular patterns to maintain simple codebase separation:
- **i18next Integration (`/src/i18n`)**: Modularized key translation trees with browser preference sniffer configuration.
- **Zustand (`/src/stores`)**: Lightweight, high-speed reactive stores governing paths, multi-selection indexes, search queries, and sidebar details.
- **React Query (`@tanstack/react-query`)**: Enterprise-grade caching logic to minimize redundant list overhead, with automatic mutations, immediate optimistic cache invalidation, and data refetch triggers (on Upload, Delete, Rename, Move).
- **Esbuild Backend Bundling**: Custom transpilation bundling the modular Node.js Express controllers and TypeScript handlers into a single, high-efficiency CJS bundle (`dist/server.cjs`), optimal for low-latency restarts.
- **Tailwind CSS v4 & Motion**: Styled with precision, using smooth entry transitions, cohesive slate scales, low-brightness dark skeletons to eliminate flickering, and high-contrast styling boundaries.
