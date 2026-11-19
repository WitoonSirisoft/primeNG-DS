# SPEC.md: Figma Component Generation Rules (PrimeNG + Sakai)

> **Audience:** the AI agent that builds the Figma design system, and the humans reviewing its work.
> **Rule zero:** if this spec and your assumptions disagree, this spec wins. If this spec is silent or unclear, **stop and ask**; do not guess.

Items in `[brackets]` are placeholders to fill in before the first run.

---

## 0. Where this spec sits (end-goal context)

This spec governs **Stage 1** of a three-stage plan:

| Stage | System | Who changes it | Relationship to the others |
|---|---|---|---|
| **1. Base** (this spec) | Brand-neutral replica of PrimeNG (Aura defaults) | Design system team | Foundation; published as a versioned library |
| **2. Custom** | Per-client / per-project system built on the Base | Project designers | Changes **tokens** and **composes** from Base components; never edits the Base |
| **3. Centralized custom** | Shared system that collects reusable custom pieces and is synced with development | System owner(s) | Receives promoted Custom pieces; synced to code through tokens, mapping table and review |

**Consequence for the Base:** it is judged not only on looking like PrimeNG, but on being a **foundation**:
- **Themable:** a brand swap happens by changing tokens only
- **Extendable:** projects customize without detaching or editing Base components
- **Stable:** published names do not change casually
- **Reproducible:** variables can be created and later updated from `tokens.json`

**Out of scope in Stage 1:** client branding, custom components, page templates, the sync pipeline.

---

## 1. Goal

Build a Figma component library that mirrors the Angular + PrimeNG implementation as closely as possible, so a developer can read a Figma component and know exactly which PrimeNG selector and inputs to use.

**Success means:**
- Every Figma component maps to one PrimeNG component (or a documented composite).
- Every Figma variant property maps to one PrimeNG input, with the same name and values.
- Every color, spacing, radius, shadow and font value is a **bound variable**, not a literal.
- A designer can resize, swap text, and switch states without the component breaking.
- Replacing the brand tokens (palette, font, radius, spacing) restyles every component with **zero component edits**.
- The procedure that creates the variables can later **update** them from `tokens.json` in place, with no duplicates.

**Non-goals:** pixel-perfect behavior of animations, data logic, anything not visible in a static state, and anything listed as out of scope in section 0.

---

## 2. Sources of truth (priority order)

When sources conflict, higher wins.

| Priority | Source | Used for |
|---|---|---|
| 1 | `tokens/tokens.json` | All variable names and values |
| 2 | PrimeNG component source and docs in `[path or version]` | Inputs, allowed values, structure, states |
| 3 | `screenshots/` (rendered Storybook, per component/state) | Visual appearance, spacing, proportions |
| 4 | Sakai (`app/`) | Page layouts, shell, real-world usage |
| 5 | This spec | Figma-side conventions |

**Never** invent a value that exists in a higher source. If a value is missing from `tokens.json`, report it; do not hardcode it.

**Versions in use:** PrimeNG `[version]`, Angular `[version]`, preset `Aura`. Verify every input name and allowed value against the installed version. Names change between major versions (for example, severity values).

---

## 3. File structure in Figma

```
Pages:
  00 Cover            (title, version, changelog, link to repo)
  01 Foundations      (color, typography, spacing, radius, shadow, as documentation frames)
  02 Components       (one section per component; the component sets live here)
  03 Patterns         (composites: form row, page header, table toolbar)
  04 Templates        (Sakai-style page layouts)
  99 Sandbox          (agent scratch space; never published)
```

**Rules:**
- The agent works in `99 Sandbox` first, then moves finished work. Nothing unreviewed enters `02 Components`.
- One component set per PrimeNG component. Do not merge unrelated components into one set.
- Each component section includes a **documentation frame** next to the set: name, PrimeNG selector, link to the story, list of properties.

---

## 4. Naming conventions

### 4.1 Components

