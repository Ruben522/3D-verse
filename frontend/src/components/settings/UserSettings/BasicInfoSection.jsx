import React from 'react';
import useUsers from '../../../hooks/useUsers';

const BasicInfoSection = () => {
    const { datosPerfil, actualizarDatoPerfil } = useUsers();

    return (
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 pt-2">
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 transition-colors">Nombre de Usuario</label>
                <input
                    type="text"
                    name="username"
                    value={datosPerfil.username}
                    onChange={(e) => actualizarDatoPerfil(e)}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-2.5 px-3 text-sm focus:border-primary-500 dark:focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-gray-900 dark:text-white transition-colors"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 transition-colors">Ubicación</label>
                <input
                    type="text"
                    name="location"
                    value={datosPerfil.location}
                    onChange={(e) => actualizarDatoPerfil(e)}
                    placeholder="Ej: Madrid, España"
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-2.5 px-3 text-sm focus:border-primary-500 dark:focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 transition-colors"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 transition-colors">Nombre</label>
                <input
                    type="text"
                    name="name"
                    value={datosPerfil.name}
                    onChange={(e) => actualizarDatoPerfil(e)}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-2.5 px-3 text-sm focus:border-primary-500 dark:focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-gray-900 dark:text-white transition-colors"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 transition-colors">Apellidos</label>
                <input
                    type="text"
                    name="lastname"
                    value={datosPerfil.lastname}
                    onChange={(e) => actualizarDatoPerfil(e)}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-2.5 px-3 text-sm focus:border-primary-500 dark:focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-gray-900 dark:text-white transition-colors"
                />
            </div>

            <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 transition-colors">Biografía</label>
                <textarea
                    name="bio"
                    rows="3"
                    value={datosPerfil.bio}
                    onChange={(e) => actualizarDatoPerfil(e)}
                    placeholder="Cuéntale a la comunidad sobre ti y tu trabajo..."
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-2.5 px-3 text-sm focus:border-primary-500 dark:focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 resize-none transition-colors"
                ></textarea>
            </div>
        </div>
    );
};

export default BasicInfoSection;