# PILOT_CHECKLIST.md: 6-Day Base DS Pilot (Button, InputText, Tag)

**End goal (3 stages):** Base design system → Custom design system (per client/project) → Centralized custom design system synced with development.

**This pilot covers Stage 1 only (the Base DS proof of concept).** Its job is not just "do the components look right" but "is this a solid foundation that Stages 2 and 3 can be built on". So besides visual and property accuracy, the pilot also tests **themability, reproducibility, library consumption, and name stability**.

**Goal:** prove that an AI agent can build Figma components that map ~1:1 to PrimeNG, using a repo as reference, *and* that the result works as a foundation. Decide at the end whether to scale up, go hybrid, or switch to the PrimeOne-based approach.

**Legend:**
- ☐ task
- **MUST**: skipping this causes the pilot to fail or the result to be untrustworthy
- **CONCERN**: a known risk; watch for it
- **OUTPUT**: what should exist when the task is done

**Owners:** assign a name to each day. Suggested roles: **Dev** (repo, Storybook, tokens), **Designer** (Figma, review), **Lead** (decisions, scoring).

| Day | Focus | Owner |
|---|---|---|
| 1 | Prerequisites, repo, Sakai running | `[Dev]` |
| 2 | Storybook and reference screenshots | `[Dev]` |
| 3 | Tokens JSON and spec | `[Dev + Designer]` |
| 4 | Figma connection and variables | `[Designer + Dev]` |
| 5 | Build components and review | `[Designer]` |
| 6 | Theming, library and reproducibility tests; final decision | `[Designer + Dev + Lead]` |

---

## Day 1: Prerequisites, repo, Sakai running

### 1.1 Confirm access and tools

- ☐ Confirm a Figma **Full seat** on a paid plan for whoever runs the agent
- ☐ Confirm the agent client you will use supports Figma's remote MCP server with write access (for example Claude Code, Cursor, VS Code). Check Figma's current documentation, as supported clients change
- ☐ Install Node.js (current LTS), Git, and the Angular CLI
- ☐ Create an empty Git repository `design-system-source` on your Git host

**MUST:** write down who has the Full seat. Dev seats are read-only outside drafts, so the agent cannot write to your real files with one.
**CONCERN:** the Figma write-to-canvas feature is in beta and may change in availability and pricing. Treat results as a trial, not a permanent process.

### 1.2 Set up the repo

- ☐ Clone the Sakai Angular template into `app/`
- ☐ Install dependencies and run it locally; confirm the app opens and pages render
- ☐ Note exact versions: Angular, PrimeNG, preset (Aura), in a `VERSIONS.md`
- ☐ Create the folder skeleton:
  ```
  design-system-source/
  ├── app/
  ├── storybook/
  ├── tokens/
  ├── agent/            (SPEC.md, COMPONENTS.md, MAPPING.md)
  └── screenshots/
  ```
- ☐ Commit as "initial skeleton"

**MUST:** record versions now. Every later step (input names, token names) depends on them; a version change mid-pilot invalidates screenshots and mappings.
**CONCERN:** check Sakai's license and your use. Sakai and PrimeNG are open source, but read the license text of the Sakai version you cloned before using it commercially.

### 1.3 Decide the pilot scope

- ☐ Confirm the 3 components: **Button, InputText, Tag**
- ☐ Create `agent/COMPONENTS.md` with the build order and a status column (not started / in progress / reviewed)

### 1.4 Make the end-goal decisions (these shape everything after)

- ☐ **Direction of truth for the Base:** code → Figma. `tokens.json`, generated from the PrimeNG preset, is the source; Figma variables are generated from it. Write it down; reversing it later is expensive.
- ☐ **Library strategy:** the Base lives in its **own Figma file, published as a team library**. Custom DS files will consume it. Never mix client work into this file.
- ☐ **Versioning scheme:** semantic versioning for the Base (patch / minor / major as in SPEC 6.7), with a changelog on the Cover page
- ☐ **Naming freeze policy:** after first publish, renaming a component, property, value or variable is a breaking change. Decide who can approve one.
- ☐ **Token folder layout:** `tokens/base/` (Aura defaults) and `tokens/themes/` (override files, empty for now)
- ☐ **Scope boundary:** Sakai page templates are out of scope for this PoC. Decide where they will live later (my suggestion: the Centralized DS, since they are shared patterns rather than vendor components). Note the decision.
- ☐ **Deviation policy:** adopt the Level 0-3 classification (SPEC 6.8). The Base is Level 0 only (`Deviation = none`). Decide who is the **system owner** who approves Level 2-3 changes, and save the ticket template (SPEC section 12) as `agent/DEVIATION_TICKET.md`

