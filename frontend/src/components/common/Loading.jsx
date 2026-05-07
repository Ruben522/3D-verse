import React from "react";

const Loading = ({ message = "Cargando..." }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[40vh] gap-6 animate-fade-in">
            <div className="relative flex items-center justify-center animate-bounce">
                <div className="absolute w-16 h-16 bg-primary-500/30 rounded-xl blur-xl animate-pulse"></div>

                <div className="relative w-14 h-14 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/40">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
            </div>

            {message && (
                <span className="font-bold text-gray-500 dark:text-gray-400 animate-pulse tracking-wide">
                    {message}
                </span>
            )}
        </div>
    );
};

export default Loading;