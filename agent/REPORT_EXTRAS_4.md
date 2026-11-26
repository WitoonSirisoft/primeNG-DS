# Report: Extras group 4 · Chart — 2026-11-26

Status: **APPROVED 2026-11-26 (visual 5)** (on `02 Components`). Decision #102 (choices: Chart set + parts, Lato 12, Sakai colours).
Generator: `scripts/figma-chart.mjs` + plugin code `scripts/figma-chart.body.js` (`npm run figma:chart`; first build `-- --fresh`) → `calls/34-chart-1.js`.
Story fix: the first capture read the CSS colours before PrimeNG injected its theme (Chart.js default / black colours); `sb-chart` now waits for `--p-primary-500`. Re-captured.
Tokens: layout/chart/font-size 12, line-height 1.2, tick-font-weight 500 + text styles Chart/Label, Chart/Label medium — pushed with your OK: **2,025 vars, fp 991981f3 ✅**, 52 text styles.

## Built
| Set | Node | Variants | Notes |
|---|---|---|---|
| Chart Legend Item | 341:6452 | 3 | Style box (bar) / outlined (line: default light fill primary/100 + 3px primary/500 border) / point (pie, doughnut); Label; Swatch colour override |
| Chart | 341:6462 | 4 | Type line / bar / pie / doughnut; 504 × 340 canvas; Sakai demo data as vectors; legend items exposed; legend wraps centred |
| Doc | 342:981 | — | shared format + computed accessibility |
| Examples / stress (99 Sandbox) | 342:2 / 342:857 | — | Light + Dark; long legend labels |

## Geometry vs browser
Measured on the captures: plot area x 27.5–490 (line) / –504 (bar), y 32–311.5; line = Chart.js splineCurve tension 0.4 (capped to the area); bars 0.8 × 0.9 of the category (24.5 wide); arcs centre (252, 186) radius 151 + 2px white border, doughnut cutout 50%. Visual overlay matches; text is Lato instead of Chart.js Helvetica (by choice).

## Checks
0 unbound paints of 137. Text passes (legend 10.35 / 17.72, ticks 4.76 / 6.91). Series colours against the page in Light: primary 500 2.54, primary 200 1.28, teal 2.49 (< 3:1) — documented: don't rely on colour alone (legend, line styles / labels, text alternative). Fixed: line paths shifted (Figma re-bases a path to its curve bounds → re-anchor on the first point); long legend overflowed (now wraps).

## Gaps
Static picture: no data binding, tooltips, hover colours (400), animation. Other types (radar, polar area, combo) not built. A wrapped (2-row) legend doesn't shrink the plot area like Chart.js does. Arc borders stay white in Dark (Chart.js default).
