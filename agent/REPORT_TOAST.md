# Report: Batch 2 · Toast — 2026-11-25

Status: **reviewed and approved 2026-11-26 — visual 5** (on `02 Components`). Decision #94.
Generator: `scripts/figma-toast.mjs` (`npm run figma:toast`) → `21-toast-1.js`; example `21-toast-example.js`. Update in place (#68).
Story: `toast.stories.ts` (severity, detail, closable; sticky). Captures: 9 × Light + Dark.

## Built
| Set | Node | Variants | Notes |
|---|---|---|---|
| Toast | 271:9918 | 6 | Severity; Summary, Detail, Show detail, Show icon, Closable |
| Doc frame | 273:14861 | — | |
| Examples (99 Sandbox) | 273:14153 (Sakai texts), 273:14244 (screen stack top-right), 273:14306 (stress Light + Dark) | — | |
Tokens: toast 63 → 1,341 variables, fingerprint 979b2158; effect styles +8 (34), drawn behind (show shadow behind node); text styles Toast/Summary + Toast/Detail (30).

## Sizes vs browser
| | Figma | Browser |
|---|---|---|
| with detail | 350 × 62.01 | 350 × 61.48 |
| no detail | 350 × 47.01 | 350 × 46.8 |
Text boxes: Figma 17 / 15 vs browser 16.8 / 14.68 (Lato line boxes).

## Checks
All colours bound (severity color, detail-color, background + background-opacity, border + border-color-opacity), radius, padding, gaps, icon sizes, close button size; blur bound to toast/blur; shadow effect styles.

## Fix log
1. export-tokens typed toast.blur ("1.5px") as string → paths with 'blur' typed as dimension.
2. figma:plan call files renumbered when components needed a 4th call (06-components-4, 07-effect-styles, 08-text-styles); old 06-effect-styles.js / 07-text-styles.js deleted 2026-11-26.
3. Show detail off: Figma keeps a hug frame's size when its only child is hidden → 0.01 spacer in the Detail wrapper (the 7px gap stays, as in code: 46.8).
4. Close button: margin -25% / right -25% of its 24.5 wrapper → button offset (6.125, −6.125); wrapper height 18.375 (75%) so it does not add height (47.5 → 47.01).
5. Text property defaults are neutral ("Toast Summary" / "Toast detail") — one default per property; Sakai texts in the example.

## Accessibility (summary / detail on the blended background)
Light: info 4.77 / 9.56 · success 3.16 / 9.92 · warn 2.84 / 10.03 · error 4.44 / 9.51 · secondary 6.92 / 9.45 · contrast 17.06 / 17.85
Dark: info 3.96 / 14.58 · success 5.92 / 13.5 · warn 6.73 / 12.91 · error 3.98 / 14.99 · secondary 10.08 / 14.9 · contrast 19.9 / 19.9
Below AA (4.5): summary Light success / warn / error, Dark info / error — Aura defaults (same as Message).

## Known gaps
- Close button hover / focus not built (#77).
- Secondary / contrast shadow: Light style used in Dark too (4% opacity colour difference).
- No enter / leave animation.
