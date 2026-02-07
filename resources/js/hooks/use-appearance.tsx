import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const prefersDark = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const resolveIsDark = (appearance: Appearance, systemPrefersDark: boolean) =>
    appearance === 'dark' || (appearance === 'system' && systemPrefersDark);

const applyTheme = (isDark: boolean) => {
    if (typeof document === 'undefined') {
        return;
    }

    document.documentElement.classList.toggle('dark', isDark);
};

const mediaQuery = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = () => {
    const currentAppearance = localStorage.getItem('appearance') as Appearance;
    const isDark = resolveIsDark(currentAppearance || 'system', prefersDark());
    applyTheme(isDark);
};

export function initializeTheme() {
    const savedAppearance = (localStorage.getItem('appearance') as Appearance) || 'system';

    const isDark = resolveIsDark(savedAppearance, prefersDark());
    applyTheme(isDark);

    // Add the event listener for system theme changes...
    mediaQuery()?.addEventListener('change', handleSystemThemeChange);
}

type AppearanceContextValue = {
    appearance: Appearance;
    updateAppearance: (mode: Appearance) => void;
    isDark: boolean;
    resolvedAppearance: 'light' | 'dark';
};

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

export function AppearanceProvider({ children }: PropsWithChildren) {
    const [appearance, setAppearance] = useState<Appearance>(() => {
        if (typeof window === 'undefined') {
            return 'system';
        }

        return (localStorage.getItem('appearance') as Appearance) || 'system';
    });
    const [systemPrefersDark, setSystemPrefersDark] = useState(prefersDark);

    const updateAppearance = useCallback((mode: Appearance) => {
        setAppearance(mode);

        // Store in localStorage for client-side persistence...
        localStorage.setItem('appearance', mode);

        // Store in cookie for SSR...
        setCookie('appearance', mode);
    }, []);

    useEffect(() => {
        if (appearance !== 'system') {
            return;
        }

        const query = mediaQuery();
        if (!query) {
            return;
        }

        const handleChange = (event: MediaQueryListEvent) => {
            setSystemPrefersDark(event.matches);
        };

        query.addEventListener('change', handleChange);

        return () => {
            query.removeEventListener('change', handleChange);
        };
    }, [appearance]);

    const isDark = useMemo(() => resolveIsDark(appearance, systemPrefersDark), [appearance, systemPrefersDark]);
    const resolvedAppearance = isDark ? 'dark' : 'light';

    useEffect(() => {
        applyTheme(isDark);
    }, [isDark]);

    useEffect(() => {
        return () => mediaQuery()?.removeEventListener('change', handleSystemThemeChange);
    }, []);

    const value = useMemo(
        () => ({ appearance, updateAppearance, isDark, resolvedAppearance }),
        [appearance, isDark, resolvedAppearance, updateAppearance],
    );

    return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance() {
    const context = useContext(AppearanceContext);

    if (!context) {
        throw new Error('useAppearance must be used within AppearanceProvider');
    }

    return context;
}
