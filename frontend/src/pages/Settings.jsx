import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import UserSettings from '../components/settings/UserSettings/UserSettings.jsx';
import CustomizationSection from '../components/settings/UserSettings/CustomizationSection';
import PreferencesSettings from '../components/settings/UserSettings/PreferencesSettings';
import AccountSection from '../components/settings/UserSettings/AccountSection';
import useUsers from '../hooks/useUsers';
import BotBar from '../components/common/BotBar.jsx';
import { useTranslation } from 'react-i18next';
import InicialTittle from '../components/common/InicialTittle.jsx';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const { t } = useTranslation();
    const navigate = useNavigate();

    const {
        cargarDatosConfiguracion,
        guardarCambiosPerfil,
        isUpdatingProfile,
        currentUser,
    } = useUsers();

    useEffect(() => {
        if (currentUser) {
            cargarDatosConfiguracion();
        }
    }, [currentUser]);

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 pb-40 transition-colors duration-300">
            <div className="max-w-4xl mx-auto flex flex-col gap-8">

                <div className="-mb-4 md:-mb-8">
                    <InicialTittle
                        tittle={t('user_settings.title')}
                        subtittle={t('user_settings.subtitle')}
                    />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto flex transition-colors scrollbar-hide">
                    <button
                        type="button"
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors outline-none 
                            ${activeTab === 'profile'
                                ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                    >
                        {t('user_settings.public_profile')}
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('customization')}
                        className={`flex-1 px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors outline-none 
                            ${activeTab === 'customization'
                                ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                    >
                        {t('user_settings.desing')}
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('preferences')}
                        className={`flex-1 px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors outline-none 
                            ${activeTab === 'preferences'
                                ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                    >
                        {t('user_settings.preferences')}
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('account')}
                        className={`flex-1 px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors outline-none 
                            ${activeTab === 'account'
                                ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-b-2 border-red-500'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                    >
                        {t('user_settings.account_tittle')}
                    </button>
                </div>

                <form id="settings-form" onSubmit={guardarCambiosPerfil} className="flex flex-col gap-6">
                    {activeTab === 'profile' && <UserSettings />}
                    {activeTab === 'customization' && <CustomizationSection />}
                    {activeTab === 'preferences' && <PreferencesSettings />}
                    {activeTab === 'account' && <AccountSection />}
                </form>

            </div>

            {activeTab !== 'account' && (
                <BotBar
                    title={t('user_settings.save_settings')}
                    description={t('user_settings.save_settings_desc')}
                    onCancel={() => navigate('/profile')}
                    formId="settings-form"
                    isLoading={isUpdatingProfile}
                    submitText={t('buttons.save_changes')}
                />
            )}
        </div>
    );
};

export default Settings;