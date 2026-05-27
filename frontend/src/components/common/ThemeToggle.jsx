import React from 'react';
import useTheme from '../../hooks/useTheme';
import SunIcon from '../../assets/icons/SunIcon';
import MoonIcon from '../../assets/icons/MoonIcon';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={(e) => {
                toggleTheme(),
                    e.preventDefault()
            }}
            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 group"
            aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
        >
            <div className={`relative flex items-center justify-center w-full h-full transition-transform duration-500 ease-out ${isDark ? 'rotate-[360deg]' : 'rotate-0'}`}>
                <SunIcon
                    className={`absolute w-5 h-5 transition-all duration-500 ${isDark ? 'opacity-0 scale-50 -rotate-90' : 'opacity-100 scale-100 rotate-0'}`}
                />
                <MoonIcon
                    className={`absolute w-5 h-5 transition-all duration-500 ${isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-90'}`}
                />
            </div>
        </button>
    );
};

export default ThemeToggle;