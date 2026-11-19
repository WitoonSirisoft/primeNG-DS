import type { StorybookConfig } from '@storybook/angular-vite';
import { fileURLToPath } from 'node:url';

const config: StorybookConfig = {
    stories: ['../src/stories/**/*.mdx', '../src/stories/**/*.stories.@(ts)'],
    addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
    framework: '@storybook/angular-vite',
    // Mirror the "@/*" -> "src/*" path alias from tsconfig.json so Sakai's Sass imports (@use '@/assets/...') resolve
    viteFinal: async (viteConfig) => {
        viteConfig.resolve ??= {};
        viteConfig.resolve.alias = [
            ...(Array.isArray(viteConfig.resolve.alias) ? viteConfig.resolve.alias : Object.entries(viteConfig.resolve.alias ?? {}).map(([find, replacement]) => ({ find, replacement: replacement as string }))),
            { find: /^@\//, replacement: fileURLToPath(new URL('../src/', import.meta.url)) }
        ];
        return viteConfig;
    }
};

export default config;
