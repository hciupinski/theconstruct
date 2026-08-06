# SEO Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `https://theconstruct.ing` the single indexable English-language identity for the portfolio and blog.

**Architecture:** A small site configuration module will own public-site facts. `BaseLayout` and a JSON-LD component will derive page metadata from that module, while Astro routes enrich metadata from their content entries. Static crawl assets and a Node verification script will keep generated output correct without adding runtime dependencies.

**Tech Stack:** Astro 5, TypeScript, React 18, Markdown content collections, Node.js 22+, pnpm, GitHub Pages, GitHub Actions.

## Global Constraints

- Canonical public origin is exactly `https://theconstruct.ing`.
- GitHub Pages is hosting only; generated content must never include `hciupinski.github.io/theconstruct`.
- All public copy and HTML metadata use English with `<html lang="en">`; do not add localized routes or `hreflang`.
- Retain static Astro output and current trailing-slash URLs.
- Add no external runtime SEO dependency or analytics vendor.
- Draft entries never appear in pages, RSS, related links, or tag routes.

---

## File structure

- Create `src/config/site.ts` — typed site identity and URL/image helpers.
- Create `src/components/JsonLd.astro` — safe JSON-LD serialization only.
- Create `src/components/RelatedContent.astro` — shared related-entry list only.
- Create `src/pages/blog/tags/[tag].astro` — static tag archive route.
- Create `public/robots.txt`, `public/site.webmanifest`, `public/favicon.svg`, `public/og-default.svg` — crawl, browser, and default sharing assets.
- Create `scripts/verify-seo.mjs` — generated-output assertions only.
- Modify `src/layouts/BaseLayout.astro` — document metadata and global schemas.
- Modify page and content route files — semantic page copy, route-specific schemas, related content, and tag links.
- Modify `src/content.config.ts`, `src/pages/rss.xml.ts`, `astro.config.mjs`, `package.json`, CI workflows, and `README.md` — content inputs, URLs, validation, and operations documentation.

### Task 1: Add the custom-domain site configuration and a failing output verifier

**Files:**
- Create: `src/config/site.ts`
- Create: `scripts/verify-seo.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `site`, `absoluteUrl(path: string)`, and `absoluteImageUrl(path?: string)` from `src/config/site.ts`.
- Produces: `pnpm verify:seo`, which accepts an already-built `dist` directory and exits non-zero on a failed assertion.

- [ ] **Step 1: Write the failing SEO output assertion**

Create `scripts/verify-seo.mjs` with the first expectation before adding any SEO code:

```js
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const dist = resolve('dist');
const home = await readFile(resolve(dist, 'index.html'), 'utf8');
assert.match(home, /<link rel="canonical" href="https:\/\/theconstruct\.ing\/"/);
```

Add `"verify:seo": "node scripts/verify-seo.mjs"` to `package.json`.

- [ ] **Step 2: Build and run the new assertion to verify it fails**

Run: `pnpm build && pnpm verify:seo`

Expected: the assertion fails because the current homepage emits the GitHub Pages canonical URL.

- [ ] **Step 3: Create the typed source of truth**

Create `src/config/site.ts`:

```ts
export const site = {
  name: 'The Construct',
  origin: 'https://theconstruct.ing',
  locale: 'en_US',
  language: 'en',
  defaultTitle: 'The Construct — Software, Architecture, Security',
  defaultDescription: 'Software architecture, security, and engineering notes by Hubert Ciupinski.',
  author: {
    name: 'Hubert Ciupinski',
    github: 'https://github.com/hciupinski/',
    linkedin: 'https://www.linkedin.com/in/hubert-ciupinski/',
  },
  defaultImage: '/og-default.svg',
} as const;

