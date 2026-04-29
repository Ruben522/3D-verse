import React from 'react';

const FilterDropdown = ({ options, activeFilter, onFilterChange, isOpen, onToggle, defaultLabel = "Filtros", allLabel = "Todas" }) => {
    const activeLabel = activeFilter ? activeFilter : defaultLabel;

    const handleSelect = (value) => {
        onFilterChange(activeFilter === value ? '' : value);
        onToggle();
    };

    return (
        <div className="relative flex-1 md:flex-none">
            <button
                onClick={onToggle}
                className="w-full h-full flex items-center justify-center md:justify-between gap-1.5 md:gap-2 px-3 md:px-5 bg-gray-800 hover:bg-gray-900 text-white transition-colors rounded-br-lg md:rounded-none md:rounded-r-lg"
            >
                <div className="flex items-center gap-1.5 md:gap-2">
                    <svg className="w-4 h-4 md:w-5 md:h-5 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span className="font-semibold text-xs md:text-sm whitespace-nowrap truncate max-w-[70px] md:max-w-[120px]">{activeLabel}</span>
                </div>
                <svg className={`w-3 h-3 md:w-4 md:h-4 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 md:w-64 bg-white border border-gray-200 shadow-xl rounded-md p-2 z-50 animate-fade-in">
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar flex flex-col gap-1">
                        <button
                            onClick={() => handleSelect('')}
                            className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left ${!activeFilter ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-50 text-gray-600'
                                }`}
                        >
                            {allLabel}
                        </button>
                        {options.map(opt => (
                            <button
                                key={opt.id || opt.name}
                                onClick={() => handleSelect(opt.name)}
                                className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left ${activeFilter === opt.name
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'hover:bg-gray-50 text-gray-600'
                                    }`}
                            >
                                {opt.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;