- Format: `ComponentName` in PascalCase, matching the PrimeNG component without the `p-` prefix.
  - `p-button` becomes `Button`; `p-inputtext` (pInputText) becomes `InputText`; `p-tag` becomes `Tag`.
- Component description field (in Figma): `PrimeNG: <p-button> | Story: [url] | Version: [x.y.z]`

### 4.2 Variant properties

Property names match the PrimeNG input name, in **Title Case** for the Figma property, with **lowercase values exactly as PrimeNG accepts them**.

| PrimeNG input | Figma property | Values |
|---|---|---|
| `severity` | `Severity` | `primary`, `secondary`, `success`, `info`, `warn`, `danger`, `help`, `contrast` (verify against installed version) |
| `size` | `Size` | `small`, `base`, `large` (use `base` for the default, which has no attribute in code) |
| `disabled` | `Disabled` | boolean |
| `loading` | `Loading` | boolean |
| `outlined`, `text`, `raised`, `rounded` | `Style` or booleans | See section 4.4 |
| (visual state) | `State` | `default`, `hover`, `focus`, `active`, `disabled` |

**Rules:**
- A Figma property that has **no** PrimeNG equivalent (for example `State=hover`) must be marked as design-only in the documentation frame.
- Never rename a PrimeNG value for aesthetics. `danger` stays `danger`, never `error` or `red`.
- Boolean inputs become **boolean component properties**, not variant values called `true/false` unless a boolean property is technically impossible.
- Text content uses **text properties** (`Label`, `Placeholder`, `Helper text`), not manual layer edits.
- Icons use **instance swap properties** (`Icon`, `Icon position`), defaulting to the PrimeIcons set.

### 4.3 Layers

- Descriptive, PascalCase or lowercase-hyphen names. **Never** leave `Frame 123`, `Rectangle 4`, `Group 7`.
- Standard layer names inside components: `Container`, `Label`, `Icon`, `Content`, `Helper`, `Badge`.
- Layer names should read like the DOM: someone scanning the layer tree should recognize the component's structure.

### 4.4 Variant explosion control

If a component's combinations multiply into an unmanageable matrix:
1. Prefer **boolean properties** and **instance swaps** over additional variant axes.
2. Keep `State` as a variant axis; keep rarely used modifiers (`raised`, `rounded`) as booleans.
3. If still too large, **stop and report** the proposed split. Do not silently drop combinations.

---

## 5. Variables (tokens)

### 5.1 Collections

| Collection | Contents | Modes |
|---|---|---|
| `Primitives` | Raw palette, base spacing scale, font families, raw sizes | none |
| `Semantic` | Meaning-based tokens (`primary.color`, `surface.0`, `text.color`) | `Light`, `Dark` |
| `Components` | Component-specific tokens (`button.padding-x`, `inputtext.border-radius`) | `Light`, `Dark` where values differ |

**Rules:**
- Variable names mirror token paths in `tokens.json` exactly. Slash grouping in Figma matches dot paths in code (`primary.color` becomes `primary/color`). Record the mapping rule in `tokens/README.md`.
- Component tokens alias **semantic** tokens; semantic tokens alias **primitives**. Primitives never alias anything.
- Create tokens **before** any component. Components are built only after tokens are reviewed and approved.
- If a token needed by a component is absent from `tokens.json`, **do not create a lookalike**. Add it to the "Missing tokens" report (section 9).

### 5.2 Binding rules (mandatory)

Every one of these must be bound to a variable, never a literal:

- Fill and stroke colors
- Text colors
- Corner radius
- Padding, gaps and spacing
- Stroke width (when tokenized)
- Font family, size, weight, line height (use text styles bound to variables where possible)
- Effects (shadows) via styles built from tokens

**Check:** after building, scan the component for any property still showing a raw value. Every raw value is a defect.

### 5.3 Theming contract (the Base must be brand-swappable)

