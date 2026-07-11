import { createInertiaApp } from '@inertiajs/react';
import { route } from 'ziggy-js';

import { AppearanceProvider } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    setup: ({ App, props }) => {
        const ziggy = props.initialPage.props.ziggy as { location: string };

        (globalThis as typeof globalThis & { route: (name: string, params?: unknown, absolute?: boolean) => unknown }).route = (
            name,
            params,
            absolute,
        ) =>
            (route as (name: string, params?: unknown, absolute?: boolean, config?: unknown) => unknown)(name, params, absolute, {
                ...ziggy,
                location: new URL(ziggy.location),
            });

        return (
            <AppearanceProvider>
                <App {...props} />
            </AppearanceProvider>
        );
    },
});
