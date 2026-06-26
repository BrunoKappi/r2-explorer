/* ============================================================
   R2 Explorer Landing Page — app.js
   Handles: theme, language, tabs, mobile nav, copy buttons
   ============================================================ */

// ============================================================
// Translations
// ============================================================
const TRANSLATIONS = {
  en: {
    'nav.features': 'Features',
    'nav.screenshots': 'Screenshots',
    'nav.tech': 'Tech Stack',
    'nav.howto': 'Quick Start',
    'nav.developer': 'Developer',
    'nav.github': 'GitHub',
    'hero.badge': 'Open Source on GitHub',
    'hero.title1': 'The Modern',
    'hero.title2': 'Cloudflare R2 Explorer',
    'hero.subtitle': 'A robust, full-stack platform for managing, visualizing, and performing deep operations on your Cloudflare R2 storage buckets — with a premium UI, multilingual support, and powerful batch operations.',
    'hero.cta': 'View on GitHub',
    'hero.exploreFeatures': 'Explore Features',
    'hero.stat1': 'Languages',
    'hero.stat2': 'View Modes',
    'hero.stat3': 'Per File',
    'hero.stat4': 'Bucket Size',
    'features.badge': 'Core Features',
    'features.title.pre': 'Everything You Need to',
    'features.title.accent': 'Manage Cloudflare R2',
    'features.subtitle': 'A complete suite of tools designed to give you full control over your R2 storage buckets — all in a beautiful, intuitive interface.',
    'features.upload.title': 'Recursive Folder Upload',
    'features.upload.desc': 'Drag entire folder structures from your OS directly into the explorer. Nested sub-folders are recursively processed, perfectly reproducing your directory tree in R2.',
    'features.upload.i1': 'External OS Drag & Drop',
    'features.upload.i2': 'Recursive folder tree replication',
    'features.upload.i3': 'Floating real-time progress queue',
    'features.upload.i4': 'Transfer speed indicator',
    'features.upload.i5': 'Error retry support',
    'features.dnd.title': 'Internal Drag & Drop',
    'features.dnd.desc': 'Reorganize files and folders inside the explorer by dragging rows onto target folders — completely separated from OS file-drop events.',
    'features.dnd.i1': 'Move files between folders visually',
    'features.dnd.i2': 'Isotropic event handling',
    'features.dnd.i3': 'No OS drag interference',
    'features.dnd.i4': 'Visual drop target highlighting',
    'features.bulk.title': 'Bulk Actions & ZIP Downloads',
    'features.bulk.desc': 'Select multiple files or entire folders and perform simultaneous operations. Package items into a dynamically generated ZIP archive processed server-side.',
    'features.bulk.i1': 'Multi-select with Ctrl/Shift/Cmd',
    'features.bulk.i2': 'Marquee lasso selection box',
    'features.bulk.i3': 'ZIP download (server-side streaming)',
    'features.bulk.i4': 'Mass move & delete',
    'features.bulk.i5': 'Copy paths to clipboard',
    'features.views.title': '6 View Layout Modes',
    'features.views.desc': 'Switch between six distinct view modes to browse your files exactly the way you prefer — from detailed lists to large icon grids and mosaic previews.',
    'features.views.i1': 'Details (list) view',
    'features.views.i2': 'Small / Medium / Large icons',
    'features.views.i3': 'Extra-Large icons',
    'features.views.i4': 'Mosaic view (image gallery)',
    'features.ctx.title': 'Rich Context Menu',
    'features.ctx.desc': 'Right-click any item for a full set of operations. The context-aware menu adapts to files, folders, and empty areas.',
    'features.ctx.i1': 'Open / Navigate',
    'features.ctx.i2': 'Rename with inline input',
    'features.ctx.i3': 'Move to any directory',
    'features.ctx.i4': 'Copy path / Share CDN link',
    'features.ctx.i5': 'Download file or folder as ZIP',
    'features.ctx.i6': 'View properties & metadata',
    'features.ctx.i7': 'Delete with confirmation',
    'features.details.title': 'Object Properties & Metadata',
    'features.details.desc': 'Inspect full file metadata including MIME type, MD5 hash (ETag), file size, timestamps, and custom Cloudflare metadata tags — with inline media previews.',
    'features.details.i1': 'MIME type detection',
    'features.details.i2': 'MD5 / ETag hash display',
    'features.details.i3': 'Image & video inline preview',
    'features.details.i4': 'Custom metadata tags (key/value)',
    'features.details.i5': 'CDN public URL copy',
    'features.i18n.title': '5-Language Internationalization',
    'features.i18n.desc': 'The entire interface is fully localized in 5 languages. Browser language is auto-detected. Switch on-the-fly using the globe selector.',
    'features.search.title': 'Global Search & Navigation',
    'features.search.desc': 'Search across the entire bucket with a debounced query that filters results reactively. Navigate directories with interactive breadcrumb paths.',
    'features.search.i1': 'Full-bucket global search',
    'features.search.i2': 'Debounced reactive filtering',
    'features.search.i3': 'Interactive breadcrumb navigation',
    'features.search.i4': 'Navigate to search result folder',
    'features.stats.title': 'Bucket Statistics',
    'features.stats.desc': 'Get a comprehensive overview of your bucket: total files, folder count, cumulative size, average file size, estimated ZIP payload, and file type distribution.',
    'features.stats.i1': 'Total files & folder count',
    'features.stats.i2': 'Cumulative storage size',
    'features.stats.i3': 'Average file size',
    'features.stats.i4': 'Extension distribution chart',
    'features.stats.i5': 'Estimated ZIP payload size',
    'features.sec.title': 'Password Protection & Security',
    'features.sec.desc': 'All credentials stay strictly server-side. Access is protected by a configurable password gate. CORS origins are configurable per deployment.',
    'features.sec.i1': 'Server-side credentials only',
    'features.sec.i2': 'Access password gate',
    'features.sec.i3': 'Configurable CORS origins',
    'features.sec.i4': 'Session persistence via localStorage',
    'features.kbd.title': 'Keyboard Shortcuts',
    'features.kbd.desc': 'Navigate and manage files at the speed of thought with built-in keyboard shortcuts that mimic native OS file explorer behavior.',
    'features.kbd.i1': 'Select All',
    'features.kbd.i2': 'Copy & Paste',
    'features.kbd.i3': 'Delete selected',
    'features.kbd.i4': 'Rename',
    'features.kbd.i5': 'Open / Preview',
    'features.prefix.title': 'Prefix Mode Toggle',
    'features.prefix.desc': 'Toggle between virtual folder mode (S3 delimiter navigation) and flat object listing — showing all raw S3 keys recursively without grouping.',
    'features.prefix.i1': 'Virtual folder tree (S3 delimiter)',
    'features.prefix.i2': 'Flat recursive object listing',
    'features.prefix.i3': 'Auto-create bucket on first load',
    'screenshots.badge': 'Interface Preview',
    'screenshots.title.pre': 'See R2 Explorer ',
    'screenshots.title.accent': 'in Action',
    'screenshots.subtitle': 'A carefully crafted UI that feels familiar, fast, and powerful.',
    'screenshots.t1': 'Folder View',
    'screenshots.t2': 'Large Icons',
    'screenshots.t3': 'Image Gallery',
    'screenshots.t4': 'Prefix Mode',
    'screenshots.t5': 'Statistics',
    'screenshots.c1t': 'Folder Navigation View',
    'screenshots.c1d': 'Navigate your R2 bucket with breadcrumb trails, virtual folder hierarchies, and an intuitive toolbar. Right-click any item for quick operations.',
    'screenshots.c2t': 'Large Icons Grid View',
    'screenshots.c2d': 'Switch to icon grid view for visual browsing. Six density levels let you choose exactly how much information to display.',
    'screenshots.c3t': 'Image Gallery & Mosaic View',
    'screenshots.c3d': 'Browse image-heavy folders with the mosaic view, displaying thumbnails directly from your CDN — perfect for managing media assets.',
    'screenshots.c4t': 'Flat Prefix / Object Listing Mode',
    'screenshots.c4d': 'Toggle between virtual folder mode and flat S3 prefix listing. See all object keys as stored in R2 — ideal for debugging.',
    'screenshots.c5t': 'Bucket Statistics Dashboard',
    'screenshots.c5d': 'Instant overview of your bucket: total files, folders, cumulative storage size, average file size, and extension distribution.',
    'tech.badge': 'Architecture',
    'tech.title.pre': 'Built with a ',
    'tech.title.accent': 'Modern Stack',
    'tech.subtitle': 'Production-ready architecture combining React 19, Express, AWS SDK v3, and Tailwind CSS v4.',
    'tech.react': 'Frontend UI with hooks and concurrent features',
    'tech.ts': 'Full-stack type safety across frontend and backend',
    'tech.express': 'REST API with CORS, auth, and file routing',
    'tech.aws': 'S3-compatible client for Cloudflare R2',
    'tech.query': 'Enterprise caching and optimistic mutations',
    'tech.zustand': 'Lightweight reactive global state',
    'tech.vite': 'Lightning-fast build tool and dev server',
    'tech.motion': 'Smooth animations and micro-interactions',
    'tech.archiver': 'Server-side streaming ZIP generation',
    'tech.i18n': 'Internationalization with browser detection',
    'tech.tailwind': 'Utility-first styling with dark mode',
    'tech.esbuild': 'Ultra-fast backend TypeScript bundling',
    'how.badge': 'Quick Setup',
    'how.title.pre': 'Get Started in ',
    'how.title.accent': 'Minutes',
    'how.subtitle': 'Clone, configure, and launch — your R2 bucket manager is ready.',
    'how.s1t': 'Clone & Install',
    'how.s1d': 'Clone the repository and install all dependencies with npm.',
    'how.s2t': 'Configure Environment',
    'how.s2d': 'Create a .env file with your Cloudflare R2 credentials.',
    'how.s3t': 'Launch Dev Server',
    'how.s3d': 'Start both Express backend and Vite frontend simultaneously.',
    'dev.badge': 'About the Developer',
    'dev.title.pre': 'Built by ',
    'dev.role': 'Fullstack Developer & Systems Analyst',
    'dev.location': 'Novo Hamburgo, Rio Grande do Sul, Brazil',
    'dev.bio1': 'With a background in both industrial automation and modern web development, Bruno brings a rare blend of technical depth and product vision to everything he builds.',
    'dev.bio2': 'He believes software should be elegant, efficient, and most of all, useful.',
    'dev.portfolio': 'Portfolio',
    'dev.blog': 'Blog',
    'cta.title.pre': 'Ready to Explore Your',
    'cta.subtitle': 'Open source, self-hosted, and completely free. Fork it, customize it, and make it yours.',
    'cta.btn': 'Star on GitHub',
    'cta.license': 'Licensed under Apache 2.0 — free for personal and commercial use.',
    'footer.copy': 'Built with ❤️ by Bruno Kappi · Apache 2.0 License',
  },

  'pt-BR': {
    'nav.features': 'Funcionalidades',
    'nav.screenshots': 'Screenshots',
    'nav.tech': 'Tecnologias',
    'nav.howto': 'Início Rápido',
    'nav.developer': 'Desenvolvedor',
    'nav.github': 'GitHub',
    'hero.badge': 'Código Aberto no GitHub',
    'hero.title1': 'O Moderno',
    'hero.title2': 'Explorador Cloudflare R2',
    'hero.subtitle': 'Uma plataforma full-stack robusta para gerenciar, visualizar e operar profundamente nos seus buckets Cloudflare R2 — com UI premium, suporte multilíngue e operações em lote.',
    'hero.cta': 'Ver no GitHub',
    'hero.exploreFeatures': 'Explorar Funcionalidades',
    'hero.stat1': 'Idiomas',
    'hero.stat2': 'Modos de Visualização',
    'hero.stat3': 'Por Arquivo',
    'hero.stat4': 'Tamanho do Bucket',
    'features.badge': 'Funcionalidades Principais',
    'features.title.pre': 'Tudo que Você Precisa para',
    'features.title.accent': 'Gerenciar o Cloudflare R2',
    'features.subtitle': 'Um conjunto completo de ferramentas para dar controle total sobre seus buckets R2 — em uma interface bonita e intuitiva.',
    'features.upload.title': 'Upload Recursivo de Pastas',
    'features.upload.desc': 'Arraste estruturas de pastas inteiras do seu SO para o explorador. Sub-pastas aninhadas são processadas recursivamente, reproduzindo sua árvore de diretórios no R2.',
    'features.upload.i1': 'Arrastar e Soltar do SO',
    'features.upload.i2': 'Replicação recursiva de pastas',
    'features.upload.i3': 'Fila de progresso em tempo real',
    'features.upload.i4': 'Indicador de velocidade de transferência',
    'features.upload.i5': 'Suporte a retentar erros',
    'features.dnd.title': 'Arrastar e Soltar Interno',
    'features.dnd.desc': 'Reorganize arquivos e pastas arrastando linhas para pastas de destino — completamente separado dos eventos de soltar do SO.',
    'features.dnd.i1': 'Mover arquivos entre pastas visualmente',
    'features.dnd.i2': 'Tratamento isotropico de eventos',
    'features.dnd.i3': 'Sem interferência com arraste do SO',
    'features.dnd.i4': 'Destaque visual do alvo de soltar',
    'features.bulk.title': 'Ações em Lote e Downloads ZIP',
    'features.bulk.desc': 'Selecione múltiplos arquivos ou pastas inteiras para operações simultâneas. Compacte em ZIP gerado dinamicamente no servidor.',
    'features.bulk.i1': 'Multi-seleção com Ctrl/Shift/Cmd',
    'features.bulk.i2': 'Seleção por borracha de marquise',
    'features.bulk.i3': 'Download ZIP (streaming no servidor)',
    'features.bulk.i4': 'Mover e excluir em massa',
    'features.bulk.i5': 'Copiar caminhos para clipboard',
    'features.views.title': '6 Modos de Visualização',
    'features.views.desc': 'Alterne entre seis modos distintos para navegar seus arquivos do jeito que preferir — de listas detalhadas a grades de ícones grandes e mosaicos.',
    'features.views.i1': 'Visualização em detalhes (lista)',
    'features.views.i2': 'Ícones Pequenos / Médios / Grandes',
    'features.views.i3': 'Ícones Extra-Grandes',
    'features.views.i4': 'Visualização em Mosaico (galeria)',
    'features.ctx.title': 'Menu de Contexto Rico',
    'features.ctx.desc': 'Clique com botão direito em qualquer item para acessar um conjunto completo de operações. O menu adaptado exibe apenas ações relevantes.',
    'features.ctx.i1': 'Abrir / Navegar',
    'features.ctx.i2': 'Renomear com campo inline',
    'features.ctx.i3': 'Mover para qualquer diretório',
    'features.ctx.i4': 'Copiar caminho / Compartilhar link CDN',
    'features.ctx.i5': 'Baixar arquivo ou pasta como ZIP',
    'features.ctx.i6': 'Ver propriedades e metadados',
    'features.ctx.i7': 'Excluir com confirmação',
    'features.details.title': 'Propriedades e Metadados do Objeto',
    'features.details.desc': 'Inspecione metadados completos: tipo MIME, hash MD5 (ETag), tamanho, timestamps e tags de metadados personalizados do Cloudflare — com pré-visualizações inline.',
    'features.details.i1': 'Detecção de tipo MIME',
    'features.details.i2': 'Exibição de hash MD5 / ETag',
    'features.details.i3': 'Pré-visualização inline de imagem e vídeo',
    'features.details.i4': 'Tags de metadados customizados (chave/valor)',
    'features.details.i5': 'Cópia da URL pública CDN',
    'features.i18n.title': 'Internacionalização em 5 Idiomas',
    'features.i18n.desc': 'A interface completa é localizada em 5 idiomas. O idioma do navegador é detectado automaticamente. Troque facilmente com o seletor de globo.',
    'features.search.title': 'Pesquisa Global e Navegação',
    'features.search.desc': 'Pesquise em todo o bucket com uma query com debounce que filtra resultados reativamente. Navegue com breadcrumbs interativos.',
    'features.search.i1': 'Pesquisa global em todo o bucket',
    'features.search.i2': 'Filtragem reativa com debounce',
    'features.search.i3': 'Navegação por breadcrumbs interativos',
    'features.search.i4': 'Navegar para pasta do resultado',
    'features.stats.title': 'Estatísticas do Bucket',
    'features.stats.desc': 'Visão geral completa: total de arquivos, contagem de pastas, tamanho acumulado, tamanho médio de arquivo, payload ZIP estimado e distribuição por tipo.',
    'features.stats.i1': 'Total de arquivos e pastas',
    'features.stats.i2': 'Tamanho de armazenamento acumulado',
    'features.stats.i3': 'Tamanho médio de arquivo',
    'features.stats.i4': 'Gráfico de distribuição por extensão',
    'features.stats.i5': 'Tamanho estimado do payload ZIP',
    'features.sec.title': 'Proteção por Senha e Segurança',
    'features.sec.desc': 'Todas as credenciais ficam estritamente no servidor. O acesso é protegido por uma porta de senha configurável. Origens CORS são configuráveis.',
    'features.sec.i1': 'Credenciais apenas no servidor',
    'features.sec.i2': 'Porta de senha de acesso',
    'features.sec.i3': 'Origens CORS configuráveis',
    'features.sec.i4': 'Persistência de sessão via localStorage',
    'features.kbd.title': 'Atalhos de Teclado',
    'features.kbd.desc': 'Navegue e gerencie arquivos na velocidade do pensamento com atalhos que simulam o explorador de arquivos nativo do SO.',
    'features.kbd.i1': 'Selecionar Tudo',
    'features.kbd.i2': 'Copiar e Colar',
    'features.kbd.i3': 'Excluir selecionados',
    'features.kbd.i4': 'Renomear',
    'features.kbd.i5': 'Abrir / Pré-visualizar',
    'features.prefix.title': 'Alternância de Modo Prefixo',
    'features.prefix.desc': 'Alterne entre modo de pastas virtuais (navegação com delimitador S3) e listagem flat de objetos — mostrando todas as chaves S3 recursivamente.',
    'features.prefix.i1': 'Árvore de pastas virtuais (delimitador S3)',
    'features.prefix.i2': 'Listagem flat recursiva de objetos',
    'features.prefix.i3': 'Criação automática do bucket no primeiro uso',
    'screenshots.badge': 'Prévia da Interface',
    'screenshots.title.pre': 'Veja o R2 Explorer ',
    'screenshots.title.accent': 'em Ação',
    'screenshots.subtitle': 'Uma UI cuidadosamente elaborada que parece familiar, rápida e poderosa.',
    'screenshots.t1': 'Visão de Pastas',
    'screenshots.t2': 'Ícones Grandes',
    'screenshots.t3': 'Galeria de Imagens',
    'screenshots.t4': 'Modo Prefixo',
    'screenshots.t5': 'Estatísticas',
    'screenshots.c1t': 'Visão de Navegação em Pastas',
    'screenshots.c1d': 'Navegue pelo bucket com trilhas de breadcrumb e hierarquias de pastas virtuais. Clique com botão direito para operações rápidas.',
    'screenshots.c2t': 'Visão em Grade de Ícones Grandes',
    'screenshots.c2d': 'Alterne para visão em grade de ícones para navegação visual. Seis níveis de densidade para escolher quanto detalhe exibir.',
    'screenshots.c3t': 'Galeria de Imagens e Mosaico',
    'screenshots.c3d': 'Navegue pastas com muitas imagens no modo mosaico, exibindo miniaturas diretamente do seu CDN.',
    'screenshots.c4t': 'Modo Plano de Listagem de Objetos',
    'screenshots.c4d': 'Alterne entre modo de pastas virtuais e listagem flat de prefixos S3. Ideal para depuração.',
    'screenshots.c5t': 'Dashboard de Estatísticas do Bucket',
    'screenshots.c5d': 'Visão geral instantânea: total de arquivos, pastas, tamanho acumulado e distribuição por extensão.',
    'tech.badge': 'Arquitetura',
    'tech.title.pre': 'Construído com uma ',
    'tech.title.accent': 'Stack Moderna',
    'tech.subtitle': 'Arquitetura pronta para produção com React 19, Express, AWS SDK v3 e Tailwind CSS v4.',
    'tech.react': 'Interface frontend com hooks e recursos concorrentes',
    'tech.ts': 'Segurança de tipos full-stack',
    'tech.express': 'API REST com CORS, autenticação e roteamento',
    'tech.aws': 'Cliente compatível S3 para Cloudflare R2',
    'tech.query': 'Cache empresarial e mutações otimistas',
    'tech.zustand': 'Gerenciamento de estado global reativo',
    'tech.vite': 'Ferramenta de build ultra-rápida',
    'tech.motion': 'Animações suaves e micro-interações',
    'tech.archiver': 'Geração de ZIP em streaming no servidor',
    'tech.i18n': 'Internacionalização com detecção do navegador',
    'tech.tailwind': 'Estilização utility-first com modo escuro',
    'tech.esbuild': 'Empacotamento TypeScript ultra-rápido do backend',
    'how.badge': 'Configuração Rápida',
    'how.title.pre': 'Comece em ',
    'how.title.accent': 'Minutos',
    'how.subtitle': 'Clone, configure e inicie — seu gerenciador de bucket R2 está pronto.',
    'how.s1t': 'Clonar e Instalar',
    'how.s1d': 'Clone o repositório e instale todas as dependências com npm.',
    'how.s2t': 'Configurar Ambiente',
    'how.s2d': 'Crie um arquivo .env com suas credenciais do Cloudflare R2.',
    'how.s3t': 'Iniciar Servidor de Desenvolvimento',
    'how.s3d': 'Inicie o backend Express e o frontend Vite simultaneamente.',
    'dev.badge': 'Sobre o Desenvolvedor',
    'dev.title.pre': 'Construído por ',
    'dev.role': 'Desenvolvedor Fullstack & Analista de Sistemas',
    'dev.location': 'Novo Hamburgo, Rio Grande do Sul, Brasil',
    'dev.bio1': 'Com experiência tanto em automação industrial quanto em desenvolvimento web moderno, Bruno traz uma combinação rara de profundidade técnica e visão de produto em tudo que constrói.',
    'dev.bio2': 'Ele acredita que o software deve ser elegante, eficiente e, acima de tudo, útil.',
    'dev.portfolio': 'Portfólio',
    'dev.blog': 'Blog',
    'cta.title.pre': 'Pronto para Explorar seu Bucket R2?',
    'cta.subtitle': 'Código aberto, auto-hospedado e completamente gratuito. Faça um fork, personalize e torne seu.',
    'cta.btn': 'Favoritar no GitHub',
    'cta.license': 'Licenciado sob Apache 2.0 — gratuito para uso pessoal e comercial.',
    'footer.copy': 'Construído com ❤️ por Bruno Kappi · Licença Apache 2.0',
  },

  es: {
    'nav.features': 'Características',
    'nav.screenshots': 'Capturas',
    'nav.tech': 'Tecnologías',
    'nav.howto': 'Inicio Rápido',
    'nav.developer': 'Desarrollador',
    'nav.github': 'GitHub',
    'hero.badge': 'Código Abierto en GitHub',
    'hero.title1': 'El Moderno',
    'hero.title2': 'Explorador Cloudflare R2',
    'hero.subtitle': 'Una plataforma full-stack robusta para gestionar, visualizar y operar profundamente en tus buckets de Cloudflare R2 — con UI premium, soporte multilenguaje y operaciones en lote.',
    'hero.cta': 'Ver en GitHub',
    'hero.exploreFeatures': 'Explorar Características',
    'hero.stat1': 'Idiomas',
    'hero.stat2': 'Modos de Vista',
    'hero.stat3': 'Por Archivo',
    'hero.stat4': 'Tamaño del Bucket',
    'features.badge': 'Características Principales',
    'features.title.pre': 'Todo lo que Necesitas para',
    'features.title.accent': 'Gestionar Cloudflare R2',
    'features.subtitle': 'Un conjunto completo de herramientas para darte control total sobre tus buckets R2 — en una interfaz hermosa e intuitiva.',
    'features.upload.title': 'Carga Recursiva de Carpetas',
    'features.upload.desc': 'Arrastra estructuras de carpetas enteras desde tu SO al explorador. Las subcarpetas anidadas se procesan recursivamente, reproduciendo tu árbol de directorios en R2.',
    'features.upload.i1': 'Arrastrar y soltar desde el SO',
    'features.upload.i2': 'Replicación recursiva de carpetas',
    'features.upload.i3': 'Cola de progreso en tiempo real',
    'features.upload.i4': 'Indicador de velocidad de transferencia',
    'features.upload.i5': 'Soporte para reintentar errores',
    'features.dnd.title': 'Arrastrar y Soltar Interno',
    'features.dnd.desc': 'Reorganiza archivos y carpetas arrastrando filas a carpetas de destino — completamente separado de los eventos de soltar del SO.',
    'features.dnd.i1': 'Mover archivos entre carpetas visualmente',
    'features.dnd.i2': 'Manejo isotropico de eventos',
    'features.dnd.i3': 'Sin interferencia con arrastre del SO',
    'features.dnd.i4': 'Resaltado visual del destino',
    'features.bulk.title': 'Acciones en Lote y Descargas ZIP',
    'features.bulk.desc': 'Selecciona múltiples archivos o carpetas enteras para operaciones simultáneas. Empaqueta en ZIP generado dinámicamente en el servidor.',
    'features.bulk.i1': 'Selección múltiple con Ctrl/Shift/Cmd',
    'features.bulk.i2': 'Selección por marquesina',
    'features.bulk.i3': 'Descarga ZIP (streaming en servidor)',
    'features.bulk.i4': 'Mover y eliminar en masa',
    'features.bulk.i5': 'Copiar rutas al portapapeles',
    'features.views.title': '6 Modos de Vista',
    'features.views.desc': 'Cambia entre seis modos distintos para navegar tus archivos como prefieras — desde listas detalladas hasta cuadrículas de íconos grandes y mosaicos.',
    'features.views.i1': 'Vista de detalles (lista)',
    'features.views.i2': 'Íconos Pequeños / Medianos / Grandes',
    'features.views.i3': 'Íconos Extra-Grandes',
    'features.views.i4': 'Vista en Mosaico (galería)',
    'features.ctx.title': 'Menú Contextual Completo',
    'features.ctx.desc': 'Haz clic derecho en cualquier elemento para acceder a un conjunto completo de operaciones. El menú se adapta a archivos, carpetas y áreas vacías.',
    'features.ctx.i1': 'Abrir / Navegar',
    'features.ctx.i2': 'Renombrar con entrada inline',
    'features.ctx.i3': 'Mover a cualquier directorio',
    'features.ctx.i4': 'Copiar ruta / Compartir enlace CDN',
    'features.ctx.i5': 'Descargar archivo o carpeta como ZIP',
    'features.ctx.i6': 'Ver propiedades y metadatos',
    'features.ctx.i7': 'Eliminar con confirmación',
    'features.details.title': 'Propiedades y Metadatos del Objeto',
    'features.details.desc': 'Inspecciona metadatos completos: tipo MIME, hash MD5 (ETag), tamaño, marcas de tiempo y etiquetas de metadatos personalizados de Cloudflare — con vistas previas inline.',
    'features.details.i1': 'Detección de tipo MIME',
    'features.details.i2': 'Visualización de hash MD5 / ETag',
    'features.details.i3': 'Vista previa inline de imagen y video',
    'features.details.i4': 'Etiquetas de metadatos (clave/valor)',
    'features.details.i5': 'Copia de URL pública CDN',
    'features.i18n.title': 'Internacionalización en 5 Idiomas',
    'features.i18n.desc': 'La interfaz completa está localizada en 5 idiomas. El idioma del navegador se detecta automáticamente. Cambia fácilmente con el selector de globo.',
    'features.search.title': 'Búsqueda Global y Navegación',
    'features.search.desc': 'Busca en todo el bucket con una consulta con debounce que filtra resultados reactivamente. Navega con rutas de migas de pan interactivas.',
    'features.search.i1': 'Búsqueda global en todo el bucket',
    'features.search.i2': 'Filtrado reactivo con debounce',
    'features.search.i3': 'Navegación por migas de pan interactivas',
    'features.search.i4': 'Navegar a la carpeta del resultado',
    'features.stats.title': 'Estadísticas del Bucket',
    'features.stats.desc': 'Resumen completo: total de archivos, conteo de carpetas, tamaño acumulado, tamaño promedio de archivo, payload ZIP estimado y distribución por tipo.',
    'features.stats.i1': 'Total de archivos y carpetas',
    'features.stats.i2': 'Tamaño de almacenamiento acumulado',
    'features.stats.i3': 'Tamaño promedio de archivo',
    'features.stats.i4': 'Gráfico de distribución por extensión',
    'features.stats.i5': 'Tamaño estimado del payload ZIP',
    'features.sec.title': 'Protección por Contraseña y Seguridad',
    'features.sec.desc': 'Todas las credenciales permanecen estrictamente en el servidor. El acceso está protegido por una puerta de contraseña configurable. Los orígenes CORS son configurables.',
    'features.sec.i1': 'Credenciales solo en el servidor',
    'features.sec.i2': 'Puerta de contraseña de acceso',
    'features.sec.i3': 'Orígenes CORS configurables',
    'features.sec.i4': 'Persistencia de sesión via localStorage',
    'features.kbd.title': 'Atajos de Teclado',
    'features.kbd.desc': 'Navega y gestiona archivos a la velocidad del pensamiento con atajos que imitan el explorador de archivos nativo del SO.',
    'features.kbd.i1': 'Seleccionar Todo',
    'features.kbd.i2': 'Copiar y Pegar',
    'features.kbd.i3': 'Eliminar seleccionados',
    'features.kbd.i4': 'Renombrar',
    'features.kbd.i5': 'Abrir / Vista previa',
    'features.prefix.title': 'Alternancia de Modo Prefijo',
    'features.prefix.desc': 'Alterna entre modo de carpetas virtuales (navegación con delimitador S3) y listado plano de objetos — mostrando todas las claves S3 recursivamente.',
    'features.prefix.i1': 'Árbol de carpetas virtuales (delimitador S3)',
    'features.prefix.i2': 'Listado plano recursivo de objetos',
    'features.prefix.i3': 'Creación automática del bucket al primer uso',
    'screenshots.badge': 'Vista Previa de la Interfaz',
    'screenshots.title.pre': 'Ve R2 Explorer ',
    'screenshots.title.accent': 'en Acción',
    'screenshots.subtitle': 'Una UI cuidadosamente elaborada que se siente familiar, rápida y poderosa.',
    'screenshots.t1': 'Vista de Carpetas',
    'screenshots.t2': 'Íconos Grandes',
    'screenshots.t3': 'Galería de Imágenes',
    'screenshots.t4': 'Modo Prefijo',
    'screenshots.t5': 'Estadísticas',
    'screenshots.c1t': 'Vista de Navegación de Carpetas',
    'screenshots.c1d': 'Navega tu bucket con rutas de migas de pan y jerarquías de carpetas virtuales. Haz clic derecho para operaciones rápidas.',
    'screenshots.c2t': 'Vista en Cuadrícula de Íconos Grandes',
    'screenshots.c2d': 'Cambia a vista de cuadrícula de íconos para navegación visual. Seis niveles de densidad para elegir cuánta información mostrar.',
    'screenshots.c3t': 'Galería de Imágenes y Mosaico',
    'screenshots.c3d': 'Navega carpetas con muchas imágenes en modo mosaico, mostrando miniaturas directamente desde tu CDN.',
    'screenshots.c4t': 'Modo Plano de Listado de Objetos',
    'screenshots.c4d': 'Alterna entre modo de carpetas virtuales y listado plano de prefijos S3. Ideal para depuración.',
    'screenshots.c5t': 'Panel de Estadísticas del Bucket',
    'screenshots.c5d': 'Resumen instantáneo: total de archivos, carpetas, tamaño acumulado y distribución por extensión.',
    'tech.badge': 'Arquitectura',
    'tech.title.pre': 'Construido con un ',
    'tech.title.accent': 'Stack Moderno',
    'tech.subtitle': 'Arquitectura lista para producción con React 19, Express, AWS SDK v3 y Tailwind CSS v4.',
    'tech.react': 'UI frontend con hooks y características concurrentes',
    'tech.ts': 'Seguridad de tipos full-stack',
    'tech.express': 'API REST con CORS, autenticación y enrutamiento',
    'tech.aws': 'Cliente compatible S3 para Cloudflare R2',
    'tech.query': 'Caché empresarial y mutaciones optimistas',
    'tech.zustand': 'Gestión de estado global reactivo',
    'tech.vite': 'Herramienta de construcción ultra-rápida',
    'tech.motion': 'Animaciones suaves y micro-interacciones',
    'tech.archiver': 'Generación de ZIP en streaming en el servidor',
    'tech.i18n': 'Internacionalización con detección del navegador',
    'tech.tailwind': 'Estilos utility-first con modo oscuro',
    'tech.esbuild': 'Empaquetado TypeScript ultra-rápido del backend',
    'how.badge': 'Configuración Rápida',
    'how.title.pre': 'Empieza en ',
    'how.title.accent': 'Minutos',
    'how.subtitle': 'Clona, configura e inicia — tu gestor de bucket R2 está listo.',
    'how.s1t': 'Clonar e Instalar',
    'how.s1d': 'Clona el repositorio e instala todas las dependencias con npm.',
    'how.s2t': 'Configurar Entorno',
    'how.s2d': 'Crea un archivo .env con tus credenciales de Cloudflare R2.',
    'how.s3t': 'Iniciar Servidor de Desarrollo',
    'how.s3d': 'Inicia el backend Express y el frontend Vite simultáneamente.',
    'dev.badge': 'Sobre el Desarrollador',
    'dev.title.pre': 'Construido por ',
    'dev.role': 'Desarrollador Fullstack y Analista de Sistemas',
    'dev.location': 'Novo Hamburgo, Rio Grande do Sul, Brasil',
    'dev.bio1': 'Con experiencia tanto en automatización industrial como en desarrollo web moderno, Bruno aporta una rara combinación de profundidad técnica y visión de producto en todo lo que construye.',
    'dev.bio2': 'Él cree que el software debe ser elegante, eficiente y, sobre todo, útil.',
    'dev.portfolio': 'Portafolio',
    'dev.blog': 'Blog',
    'cta.title.pre': '¿Listo para Explorar tu Bucket R2?',
    'cta.subtitle': 'Código abierto, auto-alojado y completamente gratuito. Bifúrcalo, personalízalo y hazlo tuyo.',
    'cta.btn': 'Estrella en GitHub',
    'cta.license': 'Licenciado bajo Apache 2.0 — gratuito para uso personal y comercial.',
    'footer.copy': 'Construido con ❤️ por Bruno Kappi · Licencia Apache 2.0',
  }
};

