import React from 'react';

const PaletteIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a1 1 0 011 1v12a3 3 0 003 3h7a2 2 0 012 2v1a2 2 0 01-2 2H7z" />
    </svg>
);

export default PaletteIcon;