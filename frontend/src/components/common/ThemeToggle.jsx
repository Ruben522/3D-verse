import React from 'react';
import useTheme from '../../hooks/useTheme';

const ThemeToggle = () => {
    // Ahora leemos el estado del cerebro central
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-yellow-400 dark:hover:bg-gray-700 transition-colors duration-300 focus:outline-none"
            aria-label="Cambiar modo oscuro"
        >
            {theme === 'dark' ? '☀️' : '🌙'}
        </button>
    );
};

export default ThemeToggle;