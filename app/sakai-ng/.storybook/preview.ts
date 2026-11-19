import { provideZonelessChangeDetection } from '@angular/core';
import { applicationConfig, type Preview } from '@storybook/angular-vite';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';

/**
 * Theme setup mirrors src/app.config.ts exactly:
 * Aura preset, dark mode via the `.app-dark` class on <html>, zoneless change detection.
 * Global styles (Sakai layout, PrimeIcons, Tailwind) come from angular.json build.options.styles.
 * Keep this file in sync with app.config.ts; if they differ, screenshots are invalid (PILOT_CHECKLIST 2.1).
 */
const preview: Preview = {
    decorators: [
        applicationConfig({
            providers: [provideZonelessChangeDetection(), providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } })]
        }),
        (storyFn, context) => {
            const dark = context.globals['theme'] === 'dark';
            document.documentElement.classList.toggle('app-dark', dark);
            // Surface behind the component: 'card' = Sakai .card (--surface-card), 'ground' = Sakai page (--surface-ground)
            document.body.style.backgroundColor = context.globals['surface'] === 'ground' ? 'var(--surface-ground)' : 'var(--surface-card)';
            return storyFn();
        }
    ],
    globalTypes: {
        theme: {
            description: 'Light / Dark mode (toggles .app-dark like Sakai)',
            toolbar: {
                title: 'Theme',
                icon: 'mirror',
                items: [
                    { value: 'light', title: 'Light', icon: 'sun' },
                    { value: 'dark', title: 'Dark', icon: 'moon' }
                ],
                dynamicTitle: true
            }
        },
        surface: {
            description: 'Background behind components (Sakai card or page ground)',
            toolbar: {
                title: 'Surface',
                icon: 'contrast',
                items: [
                    { value: 'card', title: 'Card (surface-card)' },
                    { value: 'ground', title: 'Page (surface-ground)' }
                ],
                dynamicTitle: true
            }
        }
    },
    initialGlobals: { theme: 'light', surface: 'card' },
    parameters: {
        // Page background comes from Sakai's --surface-ground, not Storybook's backgrounds addon
        backgrounds: { disable: true },
        layout: 'padded',
        controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } }
    }
};

export default preview;
