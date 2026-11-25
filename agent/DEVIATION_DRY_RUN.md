# 6.5 Deviation dry run — worksheet (2026-11-24)

**Who:** Witoon (designer) and one developer. **Paper only:** nothing here goes into the real Base, MAPPING.md or MAPPING.csv.

## How to run it (about 30–45 min)
1. Each person reads the 3 requests below and fills **their own column** of the classification sheet, **without talking to the other**. Use SPEC 6.8 (Levels 0–3) only.
2. Compare. Count how many of the 3 you classified the same → this is the 6.3 score "designer and developer agree (out of 3)".
3. For any disagreement: discuss, agree, and write down **which words in SPEC 6.8 caused it**. Claude then rewrites those definitions (PILOT_CHECKLIST 6.5 MUST).
4. Fill one ticket per request (skeletons below), and the mock mapping rows.
5. Only after step 2, open `DEVIATION_DRY_RUN_KEY.md` (Claude's classification) as a third opinion.

## The 3 change requests
**R1 — Checkout button.** On the checkout page, the main "Continue to payment" button must show an arrow icon **after** the label and be a little wider than a normal button (about 4px more space on each side).

**R2 — Download button with two lines.** In the reports list, a button shows a download icon and **two lines of text**: the report name on top ("Monthly sales") and a smaller grey line below ("PDF · 2 MB").

**R3 — Status card.** On the dashboard, a card shows a **status tag** (e.g. "Active"), a **title**, **one line of description**, and an **action button** ("View"). The whole card is clickable and highlights on hover.

## Classification sheet
| Request | Designer: Level (0–3) | Designer: why / mechanism | Developer: Level (0–3) | Developer: why / mechanism | Agree? |
|---|---|---|---|---|---|
| R1 | | | | | |
| R2 | | | | | |
| R3 | | | | | |
**Agreement: __ / 3**

## Tickets (SPEC section 12 template, header + sections 1, 3, 4, 5, 6)
### Ticket DRY-1 (R1)
**Project / client:** dry run · **Requested by:** — · **Date:** · **Component(s):** Button
1. What needs to change: arrow icon after the label; ~4px extra horizontal space on the checkout CTA.
3. Classification — Level: [ ]0 [ ]1 [ ]2 [ ]3 · Deviation value: · Could a lower level meet the need? Y/N because:
4. Proposed approach — Code: · Figma:
5. Impact — Components affected: · Upgrade risk: low/medium/high · Design h: · Dev h:
6. Reuse potential: Y / N / unknown

### Ticket DRY-2 (R2)
**Project / client:** dry run · **Component(s):** Button
1. What needs to change: download icon + two-line content (name + smaller grey meta line).
3. Classification — Level: [ ]0 [ ]1 [ ]2 [ ]3 · Deviation value: · Lower level possible? Y/N because:
4. Proposed approach — Code: · Figma:
5. Impact — Components affected: · Upgrade risk: · Design h: · Dev h:
6. Reuse potential: Y / N / unknown

### Ticket DRY-3 (R3)
**Project / client:** dry run · **Component(s):** Tag, Button, (new) Status card
1. What needs to change: clickable dashboard card with status tag, title, description, action button, hover highlight.
3. Classification — Level: [ ]0 [ ]1 [ ]2 [ ]3 · Deviation value: · Lower level possible? Y/N because:
4. Proposed approach — Code: · Figma:
5. Impact — Components affected: · Upgrade risk: · Design h: · Dev h:
6. Reuse potential: Y / N / unknown

## Mock mapping rows (paper only — do NOT add to MAPPING.md / .csv)
| Figma component | Figma property | Values | PrimeNG selector | PrimeNG input | Design-only? | Deviation | Ticket |
|---|---|---|---|---|---|---|---|
| | | | | | | | DRY-1 |
| | | | | | | | DRY-2 |
| | | | | | | | DRY-3 |

## Checks after the session (6.5)
- [ ] Base file untouched (no new variants or components)
- [ ] Each Figma approach composes from Base instances
- [ ] Any Level 2 request that **cannot** be built from Base instances → listed as a Base extension-point gap
- [ ] Agreement score written into PILOT_SUMMARY.md (6.3 table)

## Result (2026-11-24)
| Request | Designer | Developer | Same? |
|---|---|---|---|
| R1 Checkout button | 1 — only padding | 1 — only padding | ✅ |
| R2 Two-line download button | 2 — same button, change the 2nd line text style | 2 — still the button, edit inside | ✅ |
| R3 Status card | 3 — new component for card states (hover, clicked) | 3 — card has its own behaviour | ✅ |
**Agreement: 3 / 3.** Claude's key agrees on all three. No SPEC 6.8 wording change needed.
**Finding (extension point):** R2 cannot be built from a Base Button instance without detaching: the Base Button has a single `Label` text property. Needs a Custom component or a Base content slot (see PILOT_SUMMARY open items).