**MUST:** the separate library file. If the Base doubles as a workspace, the Custom layer inherits the mess and later name changes break consumers.
**CONCERN:** how a Custom file applies a client brand on top of a library is the biggest open technical question (see Day 6.2). Keep the decision log open for it.

**OUTPUT (end of day 1):** Sakai runs locally, repo skeleton committed, versions recorded, end-goal decisions written down.

---

## Day 2: Storybook and reference screenshots

### 2.1 Add Storybook

- ☐ Install Storybook in the Angular project (use the Angular framework option); run it locally
- ☐ Confirm the Aura preset and PrimeNG styles load inside Storybook (components must look the same as in Sakai)
- ☐ Add a Light/Dark theme toggle (or two story sets) so both modes can be captured

**MUST:** Storybook must render with the **same preset and theme setup as the app**. If it looks different from Sakai, every screenshot is wrong.
**CONCERN:** PrimeNG theming is configured in the application config, and Storybook needs the same provider setup. If styling looks unstyled or off, this is the first place to check.

### 2.2 Write stories that show every state

For each pilot component, write one "matrix" story showing all combinations.

- ☐ **Button:** every `severity` x `size`; plus `outlined`, `text`, `raised`, `rounded`; `disabled`; `loading`; icon-only; icon left/right. Verify allowed values against the installed PrimeNG version
- ☐ **InputText:** default, filled, focus, `disabled`, `readonly`, invalid (error), sizes, with placeholder, with helper/label
- ☐ **Tag:** every `severity`, with and without an icon, `rounded`
- ☐ For hover/focus/pressed states that need interaction, use Storybook's play functions or a documented way to force the state (for example, adding the focus class or using a pseudo-state addon)

**MUST:** every state the agent will be asked to build must have a visible reference. A missing state means the agent will invent it.
**CONCERN:** hover and focus are hard to capture statically. Decide a method now and note it in a `screenshots/README.md`; do not leave it for later.

### 2.3 Capture screenshots

- ☐ Capture each state at a consistent scale (use the same viewport and device pixel ratio every time)
- ☐ Name files predictably: `button__severity-danger__size-large__state-hover__light.png`
- ☐ Capture both Light and Dark
- ☐ Save to `screenshots/<component>/`

**MUST:** consistent scale and naming. The agent and reviewers match files to Figma variants by name.
**CONCERN:** inconsistent screenshot scale makes size comparisons meaningless. Fix the viewport and zoom before capturing the first image.

**OUTPUT (end of day 2):** Storybook runs, matrix stories exist for 3 components, screenshots organized by component, state and mode.

---

## Day 3: Tokens JSON and spec

### 3.1 Export tokens

- ☐ Locate the Aura preset values (primitive, semantic, and component tokens for Button, InputText, Tag)
- ☐ Write a small script (or have the agent write one, then **review it**) that outputs `tokens/tokens.json` with three groups: `primitives`, `semantic` (Light and Dark), `components`
- ☐ Resolve aliases carefully: keep component tokens pointing to semantic tokens and semantic tokens pointing to primitives, rather than flattening everything into raw values
- ☐ Add `tokens/README.md` explaining the naming rule (dot paths in code to slash groups in Figma)

**MUST:** preserve the **alias structure**. If everything is flattened to hex values, the Figma variables lose their meaning and theming per client becomes impossible.
**CONCERN:** token resolution mistakes are quiet, because a wrong value still looks plausible. Spot-check at least 10 values against the rendered Storybook (for example, primary color, button padding, input border radius).

### 3.2 Validate the tokens

- ☐ Pick 10 tokens; confirm each against the CSS variables in the browser dev tools
- ☐ Confirm both Light and Dark values exist where they should differ
- ☐ Count tokens per group and note totals in `tokens/README.md`

### 3.3 Finalize the spec

- ☐ Copy `SPEC.md` into `agent/`
- ☐ Fill every `[bracketed]` placeholder (versions, paths, thresholds)
- ☐ Create `agent/MAPPING.md` with this table (rows filled during the pilot):

  | Figma component | Figma property | Values | PrimeNG selector | PrimeNG input | Design-only? | Deviation | Ticket |
  |---|---|---|---|---|---|---|---|

  In this pilot every row must be `Deviation = none` and the Ticket column stays empty. Mirror the same columns in `agent/MAPPING.csv` (`deviation`, `deviation_ticket`).