- **Brand-dependent values live only in Primitives and Semantic.** Components reference **component tokens**, which alias **semantic** tokens. A component must never reference a primitive directly.
- **Themable axes** that must each be controllable through tokens: color palette (primary and neutral/surface), font family, radius scale, spacing/density. If an axis cannot be changed through tokens (hardcoded or missing token), report it as a Base defect.
- **Theme files** (`tokens/themes/*.json`) override **values only**. They never rename variables or add structure.
- The Base ships with the Aura default values, labeled as defaults. No client names, logos, or brand-specific values appear anywhere in the Base.
- **Acceptance test:** apply a test theme by replacing Primitive/Semantic values only. Every component must restyle correctly with no manual edits.
- **Reproducible creation:** the variable creation procedure must be re-runnable and must **update existing variables by name** rather than creating duplicates. Later sync depends on this.

---

## 6. Construction rules

### 6.1 Auto layout

- **Every** component and every nested container uses auto layout.
- Set resizing deliberately: `Hug` for content-sized parts (buttons, tags), `Fill` for width-flexible parts (inputs, rows), `Fixed` only where the design token requires a fixed size.
- Text must grow without clipping: test with a label 3x longer than the default.
- No manual spacing frames or invisible spacer rectangles.

### 6.2 Structure

- Mirror the real DOM hierarchy where practical: container, then icon, label, badge.
- Reuse smaller components inside larger ones as **instances** (for example, `Select` uses `InputText` styling rules; `DataTable` toolbar uses `Button`). Do not redraw.
- Keep nesting shallow. If a layer tree exceeds roughly 5 levels, review why.

### 6.3 States

Build and verify these where the PrimeNG component supports them: `default`, `hover`, `focus` (visible focus ring), `active/pressed`, `disabled`, `invalid`/error, `loading`, `readonly`.

- Take the visual from `screenshots/`, not from assumption.
- If a state's screenshot is missing, **report it**; do not invent the appearance.
- Focus rings must remain visible against every surface the component is allowed on.

### 6.4 Icons and fonts

- Icons: use the PrimeIcons set as vector components. Do not draw custom approximations. If the icon set is missing in Figma, stop and report.
- Fonts: only fonts already available in the Figma account. If the required font is missing, **stop and report**; never substitute silently.

### 6.5 Accessibility minimums

- Text-to-background contrast follows WCAG AA (4.5:1 body text, 3:1 large text and UI boundaries) in **both** Light and Dark modes. Report failures; do not alter tokens to fix them.
- Interactive minimum target size: note any component below `[24x24px / 44x44px]` in the documentation frame.

### 6.6 Built to be extended

The Base is consumed by Custom systems. Design every component for that.

- **Content is replaceable without detaching:** use text properties and instance-swap properties for labels, icons and slots.
- **Neutral placeholder content** only (no client-like names or copy).
- **Custom layers may only:** (a) change variables/tokens, (b) use instance property overrides, (c) compose new components from Base instances. They never edit the Base file and never detach.
- In each component's documentation frame, list its **extension points** (what can be overridden) and what is intentionally fixed.

### 6.7 Stability and versioning

- **Published names are an API.** Component names, property names, property values and variable names are frozen after first publish. A rename is a breaking change: it needs a major version, a deprecation note, and approval from the system owner.
- **Semantic versioning for the Base library:** patch = visual fixes; minor = additive (new components, variants, tokens); major = renames or removals.
- **Status tag** in each component description: `Status: experimental | stable | deprecated`.
- **Changelog entry** on page `00 Cover` for every library publish.
- **Machine-readable mapping:** keep the Figma-to-PrimeNG mapping in `agent/MAPPING.csv` (columns: figma_component, figma_property, figma_values, primeng_selector, primeng_input, design_only, deviation, deviation_ticket; see 6.8) in addition to the markdown table. Later sync tooling will validate against it.

### 6.8 Deviation classification (Levels 0-3)

Projects will sometimes need things PrimeNG does not do out of the box. The mapping stays honest only if every departure from PrimeNG is **classified and recorded**.

