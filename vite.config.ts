import { resolve } from 'node:path';

import inertia from '@inertiajs/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite-plus';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        inertia({
            ssr: 'resources/js/ssr.tsx',
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
    fmt: {
        semi: true,
        singleQuote: true,
        singleAttributePerLine: false,
        htmlWhitespaceSensitivity: 'css',
        printWidth: 150,
        tabWidth: 4,
        sortImports: true,
        sortTailwindcss: {
            stylesheet: './resources/css/app.css',
            functions: ['clsx', 'cn'],
        },
        ignorePatterns: [
            'vendor/**',
            'node_modules/**',
            'public/**',
            'bootstrap/ssr/**',
            '.agents/**',
            '.cursor/**',
            '.opencode/**',
            'docs/**',
            'README.md',
        ],
    },
    lint: {
        ignorePatterns: ['vendor/**', 'node_modules/**', 'public/**', 'bootstrap/ssr/**'],
        options: {
            typeAware: true,
            typeCheck: true,
        },
    },
});
