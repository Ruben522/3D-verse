import React from 'react';

const ArrowRightIcon = ({ className = "w-5 h-5" }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M13 5l7 7-7 7M5 12h15"
        />
    </svg>
);

export default ArrowRightIcon;