import React from 'react';

const AccordionSection = ({ id, title, subtitle, icon, isOpen, hasError, onToggle, children }) => {
    return (
        <div className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md ${hasError ? 'border-red-300' : isOpen ? 'border-primary-300 ring-4 ring-primary-50' : 'border-gray-200'}`}>

            {/* Cabecera del Desplegable */}
            <button
                type="button" // Importante para que no envíe formularios accidentalmente
                onClick={() => onToggle(id)}
                className="w-full flex items-center justify-between p-6 bg-white outline-none group text-left"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${hasError ? 'bg-red-50 text-red-500' : isOpen ? 'bg-primary-50 text-primary-600' : 'bg-gray-50 text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-500'}`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className={`font-extrabold text-lg transition-colors ${hasError ? 'text-red-600' : 'text-gray-900 group-hover:text-primary-600'}`}>{title}</h3>
                        <p className="text-sm text-gray-500 font-medium">{subtitle}</p>
                    </div>
                </div>
                <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                    <svg className={`w-6 h-6 ${hasError ? 'text-red-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </button>

            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="p-6 pt-0 border-t border-gray-50">
                        {children}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AccordionSection;