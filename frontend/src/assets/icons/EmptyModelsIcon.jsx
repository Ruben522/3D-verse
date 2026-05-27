import React from 'react';

const EmptyModelsIcon = ({ className = "w-16 h-16" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" opacity="0.4" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" opacity="0.4" d="M3.27 6.96L12 12.01l8.73-5.05" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" opacity="0.4" d="M12 22.08V12" />
        <circle cx="16" cy="16" r="5" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 19.5L23 23" />
    </svg>
);

export default EmptyModelsIcon;