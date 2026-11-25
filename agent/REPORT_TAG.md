# Report: Tag (SPEC §9) — 2026-11-24

Status: **reviewed, approved 2026-11-24** (built directly on `02 Components`, #55). Generator: `app/sakai-ng/scripts/figma-tag.mjs` (`npm run figma:tag`). Plan: `agent/PLAN_TAG.md`. Decision #55.

## Built
| Set | Node | Variants | Axes |
|---|---|---|---|
| Tag | 146:192 | 14 | Severity 7 × Rounded 2 |
| Documentation frame | 146:488 | — | properties, extension points, notes, accessibility |
| Stress-test frame (99 Sandbox) | 146:385 | — | long value + icon swap, Light/Dark all severities, primary swap |

Component properties: `Value` (text, default "Tag"), `Show icon` (boolean, off), `Icon` (swap, default Icon/check).

## Mapped inputs
Severity → `severity` (none = omitted) · Rounded → `rounded` · Value → `value` · Show icon + Icon → `icon`.

## Design-only
None.

## Not built / skipped
`style`, `styleClass` (no visual). PrimeNG Tag has no `primary` / `help` severity and no sizes or states.

## Missing tokens
None.

## Visual differences vs screenshots (manifest.csv, 56 captures)
| Item | Figma | Code | Severity |
|---|---|---|---|
| Without icon | 33 × 22 | 32.55 × 21.69 | ≤0.5px, OK |
| With icon | 47 × 22 | 46.55 × 21.69 | ≤0.5px, OK |
| Dark background | Background layer at 16% opacity (bound) | color-mix 16% over the page | same result |

## Accessibility notes (12.25px bold text → 4.5:1)
Light: none 4.84, secondary 6.92, success 4.57, info 5.17, warn 4.52, danger 5.30, contrast 20.17 — **all pass** (success/warn close to the limit). Dark, on the page background #18181b: 7.91–19.90 — all pass. Tag is not interactive: no target size rule; don't use it as a button.

## Binding scan
Verify: **14/14, 0 errors, 0 unbound paints.** Bound: padding, gap, radius (container + Background), background + layer opacity, label + icon colour, icon size, text style, all three properties. Background follows the width when the icon is shown (47).

## Fix log (agent-side, before review)
1. First build call timed out (no change: Figma rolled it back); the identical retry succeeded. No code change.

## Stress test (2026-11-24, frame 146:385 on 99 Sandbox)
Long value "Waiting for approval from finance" + Icon/user: 211 × 22, single line, background follows · all severities with icon in Light and Dark: Dark colours = Dark tokens (background 16% for none/success/info/warn/danger, 100% for secondary/contrast) · primary swap (primary/100 + /700 → indigo): none-tag background #d1fae5 → #e0e7ff, text #047857 → #4338ca, then restored.

## Pilot scoring inputs (PILOT_CHECKLIST 5.3, for Witoon to complete)
- Fix rounds needed (designer review): _pending review_ · agent-side fix rounds: 0 (1 retry)
- Unbound values found at first scan: 0 · States missing or wrong at first pass: 0
- Figma properties matching PrimeNG inputs: 100%
- Visual match (1–5): **5** (Witoon, 2026-11-24) · Designer review time: **2–5 min** · Estimated hand-build time: **< 1 h** (Witoon, 2026-11-24)

## Needs human decision
1. ~~Review gate~~ → approved 2026-11-24, visual 5.
