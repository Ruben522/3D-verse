import React from 'react';
import useFavorites from '../../hooks/useFavorite';
import { useTranslation } from 'react-i18next';

const FavoriteButton = ({ modelId }) => {
    const { favoritedModels, toggleFavorite } = useFavorites();
    const { t } = useTranslation();
    const isFaved = favoritedModels.has(modelId);

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(e, modelId);
            }}
            title={isFaved ? t('messages.remove_from_favorites') : t('messages.save_in_favorites')}
            className="absolute top-3 right-3 z-20 p-2.5 rounded-full bg-white/20 hover:bg-white/90 backdrop-blur-md border border-white/30 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 group/btn"
        >
            {isFaved ? (
                <svg className="w-5 h-5 text-primary-600 fill-current drop-shadow-sm" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>
            ) : (
                <svg className="w-5 h-5 text-white group-hover/btn:text-primary-600 fill-none stroke-current drop-shadow-md group-hover/btn:drop-shadow-none" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
            )}
        </button>
    );
};

export default FavoriteButton;