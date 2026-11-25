# Report: Batch 1 · Group D (Message) — 2026-11-25

Status: **reviewed and approved 2026-11-25 — visual 5** (on `02 Components`). Decisions #76–#79.
Generator: `scripts/figma-message.mjs` (`npm run figma:message`), calls `15-message-1.js` + `15-message-verify-1.js`. Update in place (#68).

## Built
| Set | Node | Variants | Notes |
|---|---|---|---|
| Message | 218:615 | 54 | Severity 6 × Variant 3 (default, outlined, simple) × Size 3; properties Text, Show icon, Closable; icon per severity (#78/#79) |
| Doc frame | 219:2176 | — | |
| Stress / compare frame (99 Sandbox) | 219:1401 | — | all severities × variants, sizes, icon, closable, Fill 400 with long text, Dark |
New: text styles `Message/Text sm|base|lg` (Base now 25 text styles). No new variables (1,091, fingerprint unchanged).

## Sizes vs browser
| | Figma | Browser |
|---|---|---|
| default / outlined sm / base / lg | 109.5 × 25.5 / 127 × 31 / 143.5 × 36.5 | 109.44 × 25.19 / 126.08 × 30.8 / 142.72 × 36.39 |
| simple base | 106 × 17 | 105.08 × 16.8 |
| with icon / closable | 149.75 × 31 / 158.5 × 38.5 | 148.83 × 30.8 / 157.58 × 38.5 |
Within 1 px (text-box rounding, as InputText).

## Visual check
All six severities in default, outlined and simple; icon; closable — match the captures. Border = CSS outline → Figma stroke OUTSIDE on an absolute Border layer (not part of the size, like the browser).

## Binding scan
Verify 54: **0 unbound paints**; all bindings correct (padding, gap, text style, colours, icon/close sizes, background + border opacity, border width, shadow). The only errors in the first verify were the icon defaults → see #79.

## Fix log
1. **Per-severity icon + Icon swap property is impossible in Figma**: a layer linked to an instance-swap property is reset to the property's single default when the file saves (an in-call read looked fine; the verify after save showed info-circle everywhere). Witoon chose per-severity icons without an Icon property (#79): property removed, icons set, re-read after save = correct.
2. The update-in-place helper briefly got a "keep the variant's icon" tweak for this; reverted (Figma overrides it on save).
3. Test frames clipped the 1px outside border (rows hug the messages) → clipping off; documented: a clipping parent cuts the outline, as overflow: hidden does in the browser.

## Accessibility (computed, text 14px needs 4.5:1)
| Light (default / outlined / simple) | Dark |
|---|---|
| success 3.16 / 3.30 / 3.30 ⚠ | success 5.92 / 7.77 / 7.77 |
| info 4.77 / 5.17 / 5.17 | info 3.96 ⚠ / 4.82 / 4.82 |
| warn 2.84 / 2.94 / 2.94 ⚠ | warn 6.73 / 9.24 / 9.24 |
| error 4.44 ⚠ / 4.83 / 4.83 | error 3.98 ⚠ / 4.71 / 4.71 |
| secondary 6.92 / 4.76 / 4.76 | secondary 10.08 / 6.91 / 6.91 |
| contrast 17.06 / 20.17 / 20.17 | contrast 19.90 / 17.72 / 17.72 |
Aura/Sakai defaults, kept in the Base; projects must raise them in their theme.

## Not built
Close button hover / focus (#77), enter/leave animation, life (auto-hide).

## Needs Witoon's decision
1. Visual score (1–5) for Message — and for Group C (Select, still open).
