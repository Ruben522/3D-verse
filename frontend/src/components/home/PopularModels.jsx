import React from 'react';
import { Link } from 'react-router-dom';
import useModels from '../../hooks/useModels';
import ModelCard from '../models/ModelCard';
import ArrowRightIcon from '../../assets/icons/ArrowRightIcon';
import { useTranslation } from 'react-i18next';

const PopularModels = () => {
    const { getTopPopularModels } = useModels();
    const topModels = getTopPopularModels();

    const { t } = useTranslation();

    return (
        <section className="py-16 transition-colors duration-300">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight transition-colors">
                        {t('popular_models.title')}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-2 transition-colors">
                        {t('popular_models.description')}
                    </p>
                </div>

                <Link
                    to="/models"
                    className="hidden sm:flex items-baseline gap-1 text-primary-600 dark:text-primary-400 font-bold hover:text-primary-700 dark:hover:text-primary-300 transition-colors group"
                >
                    <span className="whitespace-nowrap">
                        {t('popular_models.see_all')}
                    </span>
                    <ArrowRightIcon className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1.5 translate-y-[2px]" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {topModels.map((model) => (
                    <ModelCard key={model.id} model={model} />
                ))}
            </div>
        </section>
    );
};

export default PopularModels;