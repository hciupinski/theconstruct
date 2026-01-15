Here is a concrete, no-code plan for extending the app with the four routes, plus a recommended stack for frontend, backend, and hosting.

# Overall Approach
- Keep the existing SPA structure and add route-driven pages.
- Introduce a small backend for blog CRUD and media handling.
- Use a lightweight auth approach for the /matrix authoring route.

# /architect (Resume Page)
## UI/UX
- Define the resume layout and styling (timeline, skills, projects, certifications).
- Decide on content source: hardcoded JSON, MD/MDX, or CMS-backed.
## Routing
- Add a new route and page component for /architect.
## Data
- Start with a static data file for speed, then move to CMS if desired.

# /portfolio (Projects and Modal)
## UI/UX
- Create a project card grid with hover effects.
- Modal for details: description, stack, links.
## Data
- Define a projects schema: title, summary, stack, links, images.
- Optionally load from a JSON file or backend API later.
## Accessibility
- Modal focus trap, ESC close, and keyboard navigation.

# /matrix (Authenticated Blog Authoring)
## Auth
- Choose an auth provider (see stack below).
- Gate /matrix route behind auth.
## Editor
- Rich text editor with image embed (e.g., TipTap, Quill).
- Support for JPG/GIF uploads.
## CRUD
- Create, edit, draft/publish, delete posts.
- Manage image assets (upload, replace, delete).
## Storage
- Posts: database.
- Images: object storage (S3-compatible).

# /blog (Public Blog Index and Post Detail)
## UI
- Blog list page with title, excerpt, date, tags.
- Post detail view with full content and images.
## Data
- Fetch published posts from backend.
- Support pagination and/or infinite scroll if needed.
## SEO
- Add metadata for posts (title/description).

# Recommended Tech Stack
## Frontend
- React + Vite (already in use)
- Router: react-router-dom
- Styling: Tailwind or CSS modules (keep consistent with current app style)
- Editor: TipTap or Quill
- Modals: Headless UI or custom plus react-aria patterns

## Backend
### Option A: Supabase (simplest, free-friendly)
- Auth + Postgres + Storage
- Row-level security (RLS) to restrict /matrix to authenticated users, allow public read on published posts only, and block all other access by default.
- Google auth via Supabase Auth (OIDC) with scoped sign-in for the authoring account and session-based access to the editor.
- REST/GraphQL auto-generated

# Cloud Hosting (Free-friendly)
- Frontend: Vercel (free tier)
- Backend: Supabase (free tier)
- Storage: Supabase Storage (free tier)

# CI/CD (GitHub Actions)
- GitHub hosts the repo; GitHub Actions runs on push and pull request.
- Build and lint the frontend, then deploy to Vercel on `main` merges.
- Run Supabase migrations and database checks on `main` merges, with environment-protected secrets.
- Optional manual workflow dispatch for production re-deploys to Vercel and Supabase.

# Suggested Execution Tasks
1. Routing and page shells for /architect, /portfolio, /blog, /matrix.
2. /portfolio data model and modal UX.
3. /blog UI with mock data, then wire to Supabase.
4. Supabase setup: Auth with Google, RLS policies, storage buckets.
5. /matrix editor with CRUD and media uploads.
6. CI/CD pipelines for Vercel deploys and Supabase migrations.
7. SEO and production hardening.
