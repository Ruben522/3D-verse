import React from 'react';
import useUsers from '../../../hooks/useUsers';
import { useTranslation } from 'react-i18next';

const SocialMediaSection = () => {
    const { datosPerfil, actualizarDatoPerfil } = useUsers();
    const { t } = useTranslation();
    const redes = ['youtube', 'twitter', 'linkedin', 'github'];

    return (
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 pt-2">
            {redes.map((red) => (
                <div key={red}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize mb-1 transition-colors">
                        {t(`user_settings.social_links.${red}`)}
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <input
                            type="text"
                            name={red}
                            value={datosPerfil[red] || ''}
                            onChange={(e) => actualizarDatoPerfil(e)}
                            placeholder={`https://${red}.com/...`}
                            className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-2.5 px-3 text-sm focus:border-primary-500 dark:focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 transition-colors"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SocialMediaSection;