| Level | Name | Example | Code mechanism | Figma mechanism | `Deviation` value |
|---|---|---|---|---|---|
| **0** | Token change | Different color, radius, font, spacing | Theme preset | Variable values | `none` |
| **1** | Style tweak | Extra padding, different icon position | `styleClass` or `pt` (pass-through) | Instance overrides, or an added variant in the Custom layer | `styled` |
| **2** | Structure change inside PrimeNG | Custom button content, custom table cell or header layout | PrimeNG templates (`ng-template` / `pTemplate`) | A Custom component composed from Base instances | `structural` |
| **3** | Different component | New status card, table with unusual behavior | Own wrapper or new component | A new Custom component | `custom` |

**Rules:**
- **The Base is Level 0 only.** Every Base component has `Deviation = none`. A deviation never enters the Base.
- **Classify before building.** Ask: can a lower level meet the need? Use the lowest level that works.
- **Agent behavior:** the agent must not create a deviation on its own initiative. If a task requires Level 2 or 3, it stops and asks for a deviation ticket ID (section 12).
- **Approvals:** Level 0-1 need designer and developer agreement. Level 2-3 also need the system owner's approval.
- **Record at the time of the change.** Each deviation gets a ticket and a mapping row (`deviation` and `deviation_ticket` columns) in both `MAPPING.md` and `MAPPING.csv`.
- **Code discipline:** prefer wrapper components over `::ng-deep` or global CSS overrides. Wrappers map cleanly to a Figma component and survive PrimeNG upgrades far better.
- **Compose, don't redraw:** Level 2-3 Figma components are built from Base instances wherever possible, so token changes still flow through them.
- **Promotion:** a deviation used in 2 or more projects is a candidate for the Centralized DS, built as one proper component in Figma and code together.
- **Track the ratio:** per project, count components by `Deviation` value. If more than `[25]%` are `structural` or `custom`, review whether the project still benefits from the system.

---

## 7. Forbidden

- Hardcoded colors, sizes, radii or spacing
- Detached instances
- Unnamed or default-named layers
- Raster images or screenshots standing in for components
- Flattened or outlined text
- Merging unrelated components into one set
- Inventing tokens, states, variants or values not found in sources
- Deleting or overwriting published components without an explicit instruction
- Working directly in `02 Components` before review
- Changing anything outside the pages and components named in the current task
- Renaming published components, properties, values or variables (see 6.7)
- Referencing primitive variables directly from components
- Putting brand-specific or client-specific values into the Base

---

## 8. Workflow per component

Follow in order. Do not skip steps. Work in **small steps**, inspecting and validating as you go.

1. **Inspect.** Read the PrimeNG component source and docs, its story, and its screenshots. List: inputs, allowed values, states, sub-parts, tokens used.
2. **Plan.** Write a short plan (see format below) and **wait for approval** if the component has more than `[N]` variants or any ambiguity.
3. **Check tokens.** Confirm every needed token exists as a variable. List missing ones.
4. **Build in Sandbox.** Start with the base variant, then add axes one at a time.
5. **Bind.** Bind all values to variables; run the literal-value scan.
6. **Validate visually.** Compare each state against its screenshot (see 8.1).
7. **Stress test.** Long text, narrow width, Dark mode, each size.
8. **Document.** Fill the description, property list, and mapping-table row.
9. **Report.** Produce the report (section 9) and **stop for review**.

### 8.1 Visual validation procedure

For each variant/state:
- Place the Figma component beside the matching screenshot at the same scale.
- Check: overall size, padding, border width and radius, font size/weight, color, icon size and position, shadow.
- Record any visible difference. Differences under about `[1px / 1-2%]` can be noted; larger ones must be fixed or flagged.

### 8.2 Plan format

```
Component: Button
PrimeNG: <p-button> (version x.y.z)
Inputs mapped: severity (8 values), size (3), disabled, loading, outlined, text, rounded, raised, icon, iconPos, label
Design-only properties: State
Estimated variants: N
Sub-parts: Container, Icon, Label, Badge
Tokens needed: [list]  | Missing: [list]
Questions / risks: [list]
```

---

## 9. Report format (after each component)

