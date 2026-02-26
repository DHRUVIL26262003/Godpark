import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
    isSafeMode: boolean;
    toggleSafeMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isSafeMode, setIsSafeMode] = useState(false);

    useEffect(() => {
        const savedMode = localStorage.getItem('whitelines_safe_mode');
        if (savedMode === 'true') {
            setIsSafeMode(true);
            document.body.classList.add('safe-mode');
        }
    }, []);

    const toggleSafeMode = () => {
        setIsSafeMode(prev => {
            const newValue = !prev;
            if (newValue) {
                document.body.classList.add('safe-mode');
                localStorage.setItem('whitelines_safe_mode', 'true');
            } else {
                document.body.classList.remove('safe-mode');
                localStorage.setItem('whitelines_safe_mode', 'false');
            }
            return newValue;
        });
    };

    return (
        <ThemeContext.Provider value={{ isSafeMode, toggleSafeMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
