# Report: Day 6.2 library and Custom-layer test — 2026-11-24

Files: Base library **PrimeNG Sakai** (s014qvCap64VIeEJe6Lq3K) · client fork **PrimeNG Base — Brand A** (2PHAzFZItQRe3iVKxlf5G9) · consumer **Custom DS test** (T1Yyt8iUY1Bhr4RPtiQ3mP), test screen `Sign-in (library test)` 3:9417.
Brand approach tested: **(b) fork per client** (Witoon). (a) extended collections = Enterprise only, not on this plan. (c) not tested.

## Steps and results
| # | Step | Result |
|---|---|---|
| 0 | Publish Base v0.1.0; build a sign-in card in Custom from library instances (InputText ×2, Button primary + Icon/user swap, Button secondary, Tag) with overrides; card fill/border/title bound to library variables | ✅ |
| 1 | Base `button/gap` 7 → 10, publish **v0.1.1**, accept in Custom | ✅ update reached the card (wider icon gap); all overrides survived |
| 2 | Revert to 7, publish **v0.1.2**, accept | ✅ back to 7; Base again 1:1 with Aura |
| 3 | Fork = copy of Base + brand A (40 values via `figma-theme-diff.mjs`), published as its own library | ✅ |
| 4 | Custom: **Swap library** Base → Brand A | ✅ every instance AND the card's variables moved to Brand A (indigo, Kanit, square, roomy); overrides survived; nothing detached |
| 5 | Base component update into the fork: re-run `09-tag-1.js` on the fork (rebuild in place), publish, accept | ✅ set key + 14 variant keys unchanged, brand values kept, Custom Tag still linked, override "New" kept |

## Findings
- Library updates and overrides behave as needed for Stages 2–3: text, icon swap and brand colours all done **without detaching** (6.2 MUST).
- **Generators keep component keys** (rebuild in place) → a Base fix can be replayed on every fork by re-running the same calls; consumer files stay linked.
- Fork cost per Base update = re-run the changed generator calls on each fork (+ re-apply the theme diff if Base variables changed) + publish per fork. Order matters: Base variable calls first, then `10-theme-values.js`, or brand values are overwritten.
- After a library update the plugin API can read stale instance layout; trust the variable value / screenshot (HANDOFF §9).
- Test-screen literals (card radius 12, title font typed as Lato) did not follow the brand: consumer screens must use Base text styles and variables too.

## Scoring (6.3)
| Measure | Result |
|---|---|
| Library update reaches Custom file | **Y** |
| Overrides survive library update | **Y** (update, swap and fork update) |
| Brand-on-library approach found | **b** (fork per client; a = Enterprise only) |
| Renames needed after first publish | **0** |