```
## Report: <Component>

Built: [what exists, with variant count]
Mapped inputs: [Figma property -> PrimeNG input]
Design-only: [list]
Not built / skipped: [list with reason]
Missing tokens: [list]
Missing screenshots: [list]
Visual differences vs screenshots: [list, with severity]
Accessibility notes: [contrast failures, small targets]
Binding scan: [number of unbound values found / fixed]
Needs human decision: [list]
```

An honest report with gaps is better than a clean-looking one that hides them.

---

## 10. Stop and ask when

- A needed token, font, icon, or screenshot is missing
- Sources conflict and the priority table does not resolve it
- A variant matrix is too large to build cleanly
- A component's structure is unclear or highly complex (for example, `DataTable`, `Calendar`)
- You are about to modify something outside the current task
- Any step fails or produces unexpected results; do not continue on top of a failure

---

## 11. Definition of done (per component)

- [ ] Component set exists in the correct page, with PascalCase name and description filled
- [ ] Variant properties match PrimeNG inputs (names and values), with design-only ones marked
- [ ] No unbound fills, strokes, radii, spacing, or text values
- [ ] Auto layout on all containers; resizes correctly
- [ ] All supported states built and compared against screenshots
- [ ] Light and Dark modes both verified
- [ ] Long-text and narrow-width stress tests passed
- [ ] Layer names clean and DOM-like
- [ ] Mapping table row completed in both `MAPPING.md` and `MAPPING.csv`, with `Deviation = none` (the Base does not deviate)
- [ ] Passes the theme-swap test (section 5.3) with no manual edits
- [ ] Extension points listed in the documentation frame
- [ ] Status tag and version filled in the description
- [ ] Report delivered and **reviewed and approved by a human designer**

---

## 12. Deviation ticket template

Used from Stage 2 onward (and for any proposal to change the Base). Save as `agent/DEVIATION_TICKET.md` or your issue tracker's template.

```markdown
# Deviation ticket

**Project / client:**
**Requested by:**
**Date:**
**Component(s):**
**Figma link:**
**Code link / PR:**

## 1. What needs to change
(One or two sentences. Describe the need, not the solution.)

## 2. Why PrimeNG as-is does not work
- [ ] Brand / style only
- [ ] Layout / structure
- [ ] Behavior
- [ ] Content slots
- [ ] Other:

## 3. Classification
Level:  [ ] 0 Token   [ ] 1 Style tweak   [ ] 2 Structure inside PrimeNG   [ ] 3 Different component
Deviation value for mapping:  none / styled / structural / custom
Could a lower level meet the need?  Y / N, because:

## 4. Proposed approach
Code:   (preset / styleClass or pt / ng-template / wrapper or new component)
Figma:  (variable change / instance override / Custom component from Base instances / new component)

## 5. Impact
- Components affected:
- PrimeNG major-upgrade risk:  low / medium / high
- Design effort (h):          Dev effort (h):
- Scope / billing:            included / change request

## 6. Reuse potential
Likely needed in other projects?  Y / N / unknown   (Y = candidate for promotion)

## 7. Approval
Designer:            Developer:
System owner (required for Levels 2-3):
Date:

## 8. Done checklist
- [ ] Figma change built in the Custom layer (Base untouched)
- [ ] Code uses the approved mechanism (no ::ng-deep or global CSS)
- [ ] Mapping row added or updated in MAPPING.md and MAPPING.csv (deviation + ticket ID)
- [ ] Story or screenshot added
- [ ] Changelog entry
```

---

## 13. Change log

| Date | Change | Reason |
|---|---|---|
| `[date]` | Initial version | Pilot start |
| `[date]` | v0.2: added end-goal context (section 0), theming contract (5.3), extensibility and versioning (6.6, 6.7), extra definition-of-done items | Base must serve as foundation for Custom and Centralized stages |
| `[date]` | v0.3: added deviation classification (6.8), `deviation` mapping columns, deviation ticket template (section 12) | Development may need changes beyond PrimeNG's original structure |

> **Maintenance rule:** every recurring mistake the agent makes becomes a new rule in this file. Fix the spec, not just the output.
