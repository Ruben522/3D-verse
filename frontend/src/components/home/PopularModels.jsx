import React from 'react';
import { Link } from 'react-router-dom';

const PopularModels = ({ models }) => {
    // Ordenar por likes y coger los 5 primeros
    const topModels = [...models]
        .sort((a, b) => (b.likes || 0) - (a.likes || 0))
        .slice(0, 5);

    if (topModels.length === 0) return null;

    return (
        <section className="py-16">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Top Diseños Populares</h2>
                    <p className="text-gray-500 font-medium mt-2">Los modelos más valorados por la comunidad.</p>
                </div>
                <Link to="/explorar" className="hidden sm:block text-primary-600 font-bold hover:text-primary-700 transition-colors">
                    Ver todos →
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {topModels.map((model, index) => (
                    <Link
                        key={model.id}
                        to={`/models/${model.id}`}
                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-primary-200 transition-all duration-300 hover:-translate-y-1 flex flex-col"
                    >
                        <div className="relative aspect-square overflow-hidden bg-gray-50">
                            {/* Medalla de ranking para los 3 primeros */}
                            {index < 3 && (
                                <div className="absolute top-2 left-2 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center font-black shadow-sm text-sm">
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                </div>
                            )}
                            <img src={model.imageUrl} alt={model.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>

                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-bold text-gray-900 truncate group-hover:text-primary-600 transition-colors">{model.title}</h3>
                            <p className="text-xs text-gray-500 mt-1 truncate">por @{model.username}</p>

                            <div className="mt-auto pt-3 flex items-center justify-between text-sm font-bold text-gray-700">
                                <span className="flex items-center gap-1.5"><span className="text-red-500">❤️</span> {model.likes}</span>
                                <span className="flex items-center gap-1.5"><span className="text-blue-500">⬇️</span> {model.downloads}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <Link to="/explorar" className="block sm:hidden mt-8 text-center text-primary-600 font-bold bg-primary-50 py-3 rounded-xl">
                Ver todos los diseños
            </Link>
        </section>
    );
};

export default PopularModels;