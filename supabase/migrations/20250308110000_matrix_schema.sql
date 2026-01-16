-- Base schema for Matrix/blog/portfolio content.

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text,
  content text not null,
  status text not null default 'draft',
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  tags text[] not null default '{}',
  cover_image text
);

create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  description text not null,
  tech_stack text[] not null default '{}',
  links jsonb not null default '[]'::jsonb,
  cover_image text
);
