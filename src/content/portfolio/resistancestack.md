---
title: ResistanceStack
summary: A CLI for auditing, hardening, and monitoring the security of existing applications hosted on VPS infrastructure.
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

ResistanceStack helps small teams safely improve production environments without rebuilding their existing deployment process. It is designed for applications already running on one or more VPS hosts, where fast diagnosis, actionable recommendations, and minimal system intrusion matter.

The CLI first inventories the host and repository, then audits them and prioritizes next actions. Its modules can be run independently: hardening SSH, UFW, fail2ban, and security updates; observing runtime and security signals; and generating GitHub Actions workflows for dependency, container, SBOM, and secret scanning. The project also includes dry-run modes and rollback for the latest host change.