- ☐ Have the **designer** read SPEC.md in full and mark anything unclear or wrong

**MUST:** the designer reviews the spec before the agent uses it. A spec only the developer has read will miss Figma-side practicalities.
**CONCERN:** a long spec can be partly ignored by the agent. Keep rules short and testable, and re-state the critical ones (binding, naming, stop conditions) in the task prompt.

### 3.4 Create two test themes

- ☐ Create `tokens/themes/test-brand-a.json` and `test-brand-b.json`. Each overrides **values only** for: primary palette, neutral/surface palette, font family, radius scale, spacing/density
- ☐ Make them visibly different. Example: A = green, sharp corners, serif font; B = orange, very rounded, compact spacing
- ☐ Theme files must never rename variables or add structure

**MUST:** these are what you will use on Day 6 to prove the Base is themable.
**CONCERN:** some Aura component tokens may point at values that cannot be changed through the semantic or primitive layers. Note every axis that can't be themed; each is a finding for the Base.

**OUTPUT (end of day 3):** `tokens/tokens.json`, validated; `SPEC.md` finalized; empty `MAPPING.md`.

---

## Day 4: Figma connection and variables

### 4.1 Prepare Figma

- ☐ Create a new Figma file `Pilot: PrimeNG Design System`
- ☐ Create the pages from SPEC.md section 3
- ☐ Confirm fonts the preset needs are available in the Figma account (add them if not)
- ☐ Confirm the PrimeIcons set is available in Figma as vector components. If not, decide how icons will be provided *before* building components

**MUST:** fonts and icons ready first. Missing fonts cause silent substitution; missing icons cause hand-drawn approximations.

### 4.2 Connect the agent

- ☐ Install and authorize the remote Figma MCP server in your agent client, following Figma's current instructions for that client
- ☐ Install Figma's skills/plugin for your client if available (they make write operations more reliable)
- ☐ Run a harmless test: ask the agent to read the empty file and report its pages
- ☐ Run a second small test: ask it to create one throwaway frame in `99 Sandbox`, then delete it

**MUST:** confirm both read and write work before the real task.
**CONCERN:** authentication or seat problems surface here. Fix them now, not mid-build.

### 4.3 Create variables only

- ☐ Give the agent `tokens/tokens.json` and `SPEC.md` and this scoped task:
  *"Create the variable collections Primitives, Semantic (Light/Dark modes) and Components from tokens.json in this file. Do not create any components. Report counts per collection and any tokens you could not create."*
- ☐ Have the **designer** review in Figma: collection names, modes, alias links, 10 spot-checked values vs. Storybook
- ☐ Fix errors by correcting `tokens.json` or `SPEC.md` and re-running (not by patching variables by hand, unless you also update the source)

**MUST:** do **not** start components until variables are reviewed and approved.
**CONCERN:** alias links may come out as copied values. Click a few semantic variables and confirm they reference primitives rather than holding raw hex.

### 4.4 Prove variable creation is re-runnable

- ☐ Change one token value in `tokens.json` (for example, the primary 500 shade)
- ☐ Ask the agent to **update** the variables from `tokens.json`, updating existing variables by name
- ☐ Verify: the value changed, the variable count is unchanged, alias links are intact, nothing else changed

**MUST:** this "update in place" operation is the same one Stage 3 sync will rely on.
**CONCERN:** duplicates (for example `primary/color 2`), broken aliases, or the agent rebuilding everything from scratch.

**OUTPUT (end of day 4):** agent connected and tested; variables created and approved in Figma.

---

## Day 5: Build components, review, decide

### 5.1 Build one component at a time

Repeat for **Button, then InputText, then Tag**:

- ☐ **Plan:** ask the agent for its plan (SPEC.md section 8.2 format); check the variant list against the Storybook matrix; approve or correct
- ☐ **Build in Sandbox:** base variant first, then add axes
- ☐ **Bind:** agent runs the literal-value scan; unbound values must be zero
- ☐ **Compare:** designer places each state beside its screenshot
- ☐ **Stress test:** long text, narrow width, Dark mode, each size
- ☐ **Extension and stability:** extension points listed in the documentation frame; status tag and version filled in; row added to both `MAPPING.md` and `MAPPING.csv` with `Deviation = none`
- ☐ **Report:** agent delivers the section 9 report
- ☐ **Review gate:** designer approves or lists fixes
- ☐ If fixes recur, **update SPEC.md** before building the next component
- ☐ Move the approved component to `02 Components`, and fill the `MAPPING.md` rows

