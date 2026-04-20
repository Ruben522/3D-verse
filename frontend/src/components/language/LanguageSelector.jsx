import React, { useContext } from 'react';
import ReactCountryFlag from "react-country-flag";
import useLanguage from '../../hooks/useLanguage.js';

const LanguageSelector = () => {
    const { currentLang, changeLanguage, languages, currentLanguage } = useLanguage();

    return (
        <div className="relative group">
            {/* Botón principal */}
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 active:bg-white/20 transition-all text-sm font-medium border border-white/10 hover:border-white/30">

                <ReactCountryFlag
                    countryCode={currentLanguage?.country}
                    svg
                    style={{
                        width: '1.5em',
                        height: '1.5em',
                    }}
                />

                <span className="uppercase font-semibold tracking-widest text-white">
                    {currentLang}
                </span>
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-3xl shadow-2xl border border-gray-100 py-2 z-50 
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">

                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50 transition-all text-left text-base
                        ${currentLang === lang.code
                                ? 'bg-primary-50 text-primary-700 font-semibold'
                                : 'text-gray-700 hover:text-gray-900'
                            }`}
                    >
                        <ReactCountryFlag
                            countryCode={lang.country}
                            svg
                            style={{
                                width: '1.8em',
                                height: '1.8em',
                            }}
                        />

                        <span>{lang.label}</span>

                        {currentLang === lang.code && (
                            <span className="ml-auto text-primary-600 text-xl">✓</span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LanguageSelector;