export const absoluteUrl = (path: string) => new URL(path, `${site.origin}/`).toString();
export const absoluteImageUrl = (path = site.defaultImage) => absoluteUrl(path);
```

- [ ] **Step 4: Point Astro at the same origin**

In `astro.config.mjs`, import `site` and set `site: site.origin`; retain `trailingSlash: 'always'` and existing integrations.

- [ ] **Step 5: Rebuild and run the verifier**

Run: `pnpm build && pnpm verify:seo`

Expected: it still fails, now because metadata implementation has not been added; the failure proves the verifier detects the missing behavior.

- [ ] **Step 6: Commit the configuration and test harness**

```bash
git add src/config/site.ts scripts/verify-seo.mjs package.json astro.config.mjs
git commit -m "feat: add SEO site configuration"
```

### Task 2: Add crawl, browser, and sharing assets

**Files:**
- Create: `public/robots.txt`
- Create: `public/site.webmanifest`
- Create: `public/favicon.svg`
- Create: `public/og-default.svg`
- Modify: `scripts/verify-seo.mjs`

**Interfaces:**
- Consumes: `site.origin` and `site.defaultImage` expectations from Task 1.
- Produces: static files copied unchanged to `dist`.

- [ ] **Step 1: Expand the verifier with missing-static-file assertions**

Append a helper and assertions that do not yet pass:

```js
import { access } from 'node:fs/promises';

for (const path of ['robots.txt', 'site.webmanifest', 'favicon.svg', 'og-default.svg']) {
  await access(resolve(dist, path));
}
const robots = await readFile(resolve(dist, 'robots.txt'), 'utf8');
assert.equal(robots.trim(), 'User-agent: *\nAllow: /\nSitemap: https://theconstruct.ing/sitemap-index.xml');
```

- [ ] **Step 2: Build and verify the static-file assertion fails**

Run: `pnpm build && pnpm verify:seo`

Expected: it fails with `ENOENT` for `dist/robots.txt`.

- [ ] **Step 3: Add production static assets**

Create `public/robots.txt` exactly as asserted. Create a manifest that references `/favicon.svg`, identifies the app as `The Construct`, and uses English. Create a simple, valid `public/favicon.svg`. Create `public/og-default.svg` at a 1200×630 viewBox with the text `The Construct` and `Software · Architecture · Security`; use only local SVG shapes and text so the social image needs no remote resource.

- [ ] **Step 4: Rebuild and run the verifier**

Run: `pnpm build && pnpm verify:seo`

Expected: static-asset assertions pass and the command remains red only for the not-yet-created metadata checks.

- [ ] **Step 5: Commit static SEO assets**

```bash
git add public/robots.txt public/site.webmanifest public/favicon.svg public/og-default.svg scripts/verify-seo.mjs
git commit -m "feat: add crawl and sharing assets"
```

### Task 3: Centralize document metadata and global structured data

**Files:**
- Create: `src/components/JsonLd.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`
- Modify: `scripts/verify-seo.mjs`

**Interfaces:**
- `JsonLd.astro` accepts `data: Record<string, unknown> | Record<string, unknown>[]`.
- `BaseLayout.astro` accepts current `title` and `description`, plus optional `type`, `image`, `publishedAt`, `updatedAt`, and `jsonLd` props.
- Produces: canonical, Open Graph, Twitter, manifest, favicon, `WebSite`, and `Person` markup for every layout page.

- [ ] **Step 1: Write failing home metadata and JSON-LD assertions**

Add assertions to the verifier:

```js
assert.match(home, /<meta property="og:url" content="https:\/\/theconstruct\.ing\/"/);
assert.match(home, /<meta name="twitter:card" content="summary_large_image"/);
assert.match(home, /"@type":"WebSite"/);
assert.match(home, /"@type":"Person"/);
assert.doesNotMatch(home, /hciupinski\.github\.io/);
```

- [ ] **Step 2: Run the verifier and observe the expected failure**

Run: `pnpm build && pnpm verify:seo`

Expected: it fails because no Open Graph/Twitter/global JSON-LD markup exists.

- [ ] **Step 3: Implement safe JSON-LD serialization**

Create `JsonLd.astro` with the following escaping boundary:

```astro
---
type Props = { data: Record<string, unknown> | Record<string, unknown>[] };
const { data } = Astro.props;
const value = JSON.stringify(data).replace(/</g, '\\u003c');
---
<script type="application/ld+json" set:html={value}></script>
```

- [ ] **Step 4: Implement the reusable document head**

Refactor `BaseLayout.astro` to import the site helpers and `JsonLd`. Derive `canonical` from `Astro.url.pathname`, default the image with `absoluteImageUrl`, and emit `og:title`, `og:description`, `og:url`, `og:type`, `og:locale`, `og:image`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, favicon and manifest links. Set `<html lang={site.language}>`. Pass this global graph to `JsonLd`:

```ts
[
  { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: `${site.origin}/` },
  { '@context': 'https://schema.org', '@type': 'Person', name: site.author.name, url: `${site.origin}/architect/`, sameAs: [site.author.github, site.author.linkedin] },
]
```

Render optional page-specific schema as a separate JSON-LD block.

- [ ] **Step 5: Migrate the homepage onto the layout**

Replace its hand-built `<html>` document with `BaseLayout`, passing `site.defaultTitle` and `site.defaultDescription`. This removes the old GitHub Pages canonical and exercises the shared head.

- [ ] **Step 6: Rebuild and verify the green result**

Run: `pnpm check && pnpm build && pnpm verify:seo`

Expected: homepage metadata/static-file assertions pass. Any remaining failures must concern a later task only.

- [ ] **Step 7: Commit shared metadata**

```bash
git add src/components/JsonLd.astro src/layouts/BaseLayout.astro src/pages/index.astro scripts/verify-seo.mjs
git commit -m "feat: add shared SEO metadata"
```

### Task 4: Make the homepage server-rendered and semantically useful

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/MatrixConstructScene.tsx`
- Modify: `src/components/matrix-construct-scene.css`
- Modify: `scripts/verify-seo.mjs`