// ============================================================
// State
// ============================================================
let currentLang = 'en';
let currentTheme = 'dark'; // default dark (fallback)

// ============================================================
// Theme Management
// ============================================================
function detectInitialTheme() {
  const saved = localStorage.getItem('r2-lp-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  // Browser preference, fallback dark
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  return 'dark';
}

function applyTheme(theme) {
  currentTheme = theme;
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(theme);
  localStorage.setItem('r2-lp-theme', theme);

  const moonIcon = document.getElementById('icon-moon');
  const sunIcon  = document.getElementById('icon-sun');

  if (moonIcon && sunIcon) {
    if (theme === 'dark') {
      moonIcon.style.display = 'none';
      sunIcon.style.display  = 'block';
    } else {
      moonIcon.style.display = 'block';
      sunIcon.style.display  = 'none';
    }
  }
}

// ============================================================
// Language Management
// ============================================================
function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('r2-lp-lang', lang);
  document.documentElement.lang = lang === 'pt-BR' ? 'pt-BR' : lang === 'es' ? 'es' : 'en';

  const langCurrentEl = document.getElementById('lang-current');
  const labels = { en: 'EN', 'pt-BR': 'PT', es: 'ES' };
  if (langCurrentEl) langCurrentEl.textContent = labels[lang] || 'EN';

  // Mark active lang option
  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
  });

  // Apply translations
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      // Preserve inner HTML structure if it contains child elements
      if (el.children.length === 0) {
        el.textContent = dict[key];
      } else {
        // Only update text node (first child text)
        const text = el.childNodes[0];
        if (text && text.nodeType === 3) {
          text.textContent = dict[key];
        }
      }
    }
  });
}

