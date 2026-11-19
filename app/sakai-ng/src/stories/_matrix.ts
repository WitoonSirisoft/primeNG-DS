/**
 * Shared layout for matrix stories (story scaffolding only, not part of any component).
 * Every rendered component sits in a cell with data-cell="<variant-id>" so the
 * Day 2.3 capture script can find, hover, focus and screenshot each one.
 */
export const MATRIX_STYLES = `
  .sb-matrix { display: grid; gap: 1rem 1.5rem; align-items: center; font-family: inherit; color: var(--text-color); }
  .sb-matrix .sb-h { font-size: 11px; font-weight: 600; color: var(--text-color-secondary, var(--p-text-muted-color)); text-transform: none; letter-spacing: .02em; }
  .sb-matrix .sb-cell { display: inline-flex; align-items: center; justify-content: flex-start; padding: 4px; }
  .sb-section { margin: 0 0 2rem 0; }
  .sb-section > h3 { font-size: 13px; font-weight: 700; margin: 0 0 .75rem 0; color: var(--text-color); }
  .sb-note { font-size: 11px; color: var(--p-text-muted-color); margin: .75rem 0 0 0; }
`;

/** Undefined means "the attribute is not set in code"; Figma calls this value `base` (SPEC 4.2). */
export const SIZES: { name: string; value: 'small' | 'large' | undefined }[] = [
    { name: 'small', value: 'small' },
    { name: 'base', value: undefined },
    { name: 'large', value: 'large' }
];
