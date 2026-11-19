# VERSIONS.md

Recorded: 2026-11-19 (Pilot Day 1)
Source: `app/sakai-ng/package.json` (declared ranges) and `app/sakai-ng/node_modules/*/package.json` (installed versions).

> **Freeze rule (PILOT_CHECKLIST 1.2):** these versions are fixed for the pilot. A version change mid-pilot invalidates screenshots and mappings. Update this file and note it in `agent/DECISIONS.md` if anything changes.

## Core

| Package | Declared | Installed | Notes |
|---|---|---|---|
| Sakai (`sakai-ng`) | 21.0.0 | 21.0.0 | Template version; MIT license (PrimeTek) |
| Angular (`@angular/core` and runtime packages) | ^21.2.26 | 21.2.26 | Updated from 21.0.6 on Day 2 (security fixes); see DECISIONS #11 |
| Angular CLI (`@angular/cli`) | ^21 | 21.2.30 | |
| PrimeNG (`primeng`) | ^21.0.2 | 21.0.2 | Verify all input names / allowed values against this version |
| Theme package (`@primeuix/themes`) | ^2.0.0 | 2.0.2 | |
| Preset | — | **Aura** | `app.config.ts`: `providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } })` |
| Icons (`primeicons`) | ^7.0.0 | 7.0.0 | |
| `@angular/cdk` | ^21.2.14 | 21.2.14 | Required PrimeNG peer; declared explicitly on Day 2 |

## Supporting

| Package | Declared | Installed |
|---|---|---|
| TypeScript | ~5.9.3 | 5.9.3 |
| Tailwind CSS | ^4.1.11 | 4.3.5 |
| `@tailwindcss/postcss` | ^4.1.11 | 4.3.5 |
| `tailwindcss-primeui` | ^0.6.1 | 0.6.1 |
| RxJS | ~7.8.0 | 7.8.2 |

## Rendering baseline (affects tokens and screenshots)

- Root font size: **14px** (Sakai `_core.scss`: `html { font-size: 14px }`). PrimeNG sizes are in rem, so 1rem = 14px in Sakai and Storybook.
- Font: Lato, loaded from `fonts.cdnfonts.com` (Sakai `index.html`, mirrored in `.storybook/preview-head.html`).

## Tooling (fill in)

| Tool | Version |
|---|---|
| Node.js | 22 (pinned in `.nvmrc` / `.node-version`; Angular 21 requires ^20.19 \|\| ^22.12 \|\| >=24) — exact: `[run: node -v]` |
| npm | `[run: npm -v]` |
| Playwright (screenshot capture) | 1.65.1 (uses its bundled Chromium) |
| Storybook (`storybook`, `@storybook/angular-vite`) | 10.6.7 (Vite builder, `@analogjs/vite-plugin-angular` 2.9.7, `vite` 8.3.8) |