function detectInitialLang() {
  const saved = localStorage.getItem('r2-lp-lang');
  if (saved && TRANSLATIONS[saved]) return saved;
  const browser = navigator.language || 'en';
  if (browser.startsWith('pt')) return 'pt-BR';
  if (browser.startsWith('es')) return 'es';
  return 'en';
}

// ============================================================
// Screenshot Tabs
// ============================================================
function initTabs() {
  const tabs = document.querySelectorAll('.ss-tab');
  const panels = document.querySelectorAll('.ss-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const targetPanel = document.getElementById(`ss-${target}`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

// ============================================================
// Mobile Menu
// ============================================================
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('nav-links');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on nav link click
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============================================================
// Language Dropdown
// ============================================================
function initLangDropdown() {
  const btn = document.getElementById('lang-btn');
  const dropdown = document.getElementById('lang-dropdown');
  if (!btn || !dropdown) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = dropdown.hasAttribute('hidden');
    if (isHidden) {
      dropdown.removeAttribute('hidden');
      btn.setAttribute('aria-expanded', 'true');
    } else {
      dropdown.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  dropdown.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', () => {
      applyLanguage(opt.dataset.lang);
      dropdown.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

// ============================================================
// Copy buttons
// ============================================================
function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      const original = btn.innerHTML;
      btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = original;
        btn.classList.remove('copied');
      }, 2000);
    });
  });
}

// ============================================================
// Scroll effects
// ============================================================
function initScrollEffects() {
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Intersection observer for scroll-in animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card, .tech-card, .step, .developer-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.feature-card, .tech-card, .step, .developer-card').forEach(el => {
    scrollObserver.observe(el);
  });
}

// ============================================================
// Smooth scroll for anchor links
// ============================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ============================================================
// Init
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Theme
  applyTheme(detectInitialTheme());
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  // Language
  applyLanguage(detectInitialLang());

  // Components
  initLangDropdown();
  initMobileMenu();
  initTabs();
  initCopyButtons();
  initScrollEffects();
  initSmoothScroll();
});
