---
title: Budget App
summary: A local-first application for budget planning, monthly execution, and tracking accounts and investments.
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

Budget App is a local-first application for managing a household budget with secure owner access. It connects an annual financial plan to a monthly execution workspace, helping planned amounts translate consistently into actions and outcomes.

The system combines a Next.js interface, an ASP.NET Core API with JWT authentication, a background worker, and PostgreSQL, all running through Docker Compose. Beyond budgeting, it supports bank, savings, brokerage, and cash accounts; transfers; planned-versus-actual balance snapshots; an investment portfolio; and savings goals. An audit panel makes recent data changes traceable.
