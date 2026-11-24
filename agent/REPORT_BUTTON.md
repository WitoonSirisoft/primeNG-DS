# Report: Button (SPEC §9) — 2026-11-24

Status: **awaiting review gate** (all sets on `99 Sandbox`). Generator: `app/sakai-ng/scripts/figma-button.mjs` (`npm run figma:button -- --set=…`). Decisions #29–#48.

## Built
| Set | Node | Variants | Axes |
|---|---|---|---|
| Button | 74:9 | 864 | Severity 8 × Variant 3 × Size 3 × State 6 × Rounded 2 |
| Button Link | 122:147 | 18 | Size × State |
| Button Plain | 123:150 | 36 | Variant (outlined, text) × Size × State |
| Button Vertical | 124:156 | 36 | Icon position (top, bottom) × Size × State |
| Badge (nested, experimental) | 120:147 | 14 | Severity 7 × Circle 2 |
| Documentation frame | 131:193 | — | properties, extension points, gaps, accessibility |

Component properties: Label (text), Show label, Icon left, Icon right, Icon (swap), Raised, Badge (Button); subsets on Link/Plain/Vertical; Badge: Value (text).

## Mapped inputs
Severity → `severity` · Variant → `variant` (solid = omitted) · Size → `size` (base = omitted) · Rounded → `rounded` · Raised → `raised` · Label → `label` · Show label off → icon-only · Icon left/right → `icon` + `iconPos` · Icon → `icon` · Badge → `badge` + `badgeSeverity` · Link → `[link]` · Plain → `[plain]` · Icon position → `iconPos` · Badge Severity → `severity` (none = omitted) · Badge Value → `value`. Full table: `agent/MAPPING.md` / `.csv` (26 rows, all Deviation = none).

