-- Add draft/publish tracking for portfolio projects.

alter table if exists public.portfolio_projects
  add column if not exists status text not null default 'draft',
  add column if not exists published_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();
