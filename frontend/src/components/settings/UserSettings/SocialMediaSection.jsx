import React from 'react';
import useUsers from '../../../hooks/useUsers';

const SocialMediaSection = () => {
    const { datosPerfil, actualizarDatoPerfil } = useUsers();

    return (
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 pt-2">
            {['youtube', 'twitter', 'linkedin', 'github'].map((red) => (
                <div key={red}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize mb-1 transition-colors">{red}</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400 sm:text-sm transition-colors">@</span>
                        </div>
                        <input
                            type="text"
                            name={red}
                            value={datosPerfil[red] || ''}
                            onChange={(e) => actualizarDatoPerfil(e)}
                            placeholder={`Tu usuario de ${red}`}
                            className="block w-full pl-8 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-2.5 px-3 text-sm focus:border-primary-500 dark:focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 transition-colors"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SocialMediaSection;