# MAPPING.md: Figma ↔ PrimeNG mapping

One row per Figma property. Filled during Day 5 (one component at a time, after its review gate).
Mirrored row-for-row in `agent/MAPPING.csv`, which later sync tooling validates against (SPEC 6.7).

Rules:
- In the Base every row is `Deviation = none` and `Ticket` stays empty (SPEC 6.8).
- `Design-only? = yes` for properties with no PrimeNG input (e.g. `State`).
- Use the exact PrimeNG input name and values (verified against primeng 21.0.2). Recorded exceptions: InputText `Size` ↔ `pSize`; Tag `Severity = none` ↔ attribute omitted (SPEC 4.2, DECISIONS #16, #17).

| Figma component | Figma property | Values | PrimeNG selector | PrimeNG input | Design-only? | Deviation | Ticket |
|---|---|---|---|---|---|---|---|
