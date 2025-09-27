/// <reference types="vite/client" />

interface ViteTypeOptions {
  // Disallow use of undeclared environment variables
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
