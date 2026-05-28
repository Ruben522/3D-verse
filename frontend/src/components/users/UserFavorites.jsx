import React, { useContext, useEffect } from 'react';
import { favorite } from '../../contexts/FavoriteContext';
import useUsers from "../../hooks/useUsers";
import ModelCard from '../models/ModelCard';
import { useTranslation } from 'react-i18next';
import EmptyState from '../common/EmptyState';
import EmptyModelsIcon from '../../assets/icons/EmptyModelsIcon';

const UserFavorites = () => {
    const {
        favorites,
        getFavorites
    } = useContext(favorite);
    const { t } = useTranslation();
    const { activeProfileData } = useUsers();

    useEffect(() => {
        if (activeProfileData?.profile?.id) {
            getFavorites(activeProfileData.profile.id);
        }
    }, [activeProfileData]);

    return (
        (!favorites || favorites.length === 0) ? (
            <EmptyState
                icon={<EmptyModelsIcon />}
                title={t('messages.no_favorites')}
            />
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