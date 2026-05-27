import React from 'react';
import useUsers from '../../../hooks/useUsers';

const AvatarSettings = () => {
    const { datosPerfil, actualizarDatoPerfil, handleClearAvatar } = useUsers();
    const currentAvatar = datosPerfil.avatar || datosPerfil.avatarUrl || '';
    const hasAvatar = currentAvatar.trim() !== '';

    return (
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mt-2 animate-fadeIn">
            <div className="flex-shrink-0 relative">
                <div
                    className="w-24 h-24 rounded-full border-4 border-gray-100 dark:border-gray-700 shadow-md overflow-hidden flex items-center justify-center text-white text-4xl font-black transition-all duration-300"
                    style={{ backgroundColor: hasAvatar ? 'transparent' : '#8b5cf6' }}
                >
                    {hasAvatar ? (
                        <img
                            src={currentAvatar}
                            alt="Vista previa avatar"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    ) : (
                        <span>{datosPerfil.username ? datosPerfil.username.charAt(0).toUpperCase() : 'U'}</span>
                    )}
                </div>
            </div>

            <div className="flex-1 w-full">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 transition-colors">URL de la imagen (jpg, png, webp)</p>
                <div className="flex gap-2 w-full">
                    <input
                        type="url"
                        name="avatar"
                        value={currentAvatar}
                        onChange={actualizarDatoPerfil}
                        placeholder="Ej: https://misitio.com/mifoto.jpg"
                        className="flex-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 py-2.5 px-3 text-sm focus:border-primary-500 dark:focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                    />

                    {hasAvatar && (
                        <button
                            type="button"
                            onClick={handleClearAvatar}
                            className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 hover:shadow-sm text-sm font-bold transition-all whitespace-nowrap"
                        >
                            Quitar foto
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AvatarSettings;