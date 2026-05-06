import React, { useContext, useEffect } from 'react';
import { favorite } from '../../contexts/FavoriteContext';
import useUsers from "../../hooks/useUsers";
import ModelCard from '../models/ModelCard';

const UserFavorites = () => {
    const {
        favorites,
        getFavorites
    } = useContext(favorite);

    const { activeProfileData } = useUsers();

    useEffect(() => {
        if (activeProfileData?.profile?.id) {
            getFavorites(activeProfileData.profile.id);
        }
    }, [activeProfileData]);

    return (
        (!favorites || favorites.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 border-dashed transition-colors duration-300 animate-fade-in">
                <span className="text-6xl mb-4 block">🏜️</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                    Este usuario aún no tiene modelos favoritos
                </h3>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                {favorites.map((modelItem) => (
                    <ModelCard
                        key={modelItem.id}
                        model={modelItem}
                    />
                ))}
            </div>
        )
    );
};

export default UserFavorites;