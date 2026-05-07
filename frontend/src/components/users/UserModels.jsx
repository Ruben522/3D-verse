import React from 'react';
import { useTranslation } from 'react-i18next';
import ModelCard from '../models/ModelCard';

const UserModels = ({ models }) => {
    const { t } = useTranslation();

    return (
        (!models || models.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 border-dashed transition-colors duration-300 animate-fade-in">
                <span className="text-6xl mb-4 block">🏜️</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                    {t("no_designs")}
                </h3>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                {models.map((model) => (
                    <ModelCard key={model.id} model={model} />
                ))}
            </div>
        )
    );
};

export default UserModels;