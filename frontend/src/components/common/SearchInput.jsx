import React, { useRef } from 'react';

const SearchInput = ({ value, onChange, onClear, placeholder }) => {
    const inputRef = useRef(null);

    const handleClear = () => {
        if (onClear) onClear();
        if (inputRef.current) inputRef.current.focus();
    };

    return (
        <div className="relative flex-1 flex items-center bg-white z-10 rounded-t-lg md:rounded-none md:rounded-l-lg">
            <div className="pl-4 text-gray-400 pointer-events-none">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-3 pr-10 py-3 md:py-4 bg-transparent outline-none text-gray-700 font-medium placeholder-gray-400 text-sm md:text-base rounded-t-lg md:rounded-none md:rounded-l-lg"
                autoComplete="off"
                spellCheck="false"
            />

            {value && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-md hover:bg-gray-100"
                >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default SearchInput;