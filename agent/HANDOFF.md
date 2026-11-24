# HANDOFF: context for the next Claude session (written 2026-11-20, end of Day 5 start; updated 2026-11-23, see §0)

## 0. Update 2026-11-23 (read first)
- **Icons done: 315/315** `Icon/<name>` components (sheet imported; converter fixed: Figma drops the invisible `bounds` box, origin now = sheet origin + translate, glyph position checked against the font). Leftover frame `icons-sheet 1` (64:2, 109 unused groups) on 01 Foundations awaits Witoon's OK to delete.
- Decisions #36–#39 logged (new set from generator, rebuild in place, Rounded false/true, review after each axis).
- **`npm run figma:button -- --axes=<list>`** (`scripts/figma-button.mjs`): variant rules are one JS function shipped inside each call (Figma computes variants; ~8k chars per call regardless of count) and run in Node to validate names against plan.json. Writes `calls/07-button-N.js` (100 variants each) + `07-button-verify-N.js` (300 each; binding check + literal-paint scan).
- **Steps 1–5 ✅** (Severity, Variant, State, Size, Rounded) = full main set: set `Button` id `74:9` on 99 Sandbox, **864 variants** (step 5), rebuilt from the generator, verify 0 errors / 0 unbound paints / 144 allowed transparent (48 text borders + 96 outlined/text shadow layers), sizes 66×33 (loading 87×33), matches screenshots. Sizes vs browser: small 56.5×27.5 (56×27), base 66×33 (65×33), large 74.5×38.5 (74×38). Build batches of 72 (144 hit an 'unexpected error' on the 3rd call). Icon box square, bound to font-size (#43); icon-only known gap (#44). Step 5: verify 864/864, 0 errors, 0 unbound, 864 allowed transparent (288 text borders + 576 see-through shadows); Rounded matches screenshots (icon-only rounded is a 37×33 pill, code a 35×35 circle: part of #44). Batches now 48 (72 failed at ~720 variants). Smaller sets ✅ (all on 99 Sandbox, generator `--set=`): `Badge` 120:147 (Severity 7 × Circle 2 = 14, #45/#47), `Button Link` 122:147 (18; Label property replaced after #48 contamination), `Button Plain` 123:150 (36), `Button Vertical` 124:156 (36; no slot min-height when stacked, 66×54 = code). Badge added to all 864 Button variants by add pass (#46), checked 864/864. Button + badge 'Notifications'/'2' = 124×33 (code 123×33).
- **Stress test ✅ (2026-11-24):** long label + user icon + badge grows at every size (small 206.75, base 233, large 259.25 wide; label never clipped); Dark mode correct for all severities/variants/states, Link, Plain, Vertical, Rounded, Badge; primary theme swap (Semantic primary/* emerald→indigo, 22 aliases) restyled every Button with zero component edits, then restored (verified). Finding: fixed narrow width (40px) lets the label overflow (Figma doesn't clip so the focus ring stays visible; code clips with overflow:hidden) → document 'use Hug or Fill (fluid), not narrow Fixed'.
- **Documentation ✅ (2026-11-24):** MAPPING.md/.csv 26 rows (Deviation none), COMPONENTS.md Button = in progress, doc frame `Button — Documentation` 131:193 on 99 Sandbox (props, extension points, gaps, accessibility), report `agent/REPORT_BUTTON.md`. Contrast: Dark all pass; Light fails for primary/success/info/warn/danger/help + Link (Aura defaults, reported). **Review 2026-11-24:** answers logged (#49), visual score 4; gate **approved** (icon-only + Plain Rounded stay on the later list). Button family + doc frame moved to **02 Components**; generator now targets that page. Full `99-verify.js` 2026-11-24: **691/691 variables, 15/15 text styles, 7 effect styles, 0 missing/extra**; 2 stale opacity descriptions fixed. InputText decisions #50–#53 logged (144 variants, readonly documented only, build on 02 Components, one review gate, invalid stays red). PLAN_INPUTTEXT.md + `scripts/figma-inputtext.mjs` (`npm run figma:inputtext`, calls 08-inputtext-*) written; **InputText 138:192 built on 02 Components: 144/144, 0 errors, 0 literal paints**; sizes 149.5×27.5 / 172×33 / 194.5×38.5 (browser 27.19 / 32.8 / 38.39, within 1px like Button). Figma API note: text layers auto-rename to their content unless `autoRename=false`. Note: device_commit_files right after an edit can write the old file; apply edits on the device instead. Stress test passed (frame 141:191 on 99 Sandbox). REPORT_INPUTTEXT.md, MAPPING (+7 InputText rows, 33 total), doc frame `InputText — Documentation` 142:191 done. Witoon: long value keeps '…' (#54), visual score 5, stress frame 141:191 kept. Button stress-test frame rebuilt on request: `Button — Stress test` 144:161 on 99 Sandbox (kept). **InputText approved 2026-11-24** (status reviewed; filled bg default=hover=focus confirmed against Sakai pixels). Tag: decision #55, PLAN_TAG.md, `scripts/figma-tag.mjs` (`npm run figma:tag`, calls 09-tag-*), **Tag 146:192 built: 14/14, 0 errors, 0 literal paints**, 33×22 / 47×22 with icon (code 32.55/46.55 × 21.69); doc frame 146:488; stress frame 146:385; REPORT_TAG.md; MAPPING +5 rows (38). First build call timed out (rolled back), retry OK. **Tag approved 2026-11-24 (visual 5). All 3 pilot components reviewed.** Day 6 prep: test fonts Kanit (A) / IBM Plex Sans Thai (B), #56, theme files updated. **Next:** (1) Witoon fills 5.3 scoring inputs (review hours + hand-build estimate per component); (2) Witoon duplicates the Figma Base file and sends the copy's link → 6.1 theme-swap test on the copy only →
- Decisions #40–#42: #41 opacity variables are **percent** in Figma (34 re-pushed); #42 literal transparent paint (only allowed literal) for text borders + see-through shadow layers, Raised = solid-only in Figma (supersedes #40).
- Not yet re-run: full `99-verify.js` for variables (expects 691; opacity values now ×100). 2 Semantic `-opacity` descriptions still say "(1 = no mix)" until the next full variables push.
- Variable call files renumbered (components split into 2 calls): 01, 02, 03-components-1, 04-components-2, 05-effect-styles, 06-text-styles. (stale old files deleted 2026-11-23).
- Stale files to delete by hand: `calls/07-button-verify.js`, `calls/07-button-2..9.js` and `07-button-verify-2..3.js` if older than the current step (later steps overwrite them).
- Open at Size step: icon width has no token (height is bound); small/large icons need a width rule.

Read this first, then `agent/SPEC.md`, `agent/PILOT_CHECKLIST.md`, `agent/DECISIONS.md` (#1–#35), `agent/PLAN_BUTTON.md`, `tokens/README.md`.

## 1. What this project is
6-day pilot: build a **Figma "Base" design system that mirrors PrimeNG 21 / Sakai (Aura theme)** 1:1 from code, generated by
re-runnable scripts (code → Figma, never hand-edited). Pilot components: **Button, InputText, Tag**. Later stages: scale to more
components, client brands on top (themes), Code Connect / sync.
- Stack: Angular 21.2.26, PrimeNG 21.0.2, @primeuix/themes 2.0.2 (Aura), Sakai 21.0.0, Storybook 10.6.7 (angular-vite), Node 22 (.nvmrc).
- **Root font 14px → 1rem = 14px** for every Figma px value (DECISIONS #15).
- Repo root: `primeNG-DS/` (`agent/`, `app/sakai-ng/`, `tokens/`, `screenshots/`, `storybook/`).

## 2. How the user works (important)
- User = Witoon (designer side). Approves **step by step**; asks questions; **commits himself** (never commit unless asked; give a commit message when asked).
- Ask before decisions (use multiple-choice questions with a recommended option); log every decision in `agent/DECISIONS.md` (table, next # is **36**).
- Keep summaries short and plain.

## 3. Days status
- Day 1–3 ✅ (setup, Storybook stories + 892 reference screenshots in `screenshots/`, tokens export + validation 1,234/1,234).
- Day 4 ✅ Figma variables. Then added typography (DECISIONS #28).
- **Day 5 in progress**: icons partly done, Button plan approved, **Button base variant built**. Next = add axes.
- Day 6: theme-swap tests, library publish, decision.

## 4. Figma
- File **PrimeNG-Sakai**, key `s014qvCap64VIeEJe6Lq3K`, team "Design's team" (Pro, Full seat), account ba_design@sirisoft.co.th.
- Pages: 00 Cover, 01 Foundations, 02 Components, 03 Patterns, 04 Templates, 99 Sandbox.
- Tool: Figma MCP `use_figma` (Plugin API JS, max 50k chars per call). Call `create_session` first with the file key.
- Current contents:
  - Variables **691**: Primitives 248 (mode Value), Semantic 163 (Light/Dark), Components 280 (Light/Dark) incl. badge (31) and 5 derived (#34).
  - 7 effect styles (shadows), **15 text styles** (Heading/H1–H6, Body/Paragraph, Body/Base, Button/Label sm|base|lg, InputText/Text sm|base|lg, Tag/Label), bound to typography variables.
  - **Icons**: 112 of 315 `Icon/<name>` components in frame `Icons` on 01 Foundations (incl. `Icon/check`, `Icon/user`, `Icon/primeng-spinner`). Remaining 203 → user will import `tokens/figma/icons/icons-sheet.svg` himself (see §7).
  - **Button base draft**: component `Button (base draft)` id `58:5` on 99 Sandbox (primary/solid/base/default). Layers Shadow, Background, Icon left, Label, Icon right, Focus ring. Props Label, Show label, Icon left, Icon right, Icon (swap), Raised. All bound; 66×33 vs browser 65.17×32.8 (Figma rounds text box to whole px; within SPEC 2%).
- Last verify (99-verify): 655/655 vars + 15/15 text styles before badge; badge checked 31/31; total count 691 matches plan. Full re-verify with the regenerated `99-verify.js` not yet run after badge/derived additions (expected 691).

## 5. Scripts (all in `app/sakai-ng`, `npm run …`)
| Script | What |
|---|---|
| `tokens` → `scripts/export-tokens.mjs` | Aura preset + Sakai typography (parsed from `src/assets/layout/_core.scss`, `_typography.scss`) → `tokens/base/tokens.json` (660 tokens; components button, inputtext, tag, badge) |
| `figma:plan` → `scripts/figma-variables.mjs` + `figma-verify.mjs` | tokens → `tokens/figma/plan.json` + `tokens/figma/calls/01-primitives, 02-semantic, 03-components, 04-effect-styles, 05-text-styles, 99-verify` (upsert by name; never deletes) |
| `figma:icons` → `scripts/figma-icons.mjs` | PrimeIcons **font** glyphs (not raw-svg!) + PrimeNG SpinnerIcon → `calls/06-icons-1..6.js` (path data, checksum-guarded), `icons/icons-sheet.svg` + `calls/06-icons-from-sheet.js` (import route) |
| `scripts/text-styles.mjs` | shared text-style spec (token paths per style) |
| `capture` | build Storybook + Playwright screenshots |

Rules baked into the generator (tokens/README §7): name = path with `/`; color-mix → alias + FLOAT `<name>-opacity` (bind **layer opacity**); multi-value padding → `-y/-x`; shadows → effect styles; scopes per role; WEB code syntax `var(--p-…)`; Sakai typography + derived vars have no code syntax and say so in the description.
To push only a subset (cheaper than pasting a 43k call): filter the `D.vars` of the generated call by name and run it with the same UPSERT code (done for typography, badge, derived).

## 6. Key decisions (details in DECISIONS.md)
- #24/#25 Figma account + composite rules; #26/#31 icons from installed package, all 315; #27 variable procedure.
- #28 typography tokens/text styles from Sakai CSS (resolves open q #10).
- #29 Button = 1 set **864 variants**: Severity 8 × Variant (solid/outlined/text) × Size 3 × State 6 (default/hover/focus/active/disabled/loading) × Rounded 2; Raised = boolean (Shadow layer). disabled/loading are State values (layer opacity 0.6 bound to `disabled-opacity`).
- #30 separate sets `Button Link` (18) and `Button Plain` (36). #33 iconPos left/right = two slot booleans sharing one `Icon` swap; top/bottom = `Button Vertical` set (36).
- #32 minimal token-bound `Badge` sub-component (7 severities, experimental) nested in Button via `Badge` boolean, size overridden to `button/badge-size` (14).
- #34 derived vars: `button/focus-ring-radius` 9, `button/rounded-focus-ring-radius` 31, `button/line-height` 16.8, `button/sm/line-height` 14.7, `button/lg/line-height` 18.9 (icon slot min-height so icon-only height = code).
- #35 Button plan approved (`agent/PLAN_BUTTON.md`, total 961 variants incl. Link/Plain/Vertical/Badge).
- Open questions: #1 brand-on-library approach, #8 severity tokens reference primitives, #11 InputText invalid mechanism, #12 test-theme fonts (Georgia / Courier New not in Figma; suggested Merriweather / Roboto Mono).

## 7. Pending user actions
1. **Import icons**: page 01 Foundations → drag `tokens/figma/icons/icons-sheet.svg` → tell Claude "sheet imported" → run `calls/06-icons-from-sheet.js` (expect iconComponentsNow 315, errors []; deletes the sheet).
2. Delete stale files by hand (Claude can't delete): `tokens/figma/calls/06-icons.js`, `tokens/figma/calls/06-icons-7.js`. Optionally `/tmp` nothing.
3. Commit (Day 4 + typography + Day 5 progress). npm left harmless leftover `node_modules/lightningcss-win32-*` (EPERM on delete); run `npm install` on the Mac to tidy.
4. Pending reviews: designer review of Figma variables (4.3) and SPEC.md; decision #14 says Witoon holds the Full seat but the account used is ba_design@ (unconfirmed).

## 8. NEXT STEP (where to resume)
User was asked to say **"go"** to continue Button:
1. Write a re-runnable `scripts/figma-button.mjs` (`npm run figma:button`) that builds the Button set from tokens (same pattern as variables: generate `calls/07-button-N.js`, upsert by name, batches of ~100 variants), starting from the base draft structure in §4.
2. Add axes one at a time with a check after each: Severity → Variant → State → Size → Rounded; then Button Link, Plain, Vertical, Badge (+ Badge instance in Button).
   - States: hover/active use `button/<sev>/hover-*|active-*` (outlined/text: `button/outlined|text/<sev>/*`, Background layer opacity bound to `-opacity` vars); focus = default + `Focus ring` visible (x/y −3, stroke `button/<sev>/focus-ring/color`, width `button/focus-ring/width`, radius focus-ring-radius); disabled = opacity → `disabled-opacity`; loading = disabled + icon swapped to `Icon/primeng-spinner` shown left.
   - Sizes: sm/lg padding `button/sm|lg/padding-*`, font via text style `Button/Label sm|lg`, icon height `button/sm|lg/font-size`, slot min-height `button/sm|lg/line-height`.
   - Rounded: radius `button/rounded-border-radius`, ring `button/rounded-focus-ring-radius`.
3. Literal-value scan (0), compare every state with `screenshots/button/*` at 50% (stage PNGs with device_stage_files and view), stress test, document (description `PrimeNG: <p-button> | Story: … | Version: 0.1.0 | Status: experimental`, extension points, MAPPING.md/.csv rows), SPEC §9 report, review gate, move to 02 Components. Then InputText, Tag (same gates).

## 9. Environment gotchas (Claude-side)
- Repo is on the user's Mac, reached via `mcp__remote-devices__device_bash` at `$HOME/mnt/primeNG-DS`. **Deleting files is not permitted** (rm/unlink EPERM) → scripts overwrite in place; tell the user what to delete.
- Network: Figma upload host `mcp.figma.com` and figma.com asset downloads are **blocked** (policy) from both the Mac VM and the cloud container → can't use `upload_assets`; get screenshots with `get_screenshot` + `enableBase64Response:true`. fonts.cdnfonts.com is blocked from the container (captures run on the Mac).
- Cloud container has Playwright Chromium; a built Storybook copy is at `/home/claude/verify/data/storybook-static` (serve with `verify/scripts/serve.py <dir> 6006`) — this container is session-local and will NOT exist for a new account; rebuild with `npm run build-storybook` + stage files if needed.
- Figma API notes: **never format one label bound to a TEXT component property** (setRangeTextDecoration etc.): Figma copies that formatting (decoration, size) to every label bound to the property in the set (#48). Reads in the same call right after edits can be stale; verify in a separate call. **bound paints: store the resolved colour as the paint's colour** (Figma renders a bound STROKE with the stored placeholder colour, e.g. black, until refreshed; fills refresh; modes still switch correctly); to give a bound paint an opacity build it explicitly `{type,color,opacity,boundVariables}` (object spread `{...paint}` silently keeps opacity 1); load fonts before text; lineHeight/letterSpacing are `{value,unit}`; paint opacity can't bind, layer opacity can; text styles can bind fontFamily/fontSize/fontWeight; ALL_FILLS scope can't combine with other fill scopes; float32 rounding → compare numbers with tolerance; Lato styles: Regular, Medium, SemiBold, Bold.
- PrimeIcons: use the font (`primeicons/fonts/primeicons.ttf`, 314 glyphs, upem 1024, ascent 960); icon box = advance×14/1024 × 14 (check = 14.875×14). raw-svg is a different 24px drawing — don't use.
