---
title: Budget App
summary: Local-first aplikacja do planowania budżetu, realizacji miesięcznych działań oraz śledzenia kont i inwestycji.
techStack:
  - Next.js
  - ASP.NET Core
  - .NET 10
  - PostgreSQL
  - Docker Compose
  - JWT
links:
  - label: Repository
    href: https://github.com/hciupinski/budget
draft: false
---

Budget App to aplikacja typu local-first, zaprojektowana do zarządzania domowym budżetem z bezpiecznym dostępem właściciela. Łączy roczny plan finansowy z miesięcznym obszarem realizacji, dzięki czemu zaplanowane kwoty można konsekwentnie przekładać na faktyczne działania i wyniki.

System składa się z interfejsu Next.js, API w ASP.NET Core z uwierzytelnianiem JWT, workera tła i bazy PostgreSQL, uruchamianych wspólnie przez Docker Compose. Oprócz budżetowania obsługuje konta bankowe, oszczędności, rachunki brokerskie, transfery, migawki planowanych i rzeczywistych sald, portfel inwestycyjny oraz cele oszczędnościowe. Panel audytu pozwala śledzić ostatnie zmiany w danych.
