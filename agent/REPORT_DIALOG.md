# Report: Batch 2 · Dialog + ConfirmDialog + Dialog Mask — 2026-11-25

Status: **reviewed and approved 2026-11-25 — visual 5** (on `02 Components`). Decisions #91–#93.
Generator: `scripts/figma-dialog.mjs` (`npm run figma:dialog`) → `20-dialog-1.js`; example `20-dialog-example.js`. Update in place (#68).
Stories: `dialog.stories.ts` (layout product | simple, closable, header), `confirmdialog.stories.ts` (CRUD delete; appendTo="self" so the capture finds it).

## Built
| Component | Node | Notes |
|---|---|---|
| Dialog Slot | 264:9843 | hug placeholder |
| Dialog Mask | 264:9846 | 1440 × 900, mask/background |
| Dialog | 264:9848 | Header, Show header, Closable, Show footer, Content swap; Cancel + Save exposed |
| ConfirmDialog | 264:9902 | Header, Show header, Closable, Message, Icon swap; No + Yes exposed |
| Doc frame | 267:3995 | |
| Examples (99 Sandbox) | 266:13746 (dialogs), 266:13938 (screen with mask), helpers 266:4190 | Product Details, UI Kit dialog, CRUD confirm |
| Stress (99 Sandbox) | 266:15277 | Light + Dark: long title, no header + no footer, not closable, long confirm message |
Tokens: dialog 17 + confirmdialog 3 → 1,278 variables, fingerprint f672a14d. Text style Dialog/Title (28). Shadow = overlay/modal/shadow.

## Sizes vs browser (450 wide)
| | Figma | Browser |
|---|---|---|
| Product Details (new) | 579.39 | 581.36 |
| UI Kit dialog | 287 | 286.8 |
| UI Kit, no close | 273 (header 56) | 272.8 |
| UI Kit, no header | 217 | 216.8 |
| ConfirmDialog (CRUD delete) | 168 | 167.8 |
+0.2 = Button height (33 vs 32.8). Product −2: field heights (Textarea 66.39) and Tailwind label spacing.

## Binding scan / checks
All fills, strokes, radius, paddings, gaps bound to dialog / confirmdialog / mask variables; title Dialog/Title; shadow overlay/modal/shadow. Close = Button Icon secondary text rounded (capture hover shows the round background).

## Fix log
1. ConfirmDialog story: renders into <body> by default → capture found nothing; appendTo="self" in the story only.
2. figma-variables.mjs could not read shorthand mixing literals and aliases (dialog content / footer padding "0 {overlay.modal.padding} …") → split per part.
3. Example labels: Heading/H6 (Bold 14, line-height 1.5) made the form 18px taller; Sakai labels inherit 1.2 → local line-height 120% override in the example helper (example only).
4. InputNumber showed "42" → nested InputText Content empty (new product has empty fields).
5. **Save icon was dark (text/color) instead of white (button/primary/color)** — found by Witoon. Figma quirk: setting a Button's Icon swap to the icon already in place (Icon/check = Button default) resets the icon colour to the icon's own default and drops the Button's colour. Generator now only swaps when the icon differs; the Dialog component's Save icon colour was set directly. Scan of all Button / Button Icon instances in 02 Components + 99 Sandbox: 305 OK, 0 wrong (before: 9 wrong, all Save in Dialog copies).

## Accessibility
Text colours are dialog/color on dialog/background (same pair as content text, AA). Close button aria-label comes from code (closeAriaLabel).

## Known gaps
- Not built: maximize button, drag / resize handles, positions (top, left…), the SplitButton/TieredMenu overlay.
- Form labels in examples use Heading/H6 + local line-height (no token for Tailwind font-bold).
