# Report: Forms 2 group 3 · FileUpload — 2026-11-26

Status: **APPROVED 2026-11-26 (visual 5)** (on `02 Components`). Decision #101.
Generator: `scripts/figma-fileupload.mjs` + plugin code `scripts/figma-fileupload.body.js` (`npm run figma:fileupload`; first build `-- --fresh`) → `calls/30-fileupload-1.js`.
Story fix: the files setter validates `accept="image/*"` → the story now adds 2 PNG files (real bytes) and marks the OnPush component for check; re-captured.

## Built
| Set | Node | Variants | Notes |
|---|---|---|---|
| FileUpload File | 324:5548 | — | thumbnail (image placeholder 50), Name, Size, Status badge (warn "Pending"), Remove (Button Icon danger text); Show thumbnail, Show divider |
| FileUpload | 324:5569 | 3 | Mode=advanced × Files false / true, Mode=basic; Empty text, File name; buttons + rows exposed |
| Doc | 325:9409 | — | shared format + computed accessibility |
| Examples / stress (99 Sandbox) | 325:8968 | — | Light + Dark + 400 wide |

## Sizes vs browser
| | Figma | Browser |
|---|---|---|
| Advanced, empty | 544 × 99.25 | 544 × 100.84 |
| Advanced, 2 files | 544 × 262.75 | 544 × 258.55 (rows ≈ 1 px taller each) |
| Basic | 186 × 33 | — × 32.8 |

## Checks
0 unbound paints except 3 allowed transparent text-button borders (#42). Screenshots match (header buttons primary / secondary, disabled without files, progress track, rows with thumbnail, name, size, Pending badge, red remove). Fixed: rows fill the width (fluid).

## Gaps
Drag-over highlight, progress value, invalid-file message and Completed badge not built as variants. Very long file names overflow (shorten or give Info a max width).
