import React from 'react';
import useUsers from '../../../hooks/useUsers';

const SocialMediaSection = () => {
    const { datosPerfil, actualizarDatoPerfil } = useUsers();

    return (
        <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Redes Sociales</h3>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                {['youtube', 'twitter', 'linkedin', 'github'].map((red) => (
                    <div key={red}>
                        <label className="block text-sm font-semibold text-gray-700 capitalize">{red}</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">@</span>
                            </div>
                            <input
                                type="text"
                                name={red}
                                value={datosPerfil[red]}
                                onChange={(e) => actualizarDatoPerfil(e)}
                                placeholder={`Tu usuario de ${red}`}
                                className="block w-full pl-8 rounded-lg border-gray-300 bg-gray-50 py-2.5 px-3 text-sm focus:border-primary-500 focus:ring-primary-500 outline-none transition-colors border"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SocialMediaSection;