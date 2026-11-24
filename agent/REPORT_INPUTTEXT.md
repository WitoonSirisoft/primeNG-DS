# Report: InputText (SPEC §9) — 2026-11-24

Status: **reviewed, approved 2026-11-24** (built directly on `02 Components`, #52). Generator: `app/sakai-ng/scripts/figma-inputtext.mjs` (`npm run figma:inputtext`). Plan: `agent/PLAN_INPUTTEXT.md`. Decisions #50–#53.

## Built
| Set | Node | Variants | Axes |
|---|---|---|---|
| InputText | 138:192 | 144 | Size 3 × Variant 2 × State 4 × Invalid 2 × Content 3 |
| Stress-test frame (99 Sandbox) | 141:191 | — | long value, Fill 400, Dark, focus during primary swap |
| Documentation frame | 142:191 | — | properties, extension points, gaps, accessibility |

Component properties: `Placeholder` (text), `Value` (text). Placeholder variants use `Placeholder`; value and empty variants use `Value`.

## Mapped inputs
Size → `pSize` (base = omitted, #17) · Variant → `variant` (outlined = omitted) · State disabled → `[disabled]` · Invalid → `[invalid]` / Angular forms `ng-invalid ng-dirty` (#53) · Placeholder → `placeholder` · Value → `value` / `ngModel` · Fill width → `fluid`.

## Design-only
Long value "…" (#54); State `default`, `hover`, `focus`; Content `placeholder` / `value` / `empty` (code shows whichever applies); default width per size (browser default `<input size=20>`: 149.5 / 172 / 194.5, no Aura token).

## Not built / skipped
- `readonly`: no Aura style, looks like default (#51). Disabled-with-value is covered by `State=disabled, Content=value`.
- Focus ring (outline): Aura sets width 0 / style none → nothing to draw. `inputtext.focus-ring.shadow` = none → shadow removed on focus.
- Label + helper text: `Form row` pattern on `03 Patterns` (#18), later.
- `fluid` (= set instance to Fill), `type`, `name`, aria inputs — no visual or handled by overrides.

## Missing tokens
None. Width per size is a design-only literal (no token in Aura).

## Visual differences vs screenshots (manifest.csv, 146 captures)
| Item | Figma | Code | Severity |
|---|---|---|---|
| Size small / base / large | 149.5×27.5 / 172×33 / 194.5×38.5 | 149.5×27.19 / 172×32.8 / 194.5×38.39 | ≤0.3px, OK |
| Fluid 400 | 400×33 | 400×32.8 | OK |
| Long value | ends with "…" | text clipped at the edge, no "…" (native `<input>`) | design-only, kept (#54) |
| Invalid + hover/focus | red border kept (#53) | `[invalid]` attribute: hover/focus colour replaces red; Angular forms: red kept | documented |
| Base / outlined / value / default, Light | matches screenshot | — | OK |

## Accessibility notes (resolved variables, on the input's own background)
| Pair | Light | Dark | Target |
|---|---|---|---|
| Value text / background (outlined · filled) | 10.35 · 9.90 | 19.90 · 14.89 | 4.5 ✓ |
| Placeholder / background (outlined · filled) | 4.76 · 4.55 | 7.76 · 5.81 | 4.5 ✓ |
| Invalid placeholder / background | 4.83 | 7.19 | 4.5 ✓ |
| Disabled text / disabled background | 3.86 | 4.07 | exempt (disabled) |
| Border / background (default · hover · focus · invalid) | **1.48** · 2.56 · 2.54 · 2.77 | 2.57 · 4.12 · 10.35 · 10.48 | 3:1 (non-text, WCAG 1.4.11) |
- **Light borders are below 3:1** (default 1.48; focus 2.54; invalid 2.77), Dark default 2.57. These are Aura/Sakai defaults, kept as-is like Button (#49a). **Action for real projects:** the designer or agent copying this Base must raise the field border / focus contrast in the project theme.
- Invalid is shown by colour only (border + placeholder); real forms should add an error message (Form row pattern, #18).
- Target size: smallest input 149.5×27.5 — ≥ 24×24.

## Binding scan
Verify: **144/144, 0 errors, 0 unbound paints.** Bound: padding, radius, background, border, text colour, text style, shadow (effect style), text property. Allowed literals, each recorded: border width 1px (CSS `1px`, no token), width per size (above), text opacity 0 for `Content=empty` (keeps the line height).

## Fix log (agent-side, before review)
1. Verify found 144 "no Text": Figma renamed each text layer after its content → generator sets `autoRename=false` and names the layer `Text`; existing layers renamed.
2. New-set position was measured after the set existed → now measured before (set placed below everything; no overlap occurred).

## Stress test (2026-11-24, frame 141:191 on 99 Sandbox)
Long value: width stays 172, single line, truncated · Fill in a 400 row: 400×33 · Dark (explicit mode): all colours match the Dark tokens (bg #09090b, border #52525b, focus #34d399, disabled #3f3f46, invalid #fca5a5 / #f87171) · Primary swap emerald→indigo: focus border turned #6366f1 with zero component edits, then restored to #10b981.

## Pilot scoring inputs (PILOT_CHECKLIST 5.3, for Witoon to complete)
- Fix rounds needed (designer review): _pending review_ · agent-side fix rounds: 2 (above)
- Unbound values found at first scan: 0 · States missing or wrong at first pass: 0
- Figma properties matching PrimeNG inputs: 100% of visual inputs mapped (State/Content partly design-only)
- Visual match (1–5): **5** (Witoon, 2026-11-24) · Designer review time: _designer_ · Estimated hand-build time: _designer_

## Needs human decision
1. ~~Long value~~ → keep "…", documented (#54).
2. Review gate: approve InputText (status → reviewed).
3. ~~Stress-test frame~~ → kept (141:191).
