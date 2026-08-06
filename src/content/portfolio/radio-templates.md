---
title: Atlas opisów radiologicznych
summary: Aplikacja PWA do tworzenia, wyszukiwania i eksportowania wersjonowanych szablonów opisów radiologicznych.
techStack:
  - TypeScript
  - Vite
  - PWA
  - YAML
  - GitHub Pages
links:
  - label: Repository
    href: https://github.com/hciupinski/radio-templates
draft: false
---

Atlas opisów radiologicznych jest statyczną aplikacją ułatwiającą utrzymywanie spójnych szablonów opisów badań. MVP skupia się na USG, ale model danych obejmuje także CT, MR, RTG, MMG, DXA i inne modalności.

Treści są przechowywane jako czytelne pliki YAML: osobno definiowane są szablony, słowniki pojęć i katalog źródeł. Proces builda waliduje dane oraz generuje manifest i wersjonowany bundle dostępny również offline. Każdy szablon może obejmować listę elementów do oceny, opis, wnioski oraz opcjonalne uwagi kliniczne, diagnostykę różnicową i zalecenia. Aplikacja umożliwia też eksport gotowego zestawu do PDF.

Projekt ma charakter edukacyjno-organizacyjny i nie zastępuje lokalnych standardów pracowni ani oceny klinicznej.
