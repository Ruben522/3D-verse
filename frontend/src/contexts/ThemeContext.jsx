import React, { createContext, useContext, useState, useEffect } from 'react';

const themeContext = createContext();

export const ThemeContext = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const stored = localStorage.getItem('app-theme');
        return stored ? stored : 'light';
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('app-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const exportData = {
        theme,
        toggleTheme,
    };

    return (
        <themeContext.Provider value={exportData}>
            {children}
        </themeContext.Provider>
    );
};

export { themeContext };
export default ThemeContext; 