**MUST:** one component at a time, with a review gate. Do not queue all three.
**CONCERN:** the agent may produce a clean report that hides gaps. Verify at least two claims per component yourself (for example, count the variants; inspect one state's bindings).
**CONCERN:** if a component takes more than about 3 fix rounds, stop and diagnose (spec gap? missing screenshot? token problem?) rather than continuing to patch.

### 5.2 Designer stress test (all 3 components)

- ☐ Resize every component wider and narrower
- ☐ Replace labels with very long and very short text
- ☐ Switch Light/Dark mode on a frame containing instances
- ☐ Change a semantic variable (for example, primary color) and confirm the components update everywhere
- ☐ Swap icons through the instance-swap property

The variable-change test is the most important one. If components don't react to token changes, per-client theming will not work.

### 5.3 Score the pilot

Fill this table honestly:

| Measure | Button | InputText | Tag |
|---|---|---|---|
| Fix rounds needed | | | |
| Unbound values found at first scan | | | |
| States missing or wrong at first pass | | | |
| Figma properties matching PrimeNG inputs (%) | | | |
| Visual match to screenshots (1-5) | | | |
| Designer review time (hours) | | | |
| Estimated time to build by hand (hours) | | | |

### 5.4 Interim decision (finalized on Day 6)

Use these rough thresholds (adjust to your standards):

| Result | Decision |
|---|---|
| Few fix rounds (about 2 or fewer), nearly all properties match, visual match 4+, review time clearly lower than hand-building | **Scale up:** next batch of 10-15 components, with the same gates |
| Mixed: good on simple components, struggles on complex states or layout | **Hybrid:** use the agent for page templates, mapping table and token work; use PrimeOne (or hand-build) for complex components |
| Many fix rounds, weak variable binding, review time close to hand-building | **Switch:** buy the PrimeOne kit and use the agent only for templates, mapping and theming |

- ☐ Write a draft pilot summary (finalized on Day 6, after the theming and library tests)
- ☐ Commit the updated `SPEC.md`, `MAPPING.md`, `COMPONENTS.md`

**OUTPUT (end of day 5):** 3 reviewed components, completed mapping rows, scoring table, an interim decision.

---

## Day 6: Theming, library and reproducibility tests (decision day)

These tests check whether the Base can carry Stages 2 and 3.

### 6.1 Theme-swap test

- ☐ **Duplicate** the Base file so the real Base stays untouched
- ☐ Apply `test-brand-a.json` through the agent's update procedure (values only)
- ☐ Check all 3 components: colors, font, radius and spacing change correctly, with **no manual component edits**
- ☐ Repeat with `test-brand-b.json`
- ☐ List every element that did **not** change. Each one is a hardcoded or unbound value, and a Base defect
- ☐ Fix the defects in the real Base (and in SPEC.md), then rerun

**MUST:** zero manual component edits. If edits were needed, the Base isn't themable yet, and nothing built on it will be reliable.

### 6.2 Library and Custom-layer test

- ☐ Publish the Base as a team library (v0.1.0) and add a changelog entry
- ☐ Create a second Figma file, `Custom DS test`, enable the library, and build a small screen from instances of the 3 components
- ☐ In the Base, make a small additive change (for example, tweak one token value) and publish v0.1.1. Confirm the Custom file gets the update and instances update correctly
- ☐ In the Custom file, apply overrides (change a label, swap an icon) and confirm they survive the update
- ☐ **Test how a client brand is applied on top of the library.** Try the options that your plan allows and record which works:
  - (a) Figma's extended variable collections (check whether your plan includes this)
  - (b) A forked copy of the Base per client, with the theme applied by the update procedure
  - (c) A separate theme library or client modes
- ☐ Confirm the three common needs (text, icon, brand colors) can be done **without detaching** any instance

**MUST:** record the chosen approach for applying a brand. This answers the main design question for Stage 2.
**CONCERN:** library publishing, variable features and permissions depend on your Figma plan. Verify against Figma's current documentation before relying on any option.

### 6.3 Final scoring

Carry over the Day 5 table, and add:

| Measure | Result |
|---|---|
| Theme-swap test A passes (Y/N) | |
| Theme-swap test B passes (Y/N) | |
| Elements that did not theme (count) | |
| Re-run update test passes (Y/N) | |
| Library update reaches Custom file (Y/N) | |
| Overrides survive library update (Y/N) | |
| Brand-on-library approach found (a / b / c / none) | |
| Renames needed after first publish (count) | |
| Deviation dry run: classifications where designer and developer agree (out of 3) | |

### 6.4 Final decision

**Themability gates everything.** Scale up only if the theme-swap tests pass with no more than `[2]` unthemed elements **and** the re-run update test passes. If they don't, fix the Base tokens and spec before adding more components. A Base that cannot be themed blocks Stages 2 and 3, however good it looks.

| Result | Decision |
|---|---|
| Gates pass, plus the Day 5 thresholds | **Scale up** the Base (next 10-15 components) |
| Gates pass, but complex components struggle | **Hybrid:** agent for templates, mapping and tokens; PrimeOne or hand-building for complex components |
| Gates fail and fixes look large, or review time is close to hand-building | **Switch** to PrimeOne as the Base and use the agent for Stages 2 and 3 |

- ☐ Write the final one-page pilot summary: scores, decision, brand-on-library approach, top 5 spec changes learned, estimated cost to scale
- ☐ Commit the updated `SPEC.md`, `MAPPING.md`, `MAPPING.csv`, `COMPONENTS.md`

### 6.5 Deviation dry run

Test the process on paper before a real project needs it.

- ☐ Make up 3 realistic change requests against your pilot components:
  - one **Level 1** (for example, icon on the right with extra padding)
  - one **Level 2** (for example, a button with custom content such as an icon plus two-line label)
  - one **Level 3** (for example, a new "status card" composite)
- ☐ The designer and developer each classify them **independently**, then compare
- ☐ Fill in the deviation ticket for each: classification, code mechanism, Figma mechanism, upgrade risk, reuse potential
- ☐ Add a mock mapping row for each (do **not** add them to the real Base files)
- ☐ Confirm the Base is untouched and each Figma approach composes from Base instances

**MUST:** if the two of you classify differently, rewrite the definitions in SPEC 6.8 until they agree. Ambiguous levels will cause arguments later.
**CONCERN:** a Level 2 request that cannot be built from Base instances (for example, it needs a part the Base doesn't offer) is a signal to improve the Base's extension points.

**OUTPUT (end of day 6):** tested answers on themability, reproducibility and library consumption; a final scale / hybrid / switch decision.

---

## Cross-cutting rules for the whole pilot

- **Small steps.** Large single requests produce uneven results. Inspect, build, validate, then continue.
- **Fix the source, not just the output.** A recurring mistake becomes a rule in SPEC.md.
- **Version everything.** Commit after each day; tag the Figma file version after each approved component.
- **No silent substitutions.** Missing font, icon, token or screenshot means stop and report.
- **Humans approve.** No component enters `02 Components` without designer sign-off.
- **Keep a decision log.** One line per significant choice, with date and reason.
- **Keep the Base brand-neutral.** No client names, colors or content, ever. Client work belongs to Stage 2.
- **Published names are frozen.** Rename only through the breaking-change process.

## Common failure signs (stop and investigate)

- Components look right but variables show raw values
- Variant names that differ from PrimeNG input names
- Components that break when text length changes
- Dark mode looks wrong or identical to Light
- Agent reports success but the file shows fewer variants than the Storybook matrix
- Visual differences that the agent didn't mention in its report

## After the pilot: Stages 2 and 3

| Stage | Focus | Starts when |
|---|---|---|
| **Scale the Base** | Add the remaining components in batches, using the same gates | Day 6 decision is "scale up" or "hybrid" |
| **2. Custom DS** | Per-client process: theme files, the brand-on-library approach from Day 6, deviation ticket flow (Levels 0-3) for custom components, tracking the share of `structural` and `custom` components per project | Base v1.0 is published and stable |
| **3. Centralized custom DS** | Promotion rule (a custom piece used in 2+ projects moves in), Sakai page templates, change-request flow, sync with development | At least 2 projects have run through Stage 2 |

### Carry-over tasks

- ☐ Finish `MAPPING.md` for all pilot components
- ☐ Decide whether Code Connect is worth adding (requires Organization or Enterprise plan and Dev/Full seats; use template files, as parser-based mappings are no longer being updated; verify current docs)
- ☐ Decide the token sync approach for real projects (Theme Designer subscription vs. your own script and PR pipeline)
- ☐ Define the change-request flow (token change, variant tweak, new composite, structural change) from the earlier playbook