## Design-only
State `default`, `hover`, `focus`, `active` (State `disabled` → `[disabled]`, `loading` → `[loading]`); Badge `Circle` (#47).

## Not built / skipped
- Badge sizes (`badgeSize` small/large/xlarge) — Badge is minimal, base size only (#32).
- `fluid` (= set instance to Fill), `loadingIcon` (= swap the spinner), `type`, `tabindex`, aria inputs — no visual or handled by overrides.
- Exact icon-only width (#44) and Link hover underline (#48) — known gaps, see below.

## Missing tokens
None. Derived variables (no CSS variable): focus-ring radius, line heights (#34). Opacity variables are stored ×100 in Figma (#41).

## Missing screenshots (built from tokens/CSS, checked by binding, not by image)
Raised + outlined/text; loading for outlined/text; outlined/text at small/large; Link and Plain at small/large; Vertical non-default states; Badge severities other than secondary; Dark references were not compared image-by-image (Dark verified by render + binding).

## Visual differences vs screenshots
| Item | Figma | Code | Severity |
|---|---|---|---|
| Size small / base / large | 56.5×27.5 / 66×33 / 74.5×38.5 | 56×27 / 65×33 / 74×38 | ≤1px, OK |
| Button + badge "Notifications" "2" | 124×33 | 123×33 | OK |
| Vertical base | 66×54 | 65×54 | OK |
| Icon-only (#44) | 31.75 / 37 / 42.25 wide | 28 / 35 / 42 | **known gap** (small, base > 2%) |
| Rounded icon-only | 37×33 pill | 35×35 circle | known gap (#44) |
| Default check icon (#43) | 14×14 box | 14.875×14 | sub-pixel |
| Link hover (#48) | colour only | colour + underline | known gap |
| Raised on outlined/text (#42) | no shadow | shadow | known gap |
| Fixed narrow width | label overflows | clipped (overflow:hidden) | document: use Hug/Fill |

## Accessibility notes
- Contrast (WCAG 2.1 AA, 14px label → 4.5:1), from resolved variables: **Dark: all pass. Light fails** (Aura defaults; tokens not changed, SPEC 6.5): white label on primary 2.54, success 2.28, info 2.77, warn 2.80, danger 3.76, help 3.96; outlined/text in the same colours on the surface; Link 2.54. Pass: secondary, contrast, plain, badge.
- **Kept as-is (Witoon, 2026-11-24):** these colours are exactly Sakai's (every token matches the CSS PrimeNG renders: 1,234/1,234, tokens/README.md). **Action for real projects:** the designer or agent that copies this Base for a real project must fix Light-mode contrast in that project's theme (Stage 2 theme file: darker severity shades or dark label colour), never in the Base.
- Target size: smallest button 56.5×27.5, icon-only small 31.75×27.2 — all ≥ 24×24.

## Binding scan
Final verify: 864 + 18 + 36 + 36 variants, **0 errors, 0 unbound paints**. Allowed literals, each recorded:
- Transparent paint (0%, CSS `transparent`): text-button borders, outlined/text Shadow layers, Link (#42).
- Badge Circle padding 0 (CSS `padding: 0`, #47).
- Border width 1px (CSS `1px`, no token) and Focus ring position −3px (= focus-ring offset 2 + width 1; positions can't bind). Focus-ring width itself is bound.
First scan per step: 0 unbound paints; binding defects were caught by the verify (see fix log).

## Fix log (agent-side, before review)
1. Bound strokes drew the black placeholder → paints store their resolved colour.
2. Text buttons 2px small → transparent 1px border (#42).
3. `{...paint}` dropped opacity; Figma ignores paint opacity on bound paints → literal transparent (#42), Raised solid-only (#42 supersedes #40).
4. Opacity variables read as percent → all 34 stored ×100 (#41).
5. Nested-instance sublayers unreadable after reload → build throws if it can't colour an icon; verify checks the rest.
6. Batches: "unexpected error" on long calls → 144 → 72 → 48 per call.
7. Icon box square, bound (#43); Vertical slot min-height removed (66×54).
8. Badge circle variant (#47); Link label formatting spread across the set → no per-variant text formatting, Label property replaced (#48).

## Stress test (2026-11-24)
Saved as frame `Button — Stress test` **144:161 on 99 Sandbox** (rebuilt on request, kept): long label + Icon/user + badge "12" (pill) at small/base/large = 202.8×27.5 / 229×33 / 254.3×38.5 · Raised primary/secondary/danger · Dark row (Button solid/outlined/text hover, Link, Plain, Vertical: all colours = Dark tokens) · primary swap emerald→indigo: background + focus ring #10b981 → #6366f1 → restored #10b981 · narrow fixed width 60: label overflows (no clip). Results below are from the first run.
Long label + icon swap + badge grows at every size, never clipped · Dark mode correct for every set · Primary swap (Semantic primary/* emerald→indigo) restyled everything with zero component edits, then restored · Narrow fixed width overflows (documented).

## Pilot scoring inputs (PILOT_CHECKLIST 5.3, for Witoon to complete)
- Fix rounds needed (designer review): _pending review_ · agent-side fix rounds: 8 (above)
- Unbound values found at first scan: 0 paints; 4 binding defects found by verify (items 1–4)
- States missing or wrong at first pass: disabled/loading opacity (all), outlined/text hover/active backgrounds, text border
- Figma properties matching PrimeNG inputs: 100% of visual inputs mapped (State partly design-only)
- Visual match (1–5): **4** (Witoon, 2026-11-24) · Designer review time: _designer_ · Estimated hand-build time: _designer_

## To add later
- `Rounded` axis on Button Plain (Sakai uses `text + rounded + plain`; deferred, #49).
- Exact icon-only width/circle (#44): kept as a gap for now; revisit with Plain Rounded (#49). Note: icon-only HEIGHT already matches code (slot min-height = line height, #34).

## Needs human decision
1. Review gate: approve Button family → move all five sets + doc frame to `02 Components` (generator then points there).
2. ~~Light-mode contrast~~ → kept (matches Sakai); project themes must fix it (note above and in the doc frame).
3. ~~Icon-only width~~ → gap kept for now (#49).
4. ~~Button Plain~~ → kept: Sakai uses it (table row toggler, dashboard ⋯ menus: rounded text plain icon-only).
