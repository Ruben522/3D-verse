import React from 'react'

const PlanetError = () => {
    return (
        <svg
            className="w-32 h-32 text-purple-500 dark:text-purple-400 relative z-10 animate-bounce"
            style={{ animationDuration: '3s' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.5 10.5l5 5m0-5l-5 5"></path>
        </svg>
    )
}

export default PlanetError