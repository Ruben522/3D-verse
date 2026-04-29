import React from 'react';

const SortDropdown = ({ options, activeSort, onSortChange, isOpen, onToggle, isAlone }) => {
    const activeSortLabel = options.find(opt => opt.value === activeSort)?.label || "Ordenar";

    const handleSelect = (value) => {
        onSortChange(value);
        onToggle();
    };

    return (
        <div className="relative flex-1 md:flex-none">
            <button
                onClick={onToggle}
                className={`w-full h-full flex items-center justify-center md:justify-between gap-1.5 md:gap-2 px-3 md:px-5 bg-primary-500 hover:bg-primary-600 text-white transition-colors
                ${isAlone
                        ? 'rounded-b-lg md:rounded-none md:rounded-r-lg' // Bordes si está solo (Comunidad)
                        : 'rounded-bl-lg md:rounded-none'                // Bordes si está acompañado (Modelos)
                    }`}
            >
                <div className="flex items-center gap-1.5 md:gap-2">
                    <svg className="w-4 h-4 md:w-5 md:h-5 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    <span className="font-semibold text-xs md:text-sm whitespace-nowrap truncate max-w-[80px] md:max-w-none">{activeSortLabel}</span>
                </div>
                <svg className={`w-3 h-3 md:w-4 md:h-4 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 md:left-auto md:right-0 mt-2 w-48 md:w-56 bg-white border border-gray-200 shadow-xl rounded-md p-1.5 z-50 animate-fade-in">
                    {options.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => handleSelect(opt.value)}
                            className={`flex items-center w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left ${activeSort === opt.value
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'hover:bg-gray-50 text-gray-700'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SortDropdown;