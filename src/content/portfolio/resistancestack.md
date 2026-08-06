---
title: ResistanceStack
summary: Narzędzie CLI do audytu, wzmacniania i monitorowania bezpieczeństwa istniejących aplikacji na VPS.
techStack:
  - Go
  - SSH
  - Docker Compose
  - GitHub Actions
  - Grafana
  - Loki
links:
  - label: Repository
    href: https://github.com/hciupinski/resistancestack
draft: false
---

ResistanceStack pomaga małym zespołom bezpiecznie uporządkować środowisko produkcyjne bez przebudowy istniejącego procesu wdrożeń. Jest skierowany do aplikacji już działających na jednym lub kilku serwerach VPS, gdzie liczą się szybka diagnoza, konkretne rekomendacje i minimalna ingerencja w system.

CLI najpierw inwentaryzuje host i repozytorium, a następnie wykonuje audyt oraz proponuje priorytetowe działania. Moduły można uruchamiać niezależnie: hardening SSH, UFW, fail2ban i aktualizacji bezpieczeństwa; obserwowalność sygnałów runtime i bezpieczeństwa; a także generowanie workflowów GitHub Actions do skanowania zależności, kontenerów, SBOM i sekretów. Projekt zawiera tryby dry-run oraz rollback ostatniej zmiany na hoście.
