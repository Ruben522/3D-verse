import React from 'react';
import useUsers from '../../../hooks/useUsers';
import { useTranslation } from 'react-i18next';

const BannerSettings = () => {
    const { datosPerfil, actualizarDatoPerfil, handleClearBanner } = useUsers();
    const { t } = useTranslation();
    const currentBanner = datosPerfil.banner_url || datosPerfil.bannerUrl || '';
    const currentPrimaryColor = datosPerfil.primary_color || datosPerfil.primaryColor || '#8b5cf6';
    const hasBanner = currentBanner.trim() !== '';

    return (
        <div className="flex flex-col gap-6 mt-2 animate-fadeIn">
            <div className="w-full">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 transition-colors">{t('user_settings.customization.img_url')}</p>
                <div className="flex gap-2">
                    <input
                        type="url"
                        name="banner_url"
                        value={currentBanner}
                        onChange={actualizarDatoPerfil}
                        placeholder={t('user_settings.customization.img_url_placeholder')}
                        className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 py-2.5 px-3 text-sm focus:border-primary-500 dark:focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                    />

                    {hasBanner && (
                        <button
                            type="button"
                            onClick={handleClearBanner}
                            className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 hover:shadow-sm text-sm font-bold transition-all whitespace-nowrap"
                        >
                            {t('user_settings.customization.remove_banner')}
                        </button>
                    )}
                </div>

                {hasBanner && (
                    <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm h-32 md:h-48 relative bg-gray-200 dark:bg-gray-800 flex items-center justify-center transition-colors">
                        <div
                            className="w-full h-full transition-all duration-300"
                            style={{
                                backgroundImage: `url(${currentBanner})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        />
                        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm font-medium">
                            {t('user_settings.customization.preview')}
                        </div>
                    </div>
                )}

                {!hasBanner && (
                    <div className="w-full pt-4 mt-4 border-t border-gray-100 dark:border-gray-700 transition-colors animate-fadeIn">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 transition-colors">{t('user_settings.customization.color')}</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 transition-colors">{t('user_settings.customization.color_desc')}</p>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                name="primary_color"
                                value={currentPrimaryColor}
                                onChange={actualizarDatoPerfil}
                                className="h-10 w-14 rounded cursor-pointer border-0 p-0 shadow-sm"
                            />
                            <span className="text-sm font-mono text-gray-500 dark:text-gray-400 uppercase transition-colors">{currentPrimaryColor}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BannerSettings;