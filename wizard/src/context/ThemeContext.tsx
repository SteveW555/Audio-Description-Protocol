import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (value: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const THEME_STORAGE_KEY = 'adp-theme';

const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') {
        return 'light';
    }

    try {
        const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme === 'dark' || storedTheme === 'light') {
            return storedTheme;
        }
    } catch (error) {
        // Ignore storage access failures and fall back to default theme
    }

    return 'light';
};

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch (error) {
            // Silently ignore storage write failures
        }
    }, [theme]);

    const setTheme = (value: Theme) => setThemeState(value);
    const toggleTheme = () => setThemeState((previous) => (previous === 'light' ? 'dark' : 'light'));

    const value = useMemo<ThemeContextValue>(
        () => ({
            theme,
            toggleTheme,
            setTheme,
        }),
        [theme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
};
