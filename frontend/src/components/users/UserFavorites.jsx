import React, { useContext } from 'react';
import { favorite } from '../../contexts/FavoriteContext';
import ModelCard from '../models/ModelCard';

const UserFavorites = () => {
    const { favoritesList } = useContext(favorite);

    return (
        (!favoritesList || favoritesList.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 border-dashed transition-colors duration-300 animate-fade-in">
                <span className="text-6xl mb-4 block">🏜️</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                    Aún no tienes modelos favoritos
                </h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 transition-colors duration-300">
                    ¡Explora y guarda los que más te gusten!
                </p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                {favoritesList.map((item) => (
                    <ModelCard
                        key={(item.model || item).id}
                        model={item.model || item}
                    />
                ))}
            </div>
        )
    );
};

export default UserFavorites;