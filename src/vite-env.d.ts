/// <reference types="vite/client" />

declare module '*.css';

type MatrixDataSource = 'mock' | 'supabase';

type PortfolioDataSource = 'mock' | 'supabase';

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_MATRIX_SOURCE?: MatrixDataSource;
  readonly VITE_PORTFOLIO_SOURCE?: PortfolioDataSource;
  readonly VITE_MATRIX_ALLOWED_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
