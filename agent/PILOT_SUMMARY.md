# Pilot summary: PrimeNG Base DS (Button, InputText, Tag) — 2026-11-24

**Decision (Witoon, 2026-11-24, #60): SCALE UP** — goal: enough components for a complete CMS web app. Deviation dry run (6.5): 3 / 3 agree.

## Scores (Day 5, PILOT_CHECKLIST 5.3)
| Measure | Button | InputText | Tag |
|---|---|---|---|
| Fix rounds needed (designer review) | 0 | 0 | 0 |
| Agent-side fix rounds (before review) | 8 | 2 | 0 |
| Unbound values at first scan | 0 | 0 | 0 |
| States missing or wrong at first pass | 3 groups (disabled/loading opacity, outlined/text hover/active, text border) | 0 | 0 |
| Figma properties matching PrimeNG inputs | 100% of visual inputs | 100% | 100% |
| Visual match (1–5) | 4 | 5 | 5 |
| Designer review time | 20–30 min | 10–15 min | 2–5 min |
| Estimated hand-build time | 4–6 h | 2–3 h | < 1 h |

## Theming, library, reproducibility (Day 6, 6.3)
| Measure | Result |
|---|---|
| Theme-swap test A / B passes | Y / Y |
| Elements that did not theme | 0 (3 Aura component literals, now set in the theme files, #58) |
| Re-run update test passes | Y (round-trip fingerprint = Base) |
| Library update reaches Custom file | Y |
| Overrides survive library update | Y |
| Brand-on-library approach | **b — fork per client** (#59); a = Enterprise only |
| Renames needed after first publish | 0 |
| Deviation dry run: designer/developer agree (of 3) | **3 / 3** (DEVIATION_DRY_RUN.md) |

## Why "scale up"
Gates pass: 0 unthemed elements (≤ 2) and the re-run test passes. Day 5 thresholds met: 0 designer fix rounds, all visual inputs mapped, visual match 4–5, review time (≈ 0.5–1 h for all three) far below hand-building (≈ 7–10 h).

## Top 5 spec changes learned (folded into SPEC.md v0.5)
1. **Figma value rules:** opacity variables stored in percent (×100, #41); CSS `transparent` as a literal 0% paint (#42); bound paints store their resolved colour; text layers `autoRename=false`.
2. **No per-variant formatting on property-bound text** — it spreads to every variant (#48); only fills differ per variant.
3. **Derived variables must follow themed values** (#57 fix), and **theme files must also set Aura's fixed component values** (`button.rounded-border-radius`, `tag.padding`, `badge.padding`, #58).
4. **Build from generators, review per component:** generator first (validated in Node), build directly on `02 Components`, one review gate per component; per-axis review only for very large sets (#39 → #52).
5. **Contrast:** the Base keeps Aura/Sakai colours 1:1 even where Light mode fails WCAG (#49a); every project theme must fix them (noted in each doc frame).

## Cost to scale (from the pilot; agent time and tokens not measured)
- New component: write/adapt a generator + plan + report; designer review ≈ 5–30 min per component.
- Per client: one fork + one theme file; per Base update: one re-run + scan + publish **per fork**.

## Putting a brand on top of the library (flow, tested in 6.2)
```
PrimeNG Base (library)  →  copy  →  "Base — Client X" (library)  →  used by  →  Client X project files
   source of truth          one per client, never edited by hand         designers' screens
```

### A. Starting a new client project
| # | Who | Step |
|---|---|---|
| 1 | Designer | **Write the brand as a theme file:** copy `tokens/themes/test-brand-a.json` → `tokens/themes/client-x.json`; fill primary, surface, radius scale, spacing, font, the 3 component values (Button rounded radius, Tag padding, Badge padding) and severity colours if they clash with the brand. Values only. |
| 2 | Designer | **Duplicate the Base file** in Figma → rename "Base — Client X" (team project). |
| 3 | Agent | **Apply the brand:** `npm run figma:plan -- --theme=client-x.json --out=…`, then `figma-theme-diff.mjs` → one small call with only the brand values; run it on the copy; scan every variant for anything that didn't change. |
| 4 | Designer | **Review** the copy in Light and Dark. |
| 5 | Designer | **Publish** the copy as a library ("Base — Client X v1.0"). |
| 6 | Designer | **Create project files** and add **only** the "Base — Client X" library. |
| 7 | Designer | **Design with instances**; use the library's text styles and variables for your own frames and text too; change labels/icons/text with overrides; **never detach**. |
If a project already started on the plain Base: Assets → book icon → Base library → **Swap library** → "Base — Client X" (tested: everything switches, overrides kept).

### B. When the Base changes later (for each client fork)
| # | Who | Step |
|---|---|---|
| 1 | Agent | Re-run on the fork whatever changed: **component** → its generator calls (rebuild in place, keys stay, project files stay linked) · **token** → Base variable calls **then** `10-theme-values.js` for the client (order matters) · **new component** → its generator (picks up the brand automatically). |
| 2 | Agent | Scan and verify the fork. |
| 3 | Designer | Publish the fork ("v1.1"). |
| 4 | Designer | In each project file: Assets → book icon → Updates → **Update all** (overrides kept). |
Project files never use the Base directly: **Base → client fork → project files**.

### Rules
- Never edit a client fork by hand: the next Base update re-runs the generators. Brand changes go into `client-x.json` and are re-applied.
- The brand lives in one file (`client-x.json`); developers need the same values for the PrimeNG theme in code (converting it into a PrimeNG preset is not built yet — Stage 2/3).
- Cost grows with the number of clients (one re-run + scan + publish per fork per Base update). With many clients, extended collections (Enterprise) or brand modes (c) would reduce it.

## Open items
1. ~~6.5 deviation dry run~~ → 3 / 3 agree. Finding: the Base Button has one label → a two-line button (Level 2) can't be built from Base instances without a Custom component; consider a **content slot** on Button in the next Base version.
2. ~~Fold the top 5 lessons into SPEC.md~~ → done (v0.5).
3. ~~Final decision~~ → scale up (#60).

Sources: REPORT_BUTTON.md, REPORT_INPUTTEXT.md, REPORT_TAG.md, REPORT_THEME_SWAP.md, REPORT_LIBRARY.md, DECISIONS #36–#59.
