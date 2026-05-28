import React from 'react';

const EmptyState = ({ icon, title, description, className = "" }) => {
    return (
        <div
            className={`
                relative overflow-hidden flex flex-col items-center justify-center text-center 
                py-20 px-6 bg-white dark:bg-zinc-900 rounded-3xl 
                border-2 border-dashed border-gray-200 dark:border-zinc-800 
                max-w-3xl mx-auto shadow-sm hover:shadow-xl dark:shadow-black/20 
                transition-all duration-500 group transform hover:-translate-y-1
                ${className}
            `}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/80 dark:to-zinc-800/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative flex justify-center mb-8 transform group-hover:scale-110 transition-transform duration-500 ease-out">
                <div className="absolute inset-0 bg-primary-400 dark:bg-primary-600 rounded-full blur-2xl opacity-0 group-hover:opacity-20 scale-150 transition-opacity duration-500" />
                <div className="relative text-gray-300 dark:text-zinc-600 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-500 [&>svg]:w-20 [&>svg]:h-20">
                    {icon}
                </div>
            </div>
            <h3 className="relative text-2xl font-black text-gray-900 dark:text-zinc-100 mb-3 transition-colors">
                {title}
            </h3>
            {description && (
                <p className="relative text-gray-500 dark:text-zinc-400 font-medium max-w-md mx-auto transition-colors">
                    {description}
                </p>
            )}
        </div>
    );
};

export default EmptyState;