import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { Agentation } from 'agentation';
import { createRoot } from 'react-dom/client';

import { AppearanceProvider, initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    setup({ el, App, props }) {
        if (!el) {
            return;
        }

        const root = createRoot(el);

        root.render(
            <AppearanceProvider>
                <App {...props} />
                {import.meta.env.DEV && <Agentation endpoint="http://localhost:4747" />}
            </AppearanceProvider>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
