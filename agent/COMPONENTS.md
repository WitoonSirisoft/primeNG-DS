# COMPONENTS.md: Pilot build order and status

Status values: `not started` | `in progress` | `reviewed`
Rules: build one component at a time with a review gate (PILOT_CHECKLIST 5.1). Nothing enters `02 Components` until status is `reviewed`.

| # | Figma component | PrimeNG selector | Status | Owner | Fix rounds | Figma link | Report | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | Button | `<p-button>` | reviewed | Witoon | 6 (Day 5, see report) | 02 Components: Button 74:9, Link 122:147, Plain 123:150, Vertical 124:156, Badge 120:147 | agent/REPORT_BUTTON.md | 864 + 18 + 36 + 36 + Badge 14; doc frame 131:193; stress frame 144:161 (99 Sandbox); approved 2026-11-24 (visual 4) |
| 2 | InputText | `pInputText` | reviewed | Witoon | | 02 Components: InputText 138:192 | agent/REPORT_INPUTTEXT.md | 144 built + verified 0 errors (2026-11-24); doc frame 142:191, stress frame 141:191 (99 Sandbox); approved 2026-11-24 (visual 5) |
| 3 | Tag | `<p-tag>` | reviewed | Witoon | | 02 Components: Tag 146:192 | agent/REPORT_TAG.md | 14 built + verified 0 errors (2026-11-24); doc frame 146:488, stress frame 146:385 (99 Sandbox); approved 2026-11-24 (visual 5) |
