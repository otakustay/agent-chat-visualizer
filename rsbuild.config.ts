import type {RsbuildConfig} from '@rsbuild/core';
import {pluginReact} from '@rsbuild/plugin-react';
import {pluginBabel} from '@rsbuild/plugin-babel';
import type {PluginBabelOptions} from '@rsbuild/plugin-babel';

const babelOptions: PluginBabelOptions = {
    include: /\.(?:jsx|tsx)$/,
    babelLoaderOptions(opts) {
        opts.plugins?.unshift('babel-plugin-react-compiler');
    },
};
const config: RsbuildConfig = {
    plugins: [pluginReact(), pluginBabel(babelOptions)],
    tools: {
        postcss: {
            postcssOptions: {
                plugins: ['@tailwindcss/postcss'],
            },
        },
    },
    performance: {
        buildCache: false,
        printFileSize: false,
    },
    dev: {
        progressBar: false,
    },
    html: {
        favicon: './public/favicon.svg',
    },
    resolve: {
        alias: {
            '@': './src',
        },
    },
};

export default config;
