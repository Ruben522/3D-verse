import React, { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const language = createContext();

const LanguageContext = ({ children }) => {
    const { i18n } = useTranslation();

    const [currentLang, setCurrentLang] = useState('es');

    useEffect(() => {
        const savedLang = localStorage.getItem('language') || i18n.language || 'es';
        i18n.changeLanguage(savedLang);
        setCurrentLang(savedLang);
    }, [i18n]);

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        setCurrentLang(lang);
        localStorage.setItem('language', lang);
    };

    const languages = [
        { code: 'es', country: 'ES', label: 'Español' },
        { code: 'en', country: 'US', label: 'English' },
        { code: 'zh', country: 'CN', label: '中文' },
        { code: 'it', country: 'IT', label: 'Italiano' },
        { code: 'fr', country: 'FR', label: 'Français' },
        { code: 'de', country: 'DE', label: 'Deutsch' },
        { code: 'ja', country: 'JP', label: '日本語' },
        { code: 'ko', country: 'KR', label: '한국어' },
        { code: 'pt', country: 'PT', label: 'Português' },
    ];

    const currentLanguage = languages.find(l => l.code === currentLang);

    const exportar = {
        currentLang,
        changeLanguage,
        languages,
        currentLanguage
    }
    return (
        <language.Provider value={exportar}>
            {children}
        </language.Provider>
    );
};

export { language };
export default LanguageContext;