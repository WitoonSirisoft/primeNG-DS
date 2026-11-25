# Report: Batch 1 · Group A (Textarea, IconField, Password, InputNumber) — 2026-11-24

Status: **reviewed, approved 2026-11-24 — visual 5 for all four** (built on `02 Components`). Plan: `agent/PLAN_GROUP_A.md`. Decisions #61–#64.
Generators: `figma-inputtext.mjs --set=textarea` (`npm run figma:textarea`), `figma-composite.mjs --set=iconfield|password|inputnumber` (`npm run figma:composite`).

## Built
| Set | Node | Variants | Axes | Doc frame |
|---|---|---|---|---|
| Textarea | 170:192 | 144 | Size × Variant × State × Invalid × Content | 174:242 |
| IconField | 171:192 | 6 | Icon position × Size (InputText instance inside) | 174:255 |
| Password | 171:247 | 6 | Toggle mask × Size (InputText instance inside) | 174:268 |
| InputNumber | 172:213 | 12 | Buttons × Size (InputText instance inside) | 174:281 |
| Stress frame (99 Sandbox) | 173:440 | — | long text, nested overrides, Dark, primary swap | — |
New tokens: 3 derived variables (`iconfield/input-padding` 35, `password/input-padding` 35, `inputnumber/stacked-input-padding` 45.5), 3 text styles `Textarea/Text sm|base|lg` → Base now **987 variables, 18 text styles**.

## Sizes vs browser (screenshots/manifest.csv)
| | Figma | Browser |
|---|---|---|
| Textarea sm / base / lg | 183.5×56.56 / 208×66.39 / 233.5×76.17 | same |
| IconField sm / base / lg | 175.75 / 196.5 / 217.25 × 27.5 / 33 / 38.5 | 175.75 / 196.5 / 217.25 × 27.19 / 32.8 / 38.39 |
| Password toggle mask base | 196.5×33 | 196.5×32.8 |
| InputNumber base none / stacked / horizontal / vertical | 172 / 207 / 242 / 172×91 | 172 / 207 / 242 / 172×90.8 |
| InputNumber large stacked / horizontal / vertical | 227.75 / 264.5 / 194.5×100 | 227.75 / 264.5 / 194.5×99.89 |
Heights within 0.3px (same text-box rounding as InputText).

## Binding scan
Textarea 144/144 0 errors, 0 unbound paints. Composites 24/24: inner InputText instance exposed, icon-side paddings bound to the derived variables, icon size + colour bound, button background / border / radius / width / padding bound, 0 unbound paints. Allowed literals: icon x/y positions (computed from tokens; Figma cannot bind positions), InputNumber horizontal/vertical inner radius 0 (CSS `border-radius: 0`).

## Fix log (agent-side)
1. IconField/Password width formula: first build used InputText width + 24.5 (1.75px off at small/large) → width − own side padding + 35; rebuilt in place.
2. InputNumber vertical: font not loaded before centring the inner text → generator loads InputText fonts first.
3. Capture: Message fade-in frozen at first frame → capture waits for finite animations (re-captured).

## Stress test (frame 173:440)
Long Textarea text wraps (clipped at the fixed 3-row height, browser scrolls) · nested InputText set to focus / invalid from the wrapper → border colours switch, icon-side padding stays bound · InputNumber value "1,250" · Dark correct (Textarea filled bg #27272a) · primary swap: focus border #10b981 → #6366f1 → restored.

## Not built (decided)
Password strength meter + clear icon (#63); InputNumber button hover/pressed (#64); Textarea autoResize.

## Needs human decision
1. ~~Review gate~~ → approved, visual 5 (Witoon).
