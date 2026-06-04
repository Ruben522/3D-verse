import React from 'react';
import { useNavigate } from 'react-router-dom';
import InicialTittle from '../components/common/InicialTittle';
import { useTranslation } from "react-i18next";
import CubeIcon from '../assets/icons/CubeIcon';
import UsersIcon from '../assets/icons/UsersIcon';
import ModelsCategories from '../components/models/ModelsCategories';

const Administration = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">

            <InicialTittle
                tittle={t('administration_pages.admin_panel')}
                subtittle={t('administration_pages.admin_desc')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                <div
                    onClick={() => navigate("/models")}
                    className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group flex items-center gap-5"
                >
                    <div className="p-3 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl group-hover:scale-110 transition-transform">
                        <CubeIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-0.5">{t('administration_pages.manage_models')}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{t('administration_pages.go_models')}</p>
                    </div>
                </div>

                <div
                    onClick={() => navigate("/comunidad")}
                    className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group flex items-center gap-5"
                >
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
                        <UsersIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-0.5">{t('administration_pages.manage_users')}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{t('administration_pages.go_community')}</p>
                    </div>
                </div>
            </div>

            <ModelsCategories />

        </div>
    );
};

export default Administration;