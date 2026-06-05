import React, { useState } from 'react';
import AccordionSection from '../../common/AccordionSection';
import ThemeToggle from '../../common/ThemeToggle';
import useLanguage from '../../../hooks/useLanguage';
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from 'react-i18next';
import PreferencesIcon from '../../../assets/icons/PreferencesIcon';

const PreferencesSettings = () => {
    const [expandedSections, setExpandedSections] = useState(['display']);
    const { t } = useTranslation();
    const { currentLang, changeLanguage, languages } = useLanguage();

    const toggleSection = (id) => {
        setExpandedSections(prev =>
            prev.includes(id) ? prev.filter(sec => sec !== id) : [...prev, id]
        );
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <AccordionSection
                id="display"
                title={t('user_settings.preferences_section.title')}
                subtitle={t('user_settings.preferences_section.subtitle')}
                isOpen={expandedSections.includes('display')}
                onToggle={toggleSection}
                icon={<PreferencesIcon className="w-6 h-6 text-white" />}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors duration-300 hover:border-gray-200 dark:hover:border-gray-700 gap-4">
                        <span className="font-bold text-gray-900 dark:text-white text-sm whitespace-nowrap">
                            {t('user_settings.preferences_section.language')}
                        </span>

                        <div className="flex flex-wrap items-center justify-end gap-1.5 bg-gray-200/50 dark:bg-gray-800 p-1.5 rounded-xl w-full sm:w-auto">
                            {languages.map(lang => (
                                <button
                                    key={lang.code}
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        changeLanguage(lang.code);
                                    }}
                                    className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${currentLang === lang.code
                                        ? 'bg-white dark:bg-gray-700 shadow-sm scale-105'
                                        : 'hover:bg-white/50 dark:hover:bg-gray-700/50 opacity-70 hover:opacity-100'
                                        }`}
                                    title={lang.label}
                                >
                                    <ReactCountryFlag
                                        countryCode={lang.country}
                                        svg
                                        style={{ width: '1.4em', height: '1.4em' }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors duration-300 hover:border-gray-200 dark:hover:border-gray-700">
                        <span className="font-bold text-gray-900 dark:text-white text-sm">
                            {t('user_settings.preferences_section.theme')}
                        </span>
                        <div className="flex-shrink-0 scale-95 origin-right">
                            <ThemeToggle />
                        </div>
                    </div>

                </div>
            </AccordionSection>
        </div>
    );
};

export default PreferencesSettings;