**Interfaces:**
- Produces one visible homepage `h1`, English positioning copy, and three descriptive internal links independent of React hydration.

- [ ] **Step 1: Write a failing semantic-content assertion**

Add:

```js
assert.match(home, /<h1[^>]*>Software architecture, security, and engineering<\/h1>/);
assert.match(home, /href="\/portfolio\//);
assert.match(home, /href="\/blog\//);
assert.match(home, /href="\/architect\//);
```

- [ ] **Step 2: Run it and verify it fails**

Run: `pnpm build && pnpm verify:seo`

Expected: the `h1` assertion fails because the current homepage has no static heading.

- [ ] **Step 3: Add the HTML-first hero**

Keep `MatrixConstructScene`, but mark its outer visual container `aria-hidden="true"`. Add a positioned `<section>` in `src/pages/index.astro` containing exactly one `h1`, the copy `I build durable software systems and document the decisions behind them.`, and descriptive links labelled `Explore the architect profile`, `View selected projects`, and `Read engineering notes`.

- [ ] **Step 4: Respect reduced motion**

Add a `@media (prefers-reduced-motion: reduce)` rule in `matrix-construct-scene.css` that disables the scene and card animation without hiding the semantic hero.

- [ ] **Step 5: Rebuild and verify it passes**

Run: `pnpm check && pnpm build && pnpm verify:seo`

Expected: all homepage semantic assertions pass.

- [ ] **Step 6: Commit homepage semantics**

```bash
git add src/pages/index.astro src/components/MatrixConstructScene.tsx src/components/matrix-construct-scene.css scripts/verify-seo.mjs
git commit -m "feat: add semantic homepage content"
```

### Task 5: Extend the content model and create the blog tag archive

**Files:**
- Modify: `src/content.config.ts`
- Modify: `src/pages/blog/index.astro`
- Modify: `src/pages/blog/[slug].astro`
- Create: `src/pages/blog/tags/[tag].astro`
- Modify: `scripts/verify-seo.mjs`

