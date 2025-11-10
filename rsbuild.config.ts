import {defineConfig} from '@rsbuild/core';
import {pluginReact} from '@rsbuild/plugin-react';

export default defineConfig({
    plugins: [pluginReact()],
    tools: {
        postcss: {
            postcssOptions: {
                plugins: ['@tailwindcss/postcss'],
            },
        },
    },
    html: {
        favicon: './public/favicon.svg',
    },
    resolve: {
        alias: {
            '@': './src',
        },
    },
});
