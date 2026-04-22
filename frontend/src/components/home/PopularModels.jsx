import React from 'react';
import { Link } from 'react-router-dom';
import useModels from '../../hooks/useModels';
import ModelCard from '../models/ModelCard'; // Ajusta la ruta si es necesario

const PopularModels = () => {
    const { getTopPopularModels } = useModels();
    const topModels = getTopPopularModels();

    if (topModels.length === 0) return null;

    return (
        <section className="py-16">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Top Diseños Populares</h2>
                    <p className="text-gray-500 font-medium mt-2">Los modelos más valorados por la comunidad.</p>
                </div>
                <Link to="/models" className="hidden sm:block text-primary-600 font-bold hover:text-primary-700 transition-colors">
                    Ver todos →
                </Link>
            </div>

            {/* Grid ajustado para 5 elementos. Usa tu ModelCard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {topModels.map((model) => (
                    <ModelCard key={model.id} model={model} />
                ))}
            </div>

            <Link to="/models" className="block sm:hidden mt-8 text-center text-primary-600 font-bold bg-primary-50 py-3 rounded-xl">
                Ver todos los diseños
            </Link>
        </section>
    );
};

export default PopularModels;