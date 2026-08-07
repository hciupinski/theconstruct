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
