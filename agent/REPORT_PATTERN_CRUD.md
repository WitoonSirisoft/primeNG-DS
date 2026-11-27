# Report: Batch 4 pattern 3 · CRUD page — 2026-11-27

Status: **APPROVED 2026-11-27 (visual 5)**. Decision #103 (choices: list + dialogs; inside the desktop App Shell). Replaces the #83 replica on 99 Sandbox as the reference (replica kept; its table was copied into CRUD Products).
No generator: composition of approved instances, built with direct plugin calls (rebuild by hand).

## Built (03 Patterns)
| Part | Node | Notes |
|---|---|---|
| CRUD Page | 361:7091 | 3: State list / edit (Product Details Dialog over mask/background) / delete (ConfirmDialog "Are you sure you want to delete Bamboo Watch?"); each = desktop App Shell with Content = CRUD Products |
| CRUD Products | 361:4533 | 1076 wide: Toolbar (New secondary, Delete secondary outlined disabled \| Export secondary) + Products DataTable (from the #83 replica; Name column grows) |
| Product Form | 361:4486 | 413 wide dialog content: Name, Description (Textarea rows 3), Inventory Status (Select), Category (4 RadioButtons, 2 columns), Price / Quantity (InputNumber); labels Body/Strong mb-3, gap-6 |
| App Shell | 351:6545 | new Content swap property (default Card) on Page content |
| Doc | 361:11254 | shared format |
| Examples (99 Sandbox) | 361:7237 | Light + Dark × 3 states |

## Checks
0 unbound paints of 68 (own layers; instances are approved components). Dialog 450 × 580 centred. Fixed: the swapped Product Form kept the slot's 68 px width → Body set to Fill + Hug.

## Gaps
Product image in the dialog, Rating component (Reviews = star icons as in the replica), sort / filter / selection states, mobile layout not built. InputNumber shows its sample value. Sakai page has no card around the table (Figma matches).
