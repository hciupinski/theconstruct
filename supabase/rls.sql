-- Supabase RLS policies for single-author access.
-- NOTE: This file mirrors the migration in supabase/migrations.
-- Uses an allowlist table keyed by auth.uid() to avoid storing emails in repo.

-- ALLOWLIST TABLE
create table if not exists public.matrix_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.matrix_admins enable row level security;

drop policy if exists "matrix_admins_owner_read" on public.matrix_admins;
drop policy if exists "matrix_admins_owner_write" on public.matrix_admins;

create policy "matrix_admins_owner_read"
on public.matrix_admins
for select
using (auth.uid() = user_id);

create policy "matrix_admins_owner_write"
on public.matrix_admins
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- BLOG POSTS TABLE
alter table if exists public.blog_posts enable row level security;

drop policy if exists "blog_posts_author_read" on public.blog_posts;
drop policy if exists "blog_posts_author_write" on public.blog_posts;

create policy "blog_posts_author_read"
on public.blog_posts
for select
using (auth.uid() in (select user_id from public.matrix_admins));

create policy "blog_posts_author_write"
on public.blog_posts
for all
using (auth.uid() in (select user_id from public.matrix_admins))
with check (auth.uid() in (select user_id from public.matrix_admins));

-- STORAGE BUCKET
-- Create the bucket if it doesn't exist.
insert into storage.buckets (id, name, public)
values ('matrix-media', 'matrix-media', true)
on conflict (id) do nothing;

-- Lock down storage.objects for the matrix-media bucket.
drop policy if exists "matrix_media_read" on storage.objects;
drop policy if exists "matrix_media_write" on storage.objects;

create policy "matrix_media_read"
on storage.objects
for select
using (
  bucket_id = 'matrix-media'
  and auth.uid() in (select user_id from public.matrix_admins)
);

create policy "matrix_media_write"
on storage.objects
for all
using (
  bucket_id = 'matrix-media'
  and auth.uid() in (select user_id from public.matrix_admins)
)
with check (
  bucket_id = 'matrix-media'
  and auth.uid() in (select user_id from public.matrix_admins)
);
