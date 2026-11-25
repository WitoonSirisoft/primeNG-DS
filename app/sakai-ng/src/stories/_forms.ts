/** Shared helpers for batch-1 form stories (scale-up, DECISIONS #60). Story scaffolding only. */
export const SIZE_OPTS = ['small', 'base', 'large'];
export const VARIANT_OPTS = ['outlined', 'filled'];
/** 'base' = size not set in code (SPEC 4.2). */
export const sizeOf = (s: string) => (s === 'base' ? undefined : s);
export const CITIES = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
];
const common = {
    size: { control: 'inline-radio', options: SIZE_OPTS, description: "PrimeNG input `size`; 'base' = not set" },
    variant: { control: 'inline-radio', options: VARIANT_OPTS }
};
export const ARGTYPES = common;
