import React from 'react';
import { Link } from 'react-router-dom';
import useModels from '../../hooks/useModels';
import ModelCard from '../models/ModelCard';

const PopularModels = () => {
    const { getTopPopularModels } = useModels();
    const topModels = getTopPopularModels();

    if (topModels.length === 0) return null;

    return (
        <section className="py-16 transition-colors duration-300">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight transition-colors">
                        Top Diseños Populares
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-2 transition-colors">
                        Los modelos más valorados por la comunidad.
                    </p>
                </div>

                <Link to="/models" className="hidden sm:block text-primary-600 dark:text-primary-400 font-bold hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                    Ver todos →
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