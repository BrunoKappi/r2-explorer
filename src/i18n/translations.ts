export const resources = {
  en: {
    translation: {
      header: {
        searchPlaceholder: "Search files...",
        search: "Search",
        viewPrefixes: "View prefixes as folders",
        viewPrefixesTooltip: "View the folder tree structure with delimiter '/' or list all objects recursively without delimiters.",
        themeDark: "Switch to dark theme",
        themeLight: "Switch to light theme",
        statistics: "Statistics",
        upload: "Upload",
        addFolder: "Add folder",
        reload: "Reload files",
        folderModeOnly: "Only available in folder mode",
        newFolder: "New folder",
        viewMode: "View layout",
        viewModeDetails: "Details",
        viewModeSmall: "Small icons",
        viewModeMedium: "Medium icons",
        viewModeLarge: "Large icons",
        viewModeExtraLarge: "Extra large icons",
        viewModeMosaic: "Mosaic"
      },
      breadcrumbs: {
        root: "Root"
      },
      table: {
        name: "Objects",
        type: "Type",
        items: "Items",
        size: "Size",
        lastModified: "Modified",
        actions: "Actions",
        emptyAreaLabel: "No items to show"
      },
      emptyState: {
        noItemsFound: "No items found",
        emptyDirectory: "Empty Directory",
        noResultsMatch: "No results match your search in this directory. Try resetting the filter.",
        emptyBucketPrefix: "This Cloudflare R2 bucket prefix does not have any objects or files.",
        newFolder: "New Folder",
        uploadFile: "Upload File"
      },
      status: {
        item: "item",
        items: "items",
        selectedNumItems: "{{count}} items selected",
        selectedOneItem: "1 item selected",
        objectsListed: "Objects listed: {{count}}",
        selectedOf: "Selected: {{selected}} of {{total}}",
        estimatedZip: "Estimated ZIP",
        draggingOverlayTitle: "Drop your files or folders here",
        draggingOverlaySubtitle: "Files will be uploaded to the current folder: \"{{path}}\"",
        dragDropFooter: "Drag and drop to start uploading"
      },
      batchBar: {
        selectedHeading: "Selected Items List",
        itemsChecked_one: "1 item checked",
        itemsChecked_other: "{{count}} items checked",
        scanning: "Scanning cloud workspace directory...",
        noFilesDiscovered: "No individual files discovered inside your selection.",
        totalRawSize: "Total Raw Size",
        zipSize: "Generated ZIP Size",
        zipTooltip: "Estimated ZIP payload compression",
        copyPaths: "Copy Paths",
        copied: "Copied!",
        move: "Move",
        downloadZip: "Download ZIP",
        compressing: "Compressing...",
        delete: "Delete",
        clear: "Clear Selection"
      },
      contextMenu: {
        open: "Open",
        createSubfolder: "Create Subfolder",
        view: "View",
        rename: "Rename",
        moveItem: "Move Item",
        copyPath: "Copy Path",
        shareLink: "Share Link",
        downloadFolder: "Download Folder (.zip)",
        downloadFile: "Download File",
        properties: "Properties",
        delete: "Delete",
        newFolder: "New Folder",
        uploadFile: "Upload File",
        uploadFolder: "Upload Folder",
        refresh: "Refresh (Refetch)",
        toastPathCopied: "Path copied (CDN)!",
        toastShareCopied: "Share link copied!",
        toastPrepZip: "Preparing compressed download (.zip)...",
        toastStartFile: "Starting file download...",
        toastDirUpdated: "Directory updated!"
      },
      modals: {
        cancel: "Cancel",
        confirm: "Confirm",
        create: "Create",
        save: "Save",
        close: "Close",
        createFolder: {
          title: "Create New Folder",
          placeholder: "Folder name...",
          parentFolder: "Parent Directory",
          creating: "Creating..."
        },
        rename: {
          title: "Rename Object",
          label: "Enter a new virtual path name:",
          newNamePlaceholder: "New name...",
          renaming: "Renaming..."
        },
        move: {
          title: "Move Items",
          targetsText_one: "Move 1 item to a virtual directory in the bucket:",
          targetsText_other: "Move {{count}} items to a virtual directory in the bucket:",
          filterPlaceholder: "Filter folder in tree...",
          rootNode: "{{bucketName}} (Root)",
          moving: "Moving..."
        },
        delete: {
          title: "Delete Items",
          confirmationMessage: "Are you sure you want to permanently delete these items from Cloudflare R2?",
          itemsDetail: "This will delete {{count}} virtual path(s) and any files associated with them recursively.",
          warningTrash: "Warning: This action is permanent and cannot be undone.",
          deleting: "Deleting..."
        },
        details: {
          title: "Object Properties",
          fileName: "File Name",
          size: "File Size",
          type: "Mime Type",
          lastModified: "Last Modified",
          md5: "MD5 (ETag)",
          publicUrl: "Public cdn URL",
          copied: "Copied!",
          metadataTitle: "Cloudflare Custom Metadata",
          noCustomMetadata: "No custom metadata descriptors stored on this object.",
          tagKey: "Key",
          tagValue: "Value"
        },
        stats: {
          title: "Bucket Statistics",
          refreshing: "Calculating...",
          totalFolders: "Total Folders",
          totalFiles: "Total Files",
          totalSize: "Total Size",
          averageSize: "Average File Size",
          estimatedZip: "Estimated Zip payload",
          byExtension: "Distribution by Extension",
          emptyBucket: "This bucket has no files to aggregate distributions.",
          type: "Type",
          count: "Count"
        },
        upload: {
          title: "Upload Files and Folders",
          dragDropText: "Drag files or folders here, or",
          selectFiles: "Select Files",
          selectFolder: "Select Folder structure",
          selectedFilesCount: "{{count}} file(s) selected for upload queue",
          uploading: "Uploading...",
          currentPath: "Target Directory"
        }
      },
      uploadsPopup: {
        title: "Upload Workspace Manager",
        minimised: "Minimized",
        done: "All uploads complete!",
        speed: "Speed",
        errors: "errors detected",
        retry: "Retry Failed",
        cancel: "Cancel All",
        clearCompleted: "Clear Completed",
        queued: "Queued",
        uploadingCount: "Uploading {{progress}}%",
        completedCount: "Completed",
        failedCount: "Failed"
      },
      toasts: {
        copySuccess: "Copied to clipboard!",
        renameSuccess: "Item renamed successfully!",
        moveSuccess: "Items moved successfully!",
        deleteSuccess: "Items deleted successfully!",
        folderCreated: "Virtual folder created successfully!",
        uploadSuccess: "Upload completed!"
      }
    }
  },
  "pt-BR": {
    translation: {
      header: {
        searchPlaceholder: "Pesquisar arquivos...",
        search: "Buscar",
        viewPrefixes: "Visualizar prefixos como pastas",
        viewPrefixesTooltip: "Mostra a estrutura em árvore usando o delimitador '/' ou lista todos os objetos de forma recursiva.",
        themeDark: "Mudar para tema escuro",
        themeLight: "Mudar para tema claro",
        statistics: "Estatísticas",
        upload: "Carregar",
        addFolder: "Criar pasta",
        reload: "Recarregar arquivos",
        folderModeOnly: "Disponível apenas no modo pasta",
        newFolder: "Nova pasta",
        viewMode: "Visualização",
        viewModeDetails: "Detalhes",
        viewModeSmall: "Ícones pequenos",
        viewModeMedium: "Ícones médios",
        viewModeLarge: "Ícones grandes",
        viewModeExtraLarge: "Ícones extra grandes",
        viewModeMosaic: "Mosaico"
      },
      breadcrumbs: {
        root: "Raiz"
      },
      table: {
        name: "Objetos",
        type: "Tipo",
        items: "Itens",
        size: "Tamanho",
        lastModified: "Modificado",
        actions: "Ações",
        emptyAreaLabel: "Nenhum item para exibir"
      },
      emptyState: {
        noItemsFound: "Nenhum item encontrado",
        emptyDirectory: "Diretório Vazio",
        noResultsMatch: "Nenhum resultado corresponde à busca neste diretório. Tente redefinir o filtro.",
        emptyBucketPrefix: "Este prefixo de bucket Cloudflare R2 não possui objetos ou arquivos.",
        newFolder: "Nova Pasta",
        uploadFile: "Enviar Arquivo"
      },
      status: {
        item: "item",
        items: "itens",
        selectedNumItems: "{{count}} itens selecionados",
        selectedOneItem: "1 item selecionado",
        objectsListed: "Objetos listados: {{count}}",
        selectedOf: "Selecionado: {{selected}} de {{total}}",
        estimatedZip: "ZIP Estimado",
        draggingOverlayTitle: "Arraste seus arquivos ou pastas para cá",
        draggingOverlaySubtitle: "Os itens serão carregados na pasta atual: \"{{path}}\"",
        dragDropFooter: "Arraste e solte arquivos aqui para enviar"
      },
      batchBar: {
        selectedHeading: "Lista de Itens Selecionados",
        itemsChecked_one: "1 item marcado",
        itemsChecked_other: "{{count}} itens marcados",
        scanning: "Escaneando diretórios na nuvem...",
        noFilesDiscovered: "Nenhum arquivo individual encontrado na sua seleção.",
        totalRawSize: "Tamanho Bruto Total",
        zipSize: "Tamanho Estimado do ZIP",
        zipTooltip: "Estimativa de compactação do arquivo ZIP",
        copyPaths: "Copiar Caminhos",
        copied: "Copiado!",
        move: "Mover",
        downloadZip: "Baixar ZIP",
        compressing: "Compactando...",
        delete: "Deletar",
        clear: "Limpar Seleção"
      },
      contextMenu: {
        open: "Abrir",
        createSubfolder: "Criar Subpasta",
        view: "Visualizar / Detalhes",
        rename: "Renomear",
        moveItem: "Mover Item",
        copyPath: "Copiar Caminho",
        shareLink: "Copiar Link Público",
        downloadFolder: "Baixar Pasta (.zip)",
        downloadFile: "Baixar Arquivo",
        properties: "Propriedades",
        delete: "Excluir",
        newFolder: "Nova Pasta",
        uploadFile: "Enviar Arquivo",
        uploadFolder: "Enviar Pasta",
        refresh: "Atualizar Lista",
        toastPathCopied: "Caminho copiado (CDN)!",
        toastShareCopied: "Link de compartilhamento copiado!",
        toastPrepZip: "Preparando download compactado (.zip)...",
        toastStartFile: "Iniciando download do arquivo...",
        toastDirUpdated: "Diretório atualizado!"
      },
      modals: {
        cancel: "Cancelar",
        confirm: "Confirmar",
        create: "Criar",
        save: "Salvar",
        close: "Fechar",
        createFolder: {
          title: "Criar Nova Pasta",
          placeholder: "Nome da pasta...",
          parentFolder: "Diretório Pai",
          creating: "Criando..."
        },
        rename: {
          title: "Renomear Objeto",
          label: "Digite o novo caminho virtual do item:",
          newNamePlaceholder: "Novo nome...",
          renaming: "Renomeando..."
        },
        move: {
          title: "Mover Itens",
          targetsText_one: "Mover 1 item para um diretório virtual no bucket:",
          targetsText_other: "Mover {{count}} itens para um diretório virtual no bucket:",
          filterPlaceholder: "Filtrar pasta na árvore...",
          rootNode: "{{bucketName}} (Raiz)",
          moving: "Movendo..."
        },
        delete: {
          title: "Excluir Itens",
          confirmationMessage: "Tem certeza que deseja excluir permanentemente estes itens do Cloudflare R2?",
          itemsDetail: "Isso removerá recursivamente {{count}} caminho(s) virtual(is) e todos os seus arquivos.",
          warningTrash: "Aviso: Esta ação é definitiva e não poderá ser desfeita.",
          deleting: "Excluindo..."
        },
        details: {
          title: "Propriedades do Objeto",
          fileName: "Nome do Arquivo",
          size: "Tamanho do Arquivo",
          type: "Tipo Mime",
          lastModified: "Última Modificação",
          md5: "MD5 (ETag)",
          publicUrl: "Link CDN Público",
          copied: "Copiado!",
          metadataTitle: "Metadados Customizados do Cloudflare",
          noCustomMetadata: "Nenhum metadado customizado armazenado neste objeto.",
          tagKey: "Chave",
          tagValue: "Valor"
        },
        stats: {
          title: "Estatísticas do Bucket",
          refreshing: "Calculando...",
          totalFolders: "Total de Pastas",
          totalFiles: "Total de Arquivos",
          totalSize: "Tamanho Total",
          averageSize: "Tamanho Médio por Arquivo",
          estimatedZip: "Tamanho Estimado Compactado",
          byExtension: "Distribuição por Extensão",
          emptyBucket: "Este bucket não possui arquivos para exibir distribuições.",
          type: "Tipo",
          count: "Contagem"
        },
        upload: {
          title: "Carregar Arquivos e Pastas",
          dragDropText: "Arraste os arquivos/pastas para cá, ou",
          selectFiles: "Selecionar Arquivos",
          selectFolder: "Selecionar Estrutura de Pasta",
          selectedFilesCount: "{{count}} arquivo(s) selecionado(s) para fila",
          uploading: "Enviando...",
          currentPath: "Diretório de Destino"
        }
      },
      uploadsPopup: {
        title: "Gerenciador de Carregamentos",
        minimised: "Minimizado",
        done: "Uploads concluídos com sucesso!",
        speed: "Velocidade",
        errors: "erros detectados",
        retry: "Tentar Falhas novamente",
        cancel: "Cancelar Todos",
        clearCompleted: "Limpar Concluídos",
        queued: "Na fila",
        uploadingCount: "Carregando {{progress}}%",
        completedCount: "Concluído",
        failedCount: "Falhou"
      },
      toasts: {
        copySuccess: "Copiado para a área de transferência!",
        renameSuccess: "Item renomeado com sucesso!",
        moveSuccess: "Itens movidos com sucesso!",
        deleteSuccess: "Itens excluídos com sucesso!",
        folderCreated: "Pasta virtual criada com sucesso!",
        uploadSuccess: "Carregamento concluído com sucesso!"
      }
    }
  },
  es: {
    translation: {
      header: {
        searchPlaceholder: "Buscar archivos...",
        search: "Buscar",
        viewPrefixes: "Ver prefijos como carpetas",
        viewPrefixesTooltip: "Ver la estructura de carpetas usando el delimitador '/' o listar todos los objetos recursivamente.",
        themeDark: "Cambiar a tema oscuro",
        themeLight: "Cambiar a tema claro",
        statistics: "Estadísticas",
        upload: "Subir",
        addFolder: "Nueva carpeta",
        reload: "Recargar archivos",
        folderModeOnly: "Solo disponible en modo carpeta",
        newFolder: "Nueva carpeta",
        viewMode: "Vista",
        viewModeDetails: "Detalles",
        viewModeSmall: "Iconos pequeños",
        viewModeMedium: "Iconos medianos",
        viewModeLarge: "Iconos grandes",
        viewModeExtraLarge: "Iconos muy grandes",
        viewModeMosaic: "Mosaico"
      },
      breadcrumbs: {
        root: "Raíz"
      },
      table: {
        name: "Objetos",
        type: "Tipo",
        items: "Elementos",
        size: "Tamaño",
        lastModified: "Modificado",
        actions: "Acciones",
        emptyAreaLabel: "No hay elementos para mostrar"
      },
      emptyState: {
        noItemsFound: "No se encontraron elementos",
        emptyDirectory: "Directorio vacío",
        noResultsMatch: "Ningún resultado coincide con su búsqueda en este directorio. Intente restablecer el filtro.",
        emptyBucketPrefix: "Este prefijo de bucket de Cloudflare R2 no tiene ningún objeto o archivo.",
        newFolder: "Nueva carpeta",
        uploadFile: "Subir archivo"
      },
      status: {
        item: "elemento",
        items: "elementos",
        selectedNumItems: "{{count}} elementos seleccionados",
        selectedOneItem: "1 elemento seleccionado",
        objectsListed: "Objetos listados: {{count}}",
        selectedOf: "Seleccionado: {{selected}} de {{total}}",
        estimatedZip: "ZIP Estimado",
        draggingOverlayTitle: "Arrastre sus archivos o carpetas aquí",
        draggingOverlaySubtitle: "Los archivos se subirán a la carpeta actual: \"{{path}}\"",
        dragDropFooter: "Arrastre y suelte archivos aquí para subir"
      },
      batchBar: {
        selectedHeading: "Lista de Elementos Seleccionados",
        itemsChecked_one: "1 elemento seleccionado",
        itemsChecked_other: "{{count}} elementos seleccionados",
        scanning: "Escaneando directorios en la nube...",
        noFilesDiscovered: "No se encontraron archivos individuales en su selección.",
        totalRawSize: "Tamaño Total Bruto",
        zipSize: "Tamaño del ZIP Generado",
        zipTooltip: "Compresión estimada del archivo ZIP",
        copyPaths: "Copiar Caminos",
        copied: "¡Copiado!",
        move: "Mover",
        downloadZip: "Descargar ZIP",
        compressing: "Comprimiendo...",
        delete: "Eliminar",
        clear: "Limpiar selección"
      },
      contextMenu: {
        open: "Abrir",
        createSubfolder: "Crear Subcarpeta",
        view: "Ver / Detalles",
        rename: "Renombrar",
        moveItem: "Mover elemento",
        copyPath: "Copiar Camino",
        shareLink: "Copiar Link Público",
        downloadFolder: "Descargar carpeta (.zip)",
        downloadFile: "Descargar archivo",
        properties: "Propiedades",
        delete: "Eliminar",
        newFolder: "Nueva carpeta",
        uploadFile: "Subir archivo",
        uploadFolder: "Subir carpeta",
        refresh: "Actualizar lista",
        toastPathCopied: "¡Camino copiado (CDN)!",
        toastShareCopied: "¡Enlace compartido copiado!",
        toastPrepZip: "Preparando descarga comprimida (.zip)...",
        toastStartFile: "Iniciando descarga de archivo...",
        toastDirUpdated: "¡Directorio actualizado!"
      },
      modals: {
        cancel: "Cancelar",
        confirm: "Confirmar",
        create: "Crear",
        save: "Guardar",
        close: "Cerrar",
        createFolder: {
          title: "Crear Nueva Carpeta",
          placeholder: "Nombre de carpeta...",
          parentFolder: "Directorio Padre",
          creating: "Creando..."
        },
        rename: {
          title: "Renombrar Objeto",
          label: "Introduzca un nuevo nombre de camino virtual:",
          newNamePlaceholder: "Nuevo nombre...",
          renaming: "Renonbrando..."
        },
        move: {
          title: "Mover Elementos",
          targetsText_one: "Mover 1 elemento a un directorio virtual en el bucket:",
          targetsText_other: "Mover {{count}} elementos a un directorio virtual en el bucket:",
          filterPlaceholder: "Filtrar carpeta en árbol...",
          rootNode: "{{bucketName}} (Raíz)",
          moving: "Moviendo..."
        },
        delete: {
          title: "Eliminar Elementos",
          confirmationMessage: "¿Está seguro de que desea eliminar permanentemente estos elementos de Cloudflare R2?",
          itemsDetail: "Esto eliminará de forma recursiva {{count}} camino(s) virtual(es) y todos sus archivos asociados.",
          warningTrash: "Advertencia: Esta acción es permanente y no se puede deshacer.",
          deleting: "Eliminando..."
        },
        details: {
          title: "Propiedades del Objeto",
          fileName: "Nombre del archivo",
          size: "Tamaño del archivo",
          type: "Tipo Mime",
          lastModified: "Última modificación",
          md5: "MD5 (ETag)",
          publicUrl: "URL CDN Pública",
          copied: "¡Copiado!",
          metadataTitle: "Metadatos Personalizados de Cloudflare",
          noCustomMetadata: "No hay etiquetas de metadatos personalizados en este objeto.",
          tagKey: "Clave",
          tagValue: "Valor"
        },
        stats: {
          title: "Estadísticas del Bucket",
          refreshing: "Calculando...",
          totalFolders: "Total de carpetas",
          totalFiles: "Total de archivos",
          totalSize: "Tamaño total",
          averageSize: "Tamaño de archivo promedio",
          estimatedZip: "Carga estimada del ZIP",
          byExtension: "Distribución por Extensión",
          emptyBucket: "Este bucket no tiene archivos para analizar distribuciones.",
          type: "Tipo",
          count: "Cantidad"
        },
        upload: {
          title: "Subir Archivos y Carpetas",
          dragDropText: "Arrastre archivos o carpetas aquí, o",
          selectFiles: "Seleccionar archivos",
          selectFolder: "Seleccionar estructura de carpeta",
          selectedFilesCount: "{{count}} archivo(s) seleccionado(s) para cola",
          uploading: "Subiendo...",
          currentPath: "Directorio de destino"
        }
      },
      uploadsPopup: {
        title: "Gestor de Carga",
        minimised: "Minimizado",
        done: "¡Todas las cargas completadas con éxito!",
        speed: "Velocidad",
        errors: "errores detectados",
        retry: "Reintentar fallidos",
        cancel: "Cancelar todo",
        clearCompleted: "Limpar completados",
        queued: "En cola",
        uploadingCount: "Subiendo {{progress}}%",
        completedCount: "Completado",
        failedCount: "Fallado"
      },
      toasts: {
        copySuccess: "¡Copiado al portapapeles!",
        renameSuccess: "¡Objeto renombrado con éxito!",
        moveSuccess: "¡Objetos movidos con éxito!",
        deleteSuccess: "¡Objetos eliminados con éxito!",
        folderCreated: "¡Carpeta virtual creada con éxito!",
        uploadSuccess: "¡Subida completada!"
      }
    }
  },
  de: {
    translation: {
      header: {
        searchPlaceholder: "Dateien suchen...",
        search: "Suchen",
        viewPrefixes: "Präfixe als Ordner anzeigen",
        viewPrefixesTooltip: "Zeigt die Ordnerstruktur mit dem Trennzeichen '/' an oder listet alle Objekte rekursiv ohne Trennzeichen auf.",
        themeDark: "Auf dunkles Design wechseln",
        themeLight: "Auf helles Design wechseln",
        statistics: "Statistiken",
        upload: "Hochladen",
        addFolder: "Ordner hinzufügen",
        reload: "Dateien neu laden",
        folderModeOnly: "Nur im Ordnermodus verfügbar",
        newFolder: "Neuer Ordner",
        viewMode: "Layout anzeigen",
        viewModeDetails: "Details",
        viewModeSmall: "Kleine Symbole",
        viewModeMedium: "Mittelgroße Symbole",
        viewModeLarge: "Große Symbole",
        viewModeExtraLarge: "Sehr große Symbole",
        viewModeMosaic: "Mosaik"
      },
      breadcrumbs: {
        root: "Wurzel"
      },
      table: {
        name: "Objekte",
        type: "Typ",
        items: "Elemente",
        size: "Größe",
        lastModified: "Geändert",
        actions: "Aktionen",
        emptyAreaLabel: "Keine Elemente zum Anzeigen"
      },
      emptyState: {
        noItemsFound: "Keine Elemente gefunden",
        emptyDirectory: "Leeres Verzeichnis",
        noResultsMatch: "Keine Ergebnisse entsprechen Ihrer Suche in diesem Verzeichnis. Versuchen Sie, den Filter zurückzusetzen.",
        emptyBucketPrefix: "Dieses Cloudflare R2-Bucket-Präfix enthält keine Objekte oder Dateien.",
        newFolder: "Neuer Ordner",
        uploadFile: "Datei hochladen"
      },
      status: {
        item: "Element",
        items: "Elemente",
        selectedNumItems: "{{count}} Elemente ausgewählt",
        selectedOneItem: "1 Element ausgewählt",
        objectsListed: "Objekte aufgelistet: {{count}}",
        selectedOf: "Ausgewählt: {{selected}} von {{total}}",
        estimatedZip: "Geschätztes ZIP",
        draggingOverlayTitle: "Dateien oder Ordner hier ablegen",
        draggingOverlaySubtitle: "Dateien werden in den folgenden Ordner hochgeladen: \"{{path}}\"",
        dragDropFooter: "Dateien hierher ziehen und ablegen, um sie hochzuladen"
      },
      batchBar: {
        selectedHeading: "Ausgewählte Elemente",
        itemsChecked_one: "1 Element markiert",
        itemsChecked_other: "{{count}} Elemente markiert",
        scanning: "Scanne Cloud-Verzeichnisse...",
        noFilesDiscovered: "Keine einzelnen Dateien in Ihrer Auswahl gefunden.",
        totalRawSize: "Gesamte Rohgröße",
        zipSize: "Generierte ZIP-Größe",
        zipTooltip: "Geschätzte Kompression des ZIP-Archivs",
        copyPaths: "Pfade kopieren",
        copied: "Kopiert!",
        move: "Verschieben",
        downloadZip: "ZIP herunterladen",
        compressing: "Kompimiere...",
        delete: "Löschen",
        clear: "Auswahl aufheben"
      },
      contextMenu: {
        open: "Öffnen",
        createSubfolder: "Unterordner erstellen",
        view: "Anzeigen / Details",
        rename: "Umbenennen",
        moveItem: "Element verschieben",
        copyPath: "Pfad kopieren",
        shareLink: "Freigabelink kopieren",
        downloadFolder: "Ordner herunterladen (.zip)",
        downloadFile: "Datei herunterladen",
        properties: "Eigenschaften",
        delete: "Löschen",
        newFolder: "Neuer Ordner",
        uploadFile: "Datei hochladen",
        uploadFolder: "Ordner hochladen",
        refresh: "Aktualisieren",
        toastPathCopied: "Pfad kopiert (CDN)!",
        toastShareCopied: "Freigabelink kopiert!",
        toastPrepZip: "Bereite komprimierten Download (.zip) vor...",
        toastStartFile: "Starte Datei-Download...",
        toastDirUpdated: "Verzeichnis aktualisiert!"
      },
      modals: {
        cancel: "Abbrechen",
        confirm: "Bestätigen",
        create: "Erstellen",
        save: "Speichern",
        close: "Schließen",
        createFolder: {
          title: "Neuen Ordner erstellen",
          placeholder: "Ordnername...",
          parentFolder: "Übergeordnetes Verzeichnis",
          creating: "Erstelle..."
        },
        rename: {
          title: "Objekt umbenennen",
          label: "Geben Sie einen neuen virtuellen Pfadnamen ein:",
          newNamePlaceholder: "Neuer Name...",
          renaming: "Benenne um..."
        },
        move: {
          title: "Elemente verschieben",
          targetsText_one: "1 Element in ein virtuelles Verzeichnis im Bucket verschieben:",
          targetsText_other: "{{count}} Elemente in ein virtuelles Verzeichnis im Bucket verschieben:",
          filterPlaceholder: "Ordner im Baum filtern...",
          rootNode: "{{bucketName}} (Wurzel)",
          moving: "Verschiebe..."
        },
        delete: {
          title: "Elemente löschen",
          confirmationMessage: "Sind Sie sicher, dass Sie diese Elemente dauerhaft aus Cloudflare R2 löschen möchten?",
          itemsDetail: "Dadurch werden {{count}} virtuelle(r) Pfad(e) und alle damit verbundenen Dateien rekursiv gelöscht.",
          warningTrash: "Warnung: Diese Aktion ist dauerhaft und kann nicht rückgängig gemacht werden.",
          deleting: "Lösche..."
        },
        details: {
          title: "Objekt-Eigenschaften",
          fileName: "Dateiname",
          size: "Dateigröße",
          type: "MIME-Typ",
          lastModified: "Zuletzt geändert",
          md5: "MD5 (ETag)",
          publicUrl: "Öffentliche CDN-URL",
          copied: "Kopiert!",
          metadataTitle: "Benutzerdefinierte Cloudflare-Metadaten",
          noCustomMetadata: "Keine benutzerdefinierten Metadaten für dieses Objekt gespeichert.",
          tagKey: "Schlüssel",
          tagValue: "Wert"
        },
        stats: {
          title: "Bucket-Statistiken",
          refreshing: "Berechne...",
          totalFolders: "Gesamtanzahl Ordner",
          totalFiles: "Gesamtanzahl Dateien",
          totalSize: "Gesamtgröße",
          averageSize: "Durchschnittliche Dateigröße",
          estimatedZip: "Geschätzte ZIP-Kompression",
          byExtension: "Verteilung nach Erweiterung",
          emptyBucket: "Dieser Bucket enthält keine Dateien zur Auswertung.",
          type: "Typ",
          count: "Anzahl"
        },
        upload: {
          title: "Dateien und Ordner hochladen",
          dragDropText: "Dateien oder Ordner hierhin ziehen oder",
          selectFiles: "Dateien auswählen",
          selectFolder: "Ordnerstruktur auswählen",
          selectedFilesCount: "{{count}} Datei(en) für die Warteschlange ausgewählt",
          uploading: "Lade hoch...",
          currentPath: "Zielverzeichnis"
        }
      },
      uploadsPopup: {
        title: "Upload-Verwaltung",
        minimised: "Minimiert",
        done: "Alle Uploads erfolgreich abgeschlossen!",
        speed: "Geschwindigkeit",
        errors: "Fehler aufgetreten",
        retry: "Fehlgeschlagene wiederholen",
        cancel: "Alle abbrechen",
        clearCompleted: "Erfolgreiche löschen",
        queued: "Warteschlange",
        uploadingCount: "Lade hoch ({{progress}}%)",
        completedCount: "Fertiggestellt",
        failedCount: "Fehlgeschlagen"
      },
      toasts: {
        copySuccess: "In die Zwischenablage kopiert!",
        renameSuccess: "Objekt erfolgreich umbenannt!",
        moveSuccess: "Elemente erfolgreich verschoben!",
        deleteSuccess: "Elemente erfolgreich gelöscht!",
        folderCreated: "Virtueller Ordner erfolgreich erstellt!",
        uploadSuccess: "Upload abgeschlossen!"
      }
    }
  },
  fr: {
    translation: {
      header: {
        searchPlaceholder: "Rechercher des fichiers...",
        search: "Rechercher",
        viewPrefixes: "Afficher les préfixes sous forme de dossiers",
        viewPrefixesTooltip: "Affiche l'arborescence des dossiers en utilisant le délimiteur '/' ou dresse la liste de tous les objets de manière récursive.",
        themeDark: "Passer au thème sombre",
        themeLight: "Passer au thème clair",
        statistics: "Statistiques",
        upload: "Téléverser",
        addFolder: "Créer un dossier",
        reload: "Recharger la liste",
        folderModeOnly: "Uniquement accessible en mode dossier",
        newFolder: "Nouveau dossier",
        viewMode: "Affichage",
        viewModeDetails: "Détails",
        viewModeSmall: "Petites icônes",
        viewModeMedium: "Icônes moyennes",
        viewModeLarge: "Grandes icônes",
        viewModeExtraLarge: "Très grandes icônes",
        viewModeMosaic: "Mosaïque"
      },
      breadcrumbs: {
        root: "Racine"
      },
      table: {
        name: "Objets",
        type: "Type",
        items: "Éléments",
        size: "Taille",
        lastModified: "Modifié",
        actions: "Actions",
        emptyAreaLabel: "Aucun élément à afficher"
      },
      emptyState: {
        noItemsFound: "Aucun élément trouvé",
        emptyDirectory: "Dossier vide",
        noResultsMatch: "Aucun résultat ne correspond à votre recherche dans ce dossier. Essayez de réinitialiser le filtre.",
        emptyBucketPrefix: "Ce préfixe de bucket Cloudflare R2 ne contient aucun objet ou fichier.",
        newFolder: "Nouveau Dossier",
        uploadFile: "Transférer un fichier"
      },
      status: {
        item: "élément",
        items: "éléments",
        selectedNumItems: "{{count}} éléments sélectionnés",
        selectedOneItem: "1 élément sélectionné",
        objectsListed: "Objets répertoriés : {{count}}",
        selectedOf: "Sélectionné : {{selected}} sur {{total}}",
        estimatedZip: "ZIP estimé",
        draggingOverlayTitle: "Déposez vos fichiers ou dossiers ici",
        draggingOverlaySubtitle: "Les fichiers seront téléversés dans le dossier actuel : \"{{path}}\"",
        dragDropFooter: "Glissez-déposez des fichiers ici pour les téléverser"
      },
      batchBar: {
        selectedHeading: "Liste des Éléments Sélectionnés",
        itemsChecked_one: "1 élément coché",
        itemsChecked_other: "{{count}} éléments cochés",
        scanning: "Analyse des répertoires cloud en cours...",
        noFilesDiscovered: "Aucun fichier individuel découvert dans votre sélection.",
        totalRawSize: "Taille totale brute",
        zipSize: "Taille du fichier ZIP généré",
        zipTooltip: "Compression estimée de l'archive ZIP",
        copyPaths: "Copier les chemins",
        copied: "Copié !",
        move: "Déplacer",
        downloadZip: "Télécharger le ZIP",
        compressing: "Compression...",
        delete: "Supprimer",
        clear: "Effacer la sélection"
      },
      contextMenu: {
        open: "Ouvrir",
        createSubfolder: "Créer un sous-dossier",
        view: "Visualiser / Détails",
        rename: "Renommer",
        moveItem: "Déplacer l'élément",
        copyPath: "Copier le chemin",
        shareLink: "Copier le lien public CDN",
        downloadFolder: "Télécharger le dossier (.zip)",
        downloadFile: "Télécharger le fichier",
        properties: "Propriétés",
        delete: "Supprimer",
        newFolder: "Nouveau dossier",
        uploadFile: "Téléverser un fichier",
        uploadFolder: "Téléverser un dossier",
        refresh: "Actualiser la liste",
        toastPathCopied: "Chemin copié (CDN) !",
        toastShareCopied: "Lien de partage copié !",
        toastPrepZip: "Préparation du téléchargement compressé (.zip)...",
        toastStartFile: "Démarrage du téléchargement du fichier...",
        toastDirUpdated: "Liste mise à jour !"
      },
      modals: {
        cancel: "Annuler",
        confirm: "Confirmer",
        create: "Créer",
        save: "Enregistrer",
        close: "Fermer",
        createFolder: {
          title: "Créer un nouveau dossier",
          placeholder: "Nom du dossier...",
          parentFolder: "Répertoire Parent",
          creating: "Création..."
        },
        rename: {
          title: "Renommer l'objet",
          label: "Entrez un nouveau chemin virtuel pour l'objet :",
          newNamePlaceholder: "Nouveau nom...",
          renaming: "Renommage..."
        },
        move: {
          title: "Déplacer des éléments",
          targetsText_one: "Déplacer 1 élément vers un répertoire virtuel du bucket :",
          targetsText_other: "Déplacer {{count}} éléments vers un répertoire virtuel du bucket :",
          filterPlaceholder: "Filtrer le dossier dans l'arborescence...",
          rootNode: "{{bucketName}} (Racine)",
          moving: "Déplacement..."
        },
        delete: {
          title: "Supprimer des éléments",
          confirmationMessage: "Êtes-vous sûr de vouloir supprimer définitivement ces éléments de Cloudflare R2 ?",
          itemsDetail: "Cette action supprimera de façon récursive {{count}} chemin(s) virtuel(s) et tous leurs fichiers associés.",
          warningTrash: "Avertissement : Cette action est irréversible.",
          deleting: "Suppression..."
        },
        details: {
          title: "Propriétés de l'objet",
          fileName: "Nom du fichier",
          size: "Taille du fichier",
          type: "Type Mime",
          lastModified: "Dernière modification",
          md5: "MD5 (ETag)",
          publicUrl: "URL CDN publique",
          copied: "Copié !",
          metadataTitle: "Métadonnées personnalisées Cloudflare",
          noCustomMetadata: "Aucune métadonnée personnalisée stockée sur cet objet.",
          tagKey: "Clé",
          tagValue: "Valeur"
        },
        stats: {
          title: "Statistiques du bucket",
          refreshing: "Calcul en cours...",
          totalFolders: "Nombre de dossiers",
          totalFiles: "Nombre de fichiers",
          totalSize: "Taille totale",
          averageSize: "Taille moyenne des fichiers",
          estimatedZip: "Taille compressée estimée",
          byExtension: "Distribution par extension",
          emptyBucket: "Ce bucket ne possède aucun fichier pour calculer la distribution.",
          type: "Type",
          count: "Quantité"
        },
        upload: {
          title: "Téléverser des fichiers et des dossiers",
          dragDropText: "Glissez des fichiers ou des dossiers ici, ou",
          selectFiles: "Sélectionner des fichiers",
          selectFolder: "Sélectionner la structure d'un dossier",
          selectedFilesCount: "{{count}} fichier(s) sélectionné(s) pour la file d'attente",
          uploading: "Envoi en cours...",
          currentPath: "Répertoire de destination"
        }
      },
      uploadsPopup: {
        title: "Gestionnaire de Téléversement",
        minimised: "Minimisé",
        done: "Tous les transferts sont terminés !",
        speed: "Vitesse",
        errors: "erreurs détectées",
        retry: "Réessayer les échecs",
        cancel: "Tout annuler",
        clearCompleted: "Effacer les terminés",
        queued: "En attente",
        uploadingCount: "Téléversement ({{progress}}%)",
        completedCount: "Terminé",
        failedCount: "Échoué"
      },
      toasts: {
        copySuccess: "Copié dans le presse-papiers !",
        renameSuccess: "Objet renommé avec succès !",
        moveSuccess: "Éléments déplacés avec succès !",
        deleteSuccess: "Éléments supprimés avec succès !",
        folderCreated: "Dossier virtuel créé avec succès !",
        uploadSuccess: "Téléversement terminé !"
      }
    }
  }
};
