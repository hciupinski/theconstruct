-- Enable RLS and define access policies for portfolio projects.
-- Access model:
-- - Public (anon): read published projects only
-- - Matrix admins (authenticated allowlist): full CRUD

alter table if exists public.portfolio_projects enable row level security;

drop policy if exists "portfolio_projects_public_read" on public.portfolio_projects;
drop policy if exists "portfolio_projects_admin_read" on public.portfolio_projects;
drop policy if exists "portfolio_projects_admin_write" on public.portfolio_projects;

create policy "portfolio_projects_public_read"
on public.portfolio_projects
for select
to anon
using (status = 'published');

create policy "portfolio_projects_admin_read"
on public.portfolio_projects
for select
to authenticated
using (auth.uid() in (select user_id from public.matrix_admins));

create policy "portfolio_projects_admin_write"
on public.portfolio_projects
for all
to authenticated
using (auth.uid() in (select user_id from public.matrix_admins))
with check (auth.uid() in (select user_id from public.matrix_admins));