**Interfaces:**
- Blog data accepts optional `seoTitle` and `coverImage`.
- `/blog/tags/[tag]/` accepts normalized tags as static params and displays only published matching posts.

- [ ] **Step 1: Write an initially failing tag-route assertion**

Add a helper that checks existing built routes when a published blog post exists, but succeeds without one:

```js
const blogIndex = await readFile(resolve(dist, 'blog/index.html'), 'utf8');
assert.match(blogIndex, /<meta property="og:type" content="website"/);
```

Add a fixture-free assertion that the source tag route exists by using `access(resolve('src/pages/blog/tags/[tag].astro'))` before `dist` assertions.

- [ ] **Step 2: Run and verify the route-source assertion fails**

Run: `pnpm verify:seo`

Expected: it fails with `ENOENT` for the tag route source file.

- [ ] **Step 3: Extend content schemas without breaking current entries**

Add `seoTitle: z.string().min(1).optional()` to both collections; preserve existing `coverImage`, date, and draft fields. Do not make new metadata mandatory for old Markdown files.

- [ ] **Step 4: Implement normalized static tag pages**

In `[tag].astro`, derive unique tags only from `!data.draft` posts, normalize each with `tag.toLowerCase().replace(/[^a-z0-9]+/g, '-')`, and use that same helper for params and links. Render an `h1`, canonical BaseLayout metadata, and matching post cards. Return no static path when no published post uses a tag.

- [ ] **Step 5: Turn blog tag chips into internal links**

In both blog list and detail templates, replace tag `<span>` elements with links to the normalized tag route. Keep the human-readable original tag as the link text.

- [ ] **Step 6: Re-run checks**

Run: `pnpm check && pnpm build && pnpm verify:seo`

Expected: Astro validates the route and all verifier assertions pass.

- [ ] **Step 7: Commit tag discoverability**

```bash
git add src/content.config.ts src/pages/blog/index.astro 'src/pages/blog/[slug].astro' 'src/pages/blog/tags/[tag].astro' scripts/verify-seo.mjs
git commit -m "feat: add indexable blog tags"
```

### Task 6: Add entry-level schemas and related internal links

**Files:**
- Create: `src/components/RelatedContent.astro`
- Modify: `src/pages/blog/[slug].astro`
- Modify: `src/pages/portfolio/[slug].astro`
- Modify: `scripts/verify-seo.mjs`

**Interfaces:**
- `RelatedContent.astro` accepts `heading: string` and `entries: Array<{ title: string; href: string; description: string }>`; it renders nothing for an empty list.
- Blog detail emits `BlogPosting`; portfolio detail emits `CreativeWork`.

- [ ] **Step 1: Write failing entry-schema assertions**

Add a conditional verifier: find one generated non-draft portfolio page under `dist/portfolio`; assert it contains `"@type":"CreativeWork"`, custom-domain canonical metadata, and no GitHub Pages hostname.

- [ ] **Step 2: Run it and verify it fails**

Run: `pnpm build && pnpm verify:seo`

Expected: it fails because project detail pages do not yet include page-specific JSON-LD.

- [ ] **Step 3: Implement the related-entry component**

Create `RelatedContent.astro` with an early `entries.length === 0` guard and an `<aside aria-label={heading}>` list of descriptive links. Never render an empty heading.

- [ ] **Step 4: Enrich detail routes**

For blog posts, pass `type="article"`, resolved title (`seoTitle ?? title`), image, dates, and a `BlogPosting` graph with `headline`, `description`, `datePublished`, optional `dateModified`, `mainEntityOfPage`, and author. Compute up to three other published posts that share a tag.

For portfolio projects, pass a `CreativeWork` graph with `name`, `description`, `url`, optional image, `dateModified`, and author. Compute up to three other published projects that share a technology. Build relative hrefs from `import.meta.env.BASE_URL`.

- [ ] **Step 5: Rebuild and confirm the verifier is green**

Run: `pnpm check && pnpm build && pnpm verify:seo`

