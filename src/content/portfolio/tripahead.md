---
title: TripAhead
summary: An adventure travel platform for planning trips, managing bookings and equipment, and generating trip documentation.
techStack:
  - .NET
  - ASP.NET Core
  - .NET Aspire
  - Angular
  - TypeScript
  - Docker
  - Keycloak
links:
  - label: Website
    href: https://dev.tripahead.fun
draft: false
---

TripAhead is an adventure travel platform for people who want to surf, snowboard, skate, and plan the next active escape. It is designed around the practical flow of offering trips: managing an itinerary and rentable equipment, making reservations, and preparing the related invoices and contracts.

The solution is structured as separate Trips, Orders, and Payments services, with shared domain foundations and a dedicated Angular web application. ASP.NET Core APIs and .NET Aspire provide the backend and local service orchestration, while Docker supports repeatable environments. Authentication is handled through Keycloak. The roadmap expands the platform with administration and user modules, booking management, document generation, email confirmation, and deployment to Azure Container Registry.
