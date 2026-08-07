# The Construct

Statyczne portfolio i blog budowane przez Astro, hostowane na GitHub Pages pod
publicznym adresem `https://theconstruct.ing`. Treść jest wersjonowana w
repozytorium jako Markdown — publikacja następuje po mergu commita do `main`.

## Lokalny rozwój

Wymagany jest Node.js 22.13+ oraz pnpm 11+.

```sh
pnpm install
pnpm dev
```

Przed wysłaniem zmian uruchom:

```sh
pnpm check
pnpm build
```

## Dodawanie wpisu na blogu

Dodaj plik `src/content/blog/<slug>.md`. Nazwa pliku staje się publicznym
adresem wpisu: `/blog/<slug>/`.

```md
---
title: Title of the post
excerpt: A short description used on the listing and for SEO.
publishedAt: 2026-08-06
tags:
  - Architecture
  - Cloud
draft: false
---

Markdown content goes here.
```

Wymagane pola to `title`, `excerpt`, `publishedAt` i `tags`. Opcjonalne pola:
`updatedAt`, `coverImage` i `draft`. Wpis z `draft: true` jest sprawdzany przy
buildzie, ale nie jest publikowany ani widoczny w RSS.

## Dodawanie projektu

Dodaj plik `src/content/portfolio/<slug>.md`. Wymagane pola to `title`,
`summary`, `techStack` i `links`:

```md
---
title: Project title
summary: One-sentence project description.
techStack:
  - Astro
  - TypeScript
links:
  - label: Repository
    href: https://github.com/example/project
draft: false
---

Longer project description in Markdown.
```

`links` jest listą obiektów z polami `label` i pełnym adresem `href`.

## Publikacja

Workflow GitHub Actions waliduje pull requesty i po pushu do `main` buduje oraz
publikuje katalog `dist` na GitHub Pages. Jednorazowo w ustawieniach repozytorium
wybierz **Settings → Pages → Source: GitHub Actions**.

GitHub Pages jest wyłącznie hostingiem. W **Settings → Pages** ustaw Custom
domain na `theconstruct.ing` i skonfiguruj DNS zgodnie z instrukcją GitHub
Pages dla własnej domeny. Canonicale, sitemap, RSS i grafiki do udostępniania
muszą wskazywać wyłącznie `https://theconstruct.ing`.

Sitemap jest generowany podczas buildu pod
`https://theconstruct.ing/sitemap-index.xml`, a kanał RSS jest dostępny pod
`https://theconstruct.ing/rss.xml`.

## SEO po publikacji

Po potwierdzeniu własności domeny dodaj sitemapę
`https://theconstruct.ing/sitemap-index.xml` w Google Search Console oraz Bing
Webmaster Tools. Następnie użyj inspekcji adresu URL dla strony głównej i
jednego projektu, aby potwierdzić canonicale oraz indeksowanie.

Przed publikacją nowego wpisu blogowego upewnij się, że jest po angielsku, ma
unikalny tytuł i zwięzły excerpt, jednoznaczną strukturę nagłówków, linki do
powiązanych projektów lub wpisów oraz opcjonalny obraz `coverImage`, gdy
pomaga on czytelnikowi. Ustaw `draft: false` dopiero, gdy wpis jest gotowy do
indeksowania.
