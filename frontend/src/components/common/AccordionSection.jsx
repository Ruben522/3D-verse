import React from 'react';

const AccordionSection = ({ id, title, subtitle, icon, isOpen, hasError, onToggle, children }) => {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md 
        ${hasError
                ? 'border-red-300 dark:border-red-500/50'
                : isOpen
                    ? 'border-primary-300 dark:border-primary-500 ring-4 ring-primary-50 dark:ring-primary-900/30'
                    : 'border-gray-200 dark:border-gray-700'
            }`}>

            <button
                type="button"
                onClick={() => onToggle(id)}
                className="w-full flex items-center justify-between p-6 bg-white dark:bg-gray-800 outline-none group text-left transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-colors 
                    ${hasError
                            ? 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400'
                            : isOpen
                                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                                : 'bg-gray-50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 group-hover:text-primary-500 dark:group-hover:text-primary-400'
                        }`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className={`font-extrabold text-lg transition-colors 
                        ${hasError
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400'
                            }`}>
                            {title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors">
                            {subtitle}
                        </p>
                    </div>
                </div>
                <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                    <svg className={`w-6 h-6 transition-colors ${hasError ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </button>

            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="p-6 pt-0 border-t border-gray-50 dark:border-gray-700 transition-colors">
                        {children}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AccordionSection;