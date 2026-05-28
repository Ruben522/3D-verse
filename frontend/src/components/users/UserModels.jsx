import React from 'react';
import { useTranslation } from 'react-i18next';
import ModelCard from '../models/ModelCard';
import EmptyState from '../common/EmptyState';
import EmptyModelsIcon from '../../assets/icons/EmptyModelsIcon';

const UserModels = ({ models }) => {
    const { t } = useTranslation();

    return (
        (!models || models.length === 0) ? (
            <EmptyState
                icon={<EmptyModelsIcon />}
                title={t('messages.no_models_user')}
            />
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