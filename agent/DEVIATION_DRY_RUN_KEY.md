# 6.5 Deviation dry run — Claude's classification (open only AFTER you both classified)

| Request | Level | Deviation | Code mechanism | Figma mechanism | Reasoning |
|---|---|---|---|---|---|
| R1 Checkout button | **1** | `styled` | `iconPos="right"` (native, no deviation) + `styleClass` or `pt` for the extra padding | Base Button instance: `Icon right` on, `Icon` swap to arrow; padding → a Custom-layer variant/component (padding is bound in the Base, so it can't change per instance) | The icon position is already a Base property (Level 0); only the extra padding goes beyond PrimeNG inputs → lowest level that covers everything is 1. |
| R2 Two-line download button | **2** | `structural` | `<p-button>` with projected content / `ng-template` (custom layout inside the button) | Custom component: Base Button with `Show label` off + Icon, with a text stack inside | Structure inside PrimeNG changes (two text lines), but it is still a PrimeNG Button (behaviour, states, tokens). |
| R3 Status card | **3** | `custom` | Own Angular wrapper component (e.g. `app-status-card`) using `<p-tag>` and `<p-button>` inside | New Custom component composed of Base Tag + Base Button instances + Base text styles and variables | No PrimeNG component is a "status card"; it is a new composite. |

## Expected discussion points
- **R1 could be argued as Level 0** (icon right is native). The padding decides it. If you disagree here, SPEC 6.8 should say: *"classify by the highest-level part of the request"*.
- **R2 is the extension-point test:** a Base Button instance cannot hold two text lines (its Label is one text property, and the Base must not be detached). Building it needs either a Custom component that draws its own text next to a Base Button shell, or a Base **content slot** (an instance-swap slot in place of the label). → Expected 6.5 finding: *the Base Button lacks a content slot; candidate extension point for v0.2.*
- **R3 hover/click on the whole card** is behaviour → code-side; in Figma it is just a hover variant of the Custom component.

## Mock mapping rows (paper only)
| Figma component | Figma property | Values | PrimeNG selector | PrimeNG input | Design-only? | Deviation | Ticket |
|---|---|---|---|---|---|---|---|
| Checkout Button (Custom) | Icon right | true | `<p-button>` | iconPos="right" + styleClass | no | styled | DRY-1 |
| Download Button (Custom) | Title, Meta | text | `<p-button>` | content template | no | structural | DRY-2 |
| Status Card (Custom) | Status, Title, Description, Action | Tag severity, text, text, Button | `app-status-card` | wrapper inputs | no | custom | DRY-3 |
