import React from 'react';
import useUsers from '../../../hooks/useUsers';

const BasicInfoSection = () => {
    const { datosPerfil, actualizarDatoPerfil } = useUsers();

    return (
        <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Información Básica</h3>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                    {console.log(datosPerfil)}
                    <label className="block text-sm font-semibold text-gray-700">Nombre de Usuario</label>
                    <input
                        type="text"
                        name="username"
                        value={datosPerfil.username}
                        onChange={(e) => actualizarDatoPerfil(e)}
                        className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 py-2.5 px-3 text-sm focus:border-primary-500 focus:ring-primary-500 outline-none transition-colors border"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700">Ubicación</label>
                    <input
                        type="text"
                        name="location"
                        value={datosPerfil.location}
                        onChange={(e) => actualizarDatoPerfil(e)}
                        placeholder="Ej: Madrid, España"
                        className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 py-2.5 px-3 text-sm focus:border-primary-500 focus:ring-primary-500 outline-none transition-colors border"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700">Nombre</label>
                    <input
                        type="text"
                        name="name"
                        value={datosPerfil.name}
                        onChange={(e) => actualizarDatoPerfil(e)}
                        className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 py-2.5 px-3 text-sm focus:border-primary-500 focus:ring-primary-500 outline-none transition-colors border"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700">Apellidos</label>
                    <input
                        type="text"
                        name="lastname"
                        value={datosPerfil.lastname}
                        onChange={(e) => actualizarDatoPerfil(e)}
                        className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 py-2.5 px-3 text-sm focus:border-primary-500 focus:ring-primary-500 outline-none transition-colors border"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700">Biografía</label>
                    <textarea
                        name="bio"
                        rows="3"
                        value={datosPerfil.bio}
                        onChange={(e) => actualizarDatoPerfil(e)}
                        placeholder="Cuéntale a la comunidad sobre ti y tu trabajo..."
                        className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 py-2.5 px-3 text-sm focus:border-primary-500 focus:ring-primary-500 outline-none transition-colors border resize-none"
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

export default BasicInfoSection;