Expected: portfolio detail assertion passes; related-content sections are absent when their computed list is empty.

- [ ] **Step 6: Commit structured entry content**

```bash
git add src/components/RelatedContent.astro 'src/pages/blog/[slug].astro' 'src/pages/portfolio/[slug].astro' scripts/verify-seo.mjs
git commit -m "feat: add structured entry metadata"
```

### Task 7: Align RSS, workflows, and documentation with the public domain

**Files:**
- Modify: `src/pages/rss.xml.ts`
- Modify: `.github/workflows/deploy.yml`
- Modify: `.github/workflows/validate.yml`
- Modify: `README.md`
- Modify: `scripts/verify-seo.mjs`

**Interfaces:**
- RSS URLs derive from `site.origin`.
- Both workflows invoke `pnpm verify:seo` after `pnpm build`.

- [ ] **Step 1: Add a failing RSS-domain assertion**

Append to the verifier:

```js
const rss = await readFile(resolve(dist, 'rss.xml'), 'utf8');
assert.match(rss, /https:\/\/theconstruct\.ing\//);
assert.doesNotMatch(rss, /hciupinski\.github\.io/);
```

- [ ] **Step 2: Run and observe the expected failure**

Run: `pnpm build && pnpm verify:seo`

Expected: it fails because RSS currently hardcodes the GitHub Pages host.

- [ ] **Step 3: Replace the RSS host literal**

Import `site` from `src/config/site.ts`, set `const siteUrl = site.origin`, and use `siteUrl` for every channel and item link. Preserve XML escaping and draft filtering.

- [ ] **Step 4: Run the verifier in CI**

Insert `- run: pnpm verify:seo` immediately after each `pnpm build` in `.github/workflows/deploy.yml` and `.github/workflows/validate.yml`.

- [ ] **Step 5: Document operations**

Replace the GitHub Pages URL in README with `https://theconstruct.ing`. State that GitHub Pages is the host only, document the GitHub Pages custom domain setting and DNS verification, list `https://theconstruct.ing/sitemap-index.xml` for Search Console and Bing Webmaster Tools, and add the English editorial checklist described in the design.

- [ ] **Step 6: Run the full local validation**

Run: `pnpm check && pnpm build && pnpm verify:seo`

Expected: all commands exit 0.

- [ ] **Step 7: Commit operations alignment**

```bash
git add src/pages/rss.xml.ts .github/workflows/deploy.yml .github/workflows/validate.yml README.md scripts/verify-seo.mjs
git commit -m "chore: verify custom-domain SEO output"
```

### Task 8: Perform final generated-output and deployment readiness review

**Files:**
- Modify only if a failed command identifies a specific defect in a preceding task.

**Interfaces:**
- Consumes the completed production build and SEO verifier.
- Produces verified deployment instructions; no external account mutation is performed.

- [ ] **Step 1: Run full repository checks**

Run: `pnpm check && pnpm build && pnpm verify:seo`

Expected: each command exits 0.

- [ ] **Step 2: Inspect representative generated artifacts**

Run:

```bash
rg -n 'canonical|og:|twitter:|application/ld\+json|hciupinski.github.io' dist/index.html dist/portfolio/*/index.html dist/rss.xml
cat dist/robots.txt
```

Expected: custom-domain URLs appear, required metadata exists, and the old host has no matches.

- [ ] **Step 3: Confirm repository state and commit any scoped correction**

Run: `git status --short && git log --oneline -8`

Expected: only intentional SEO commits are present. If a validation defect required a correction, add only its relevant files and commit with `fix: correct generated SEO metadata`.

- [ ] **Step 4: Complete the external handoff**

After deployment, verify GitHub Pages serves `https://theconstruct.ing`, submit `https://theconstruct.ing/sitemap-index.xml` in Google Search Console and Bing Webmaster Tools, inspect the homepage and one portfolio URL, then validate their JSON-LD in Google's Rich Results Test. These account-level actions remain with the site owner.
