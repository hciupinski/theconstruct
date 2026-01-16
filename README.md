# The Construct

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## CI/CD (GitHub Actions)

This repo uses a GitHub Actions workflow to apply Supabase migrations and deploy to Vercel on pushes to `main`.

### Required GitHub Secrets

Supabase:
- `SUPABASE_ACCESS_TOKEN`: Personal access token from Supabase.
- `SUPABASE_PROJECT_REF`: Project ref (e.g., `abcdefghijklmnop`).
- `SUPABASE_DB_PASSWORD`: Database password for the project.

Vercel:
- `VERCEL_TOKEN`: Vercel personal access token.
- `VERCEL_ORG_ID`: Vercel team/org ID.
- `VERCEL_PROJECT_ID`: Vercel project ID.

### One-time setup

1. Run the migration in `supabase/migrations/20250308120000_matrix_rls.sql` (it creates an allowlist table and policies).
2. After signing in once, insert your user ID into `public.matrix_admins`:
   - `insert into public.matrix_admins (user_id) values ('YOUR_USER_ID');`
3. Configure the secrets above in your GitHub repo settings.
