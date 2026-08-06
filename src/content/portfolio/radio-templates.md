---
title: Radiology Reporting Template Atlas
summary: A PWA for creating, searching, and exporting versioned radiology reporting templates.
techStack:
  - TypeScript
  - Vite
  - PWA
  - YAML
  - GitHub Pages
links:
  - label: Repository
    href: https://github.com/hciupinski/radio-templates
  - label: Website
    href: https://hciupinski.github.io/radio-templates/
draft: false
---

Radiology Reporting Template Atlas is a static application for maintaining consistent examination-reporting templates. The MVP focuses on ultrasound, while its data model also supports CT, MRI, X-ray, mammography, DXA, and other modalities.

Content is kept in readable YAML files: templates, shared terminology, and a source catalogue are defined separately. The build process validates the data and generates a manifest plus a versioned bundle available offline. Each template can include an assessment checklist, report text, impression, and optional clinical notes, differential diagnosis, and follow-up guidance. The application can also export the finished collection to PDF.

The project is an educational and organizational tool; it does not replace local departmental standards or clinical judgement.
