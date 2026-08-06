# SEO Foundation Design

## Goal

Make `https://theconstruct.ing` the only indexable public identity of The Construct and provide search engines and social platforms with complete, consistent, semantic content for an English-language developer portfolio and blog.

## Constraints

- Public canonical origin is exactly `https://theconstruct.ing`.
- GitHub Pages is hosting only; `hciupinski.github.io/theconstruct` must not be emitted as a canonical, sitemap, RSS, or social URL.
- The public site language is English (`en`) only; no `hreflang` variants are emitted.
- The existing Astro static-site architecture and GitHub Pages deployment remain in place.
- Existing Markdown content remains the publishing interface; no CMS or analytics vendor is added in this change.
- No external runtime SEO dependency is introduced.

## Design

### Site identity and metadata

Create `src/config/site.ts` as the sole source of public site facts: name, origin, default title, description, author name, GitHub URL, LinkedIn URL, and English locale. Astro configuration, the RSS route, structured data, and document head components will consume these values rather than duplicate hostnames.

Extend `BaseLayout.astro` with optional page SEO properties, while preserving its current required `title` and `description` API. The layout will produce a canonical URL from the configured origin and current path, the standard description and viewport tags, Open Graph and Twitter metadata, and an index/follow robots directive by default. Detail pages will pass their content type, cover image, and publication/update dates when available. The homepage will use the same layout rather than maintain an independent document head.

### Crawl discovery and sharing assets

Add static `public/robots.txt` pointing to `https://theconstruct.ing/sitemap-index.xml`; the existing Astro sitemap integration remains responsible for sitemap generation. Add a minimal web manifest, SVG favicon, and a raster default social image in `public/` so browsers and social previews have stable first-party assets. RSS item and channel URLs will use the configured origin.

### Semantic page content

The homepage will retain the Matrix experience but add a visible, server-rendered English introduction with one `h1`, a concise positioning statement, and descriptive links to the Architect, Portfolio, and Blog pages. The visual scene is decorative to assistive technologies, and motion respects `prefers-reduced-motion`; therefore core content neither depends on JavaScript hydration nor waits for the animation.

Add a reusable JSON-LD component that safely serializes objects. The global layout emits `WebSite` and `Person`, using the GitHub and LinkedIn profiles as `sameAs`. Blog detail pages emit `BlogPosting`; portfolio details emit `CreativeWork`. JSON-LD uses the canonical URL, title, description, author, and the dates/images available in content data.

### Content model and internal linking

Extend collection schemas with optional `seoTitle` and `coverImage` fields while retaining backward compatibility. A new static tag route (`/blog/tags/<tag>/`) lists published posts for each tag; tags in list and article views become crawlable internal links. Blog and portfolio detail pages show a limited set of relevant, published related entries based on matching tags or technologies. Existing chips remain presentational only where no destination is available.

Portfolio Markdown will be kept as a concise project record, with future content authored in English using the existing required summary and a clear problem, solution, role, technology, and outcome structure. New blog posts are the primary acquisition mechanism; publication requires a unique English title, audience-focused excerpt, meaningful heading structure, accurate internal links, and an illustrative cover image where one adds value.

### Validation and operations

Introduce a zero-dependency build-time SEO verification script using Node's standard library. It runs after Astro produces `dist` and asserts that representative generated pages contain the custom-domain canonical URL, essential metadata, JSON-LD, and no GitHub Pages hostname. It also asserts `robots.txt`, the sitemap, RSS, manifest, and default social image exist in the build output. Expose it through a `pnpm` script and run it in both GitHub Actions workflows after `pnpm build`.

Update the README with the custom-domain deployment rule, required GitHub Pages/DNS configuration, the exact URLs to submit to Google Search Console and Bing Webmaster Tools, and an editorial SEO checklist. Search Console and Bing registration, URL inspection, and performance monitoring are account-level follow-up tasks; the repository will document but cannot perform them.

## Error Handling and Edge Cases

- A content item without `coverImage`, `updatedAt`, or `seoTitle` uses the default image, publication date, and normal title without invalid metadata.
- Draft entries remain excluded from pages, sitemap routes, tag routes, related-content blocks, and RSS.
- Empty tag intersections do not render an empty related-content section.
- User-provided text serialized into JSON-LD must not terminate the script element or introduce HTML.
- All internal generated URLs retain Astro's trailing slash policy.

## Validation

- Run `pnpm check` and `pnpm build`.
- Run the SEO verification script against `dist`.
- Inspect generated homepage, blog/project detail page, sitemap, RSS, and robots output.
- Validate representative JSON-LD with Google's Rich Results Test after deployment.
- Submit `https://theconstruct.ing/sitemap-index.xml` to Google Search Console and Bing Webmaster Tools after the custom domain is confirmed in GitHub Pages.

## Out of Scope

- Polish localization, translated routes, and `hreflang`.
- Paid SEO, backlink acquisition, and social media campaigns.
- A CMS, comments platform, cookie/analytics tooling, or server-side rendering.
