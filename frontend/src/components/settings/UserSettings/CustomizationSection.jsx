import React from 'react';
import useUsers from '../../../hooks/useUsers';

const CustomizationSection = () => {
    const { datosPerfil, actualizarDatoPerfil } = useUsers();

    return (
        <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Personalización de tu Tarjeta</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Color Principal</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            name="primary_color"
                            value={datosPerfil.primary_color}
                            onChange={(e) => actualizarDatoPerfil(e)}
                            className="h-10 w-14 rounded cursor-pointer border-0 p-0"
                        />
                        <span className="text-sm font-mono text-gray-500 uppercase">{datosPerfil.primary_color}</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Color de Fondo de Tarjeta</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            name="card_bg_color"
                            value={datosPerfil.card_bg_color}
                            onChange={(e) => actualizarDatoPerfil(e)}
                            className="h-10 w-14 rounded cursor-pointer border-0 p-0"
                        />
                        <span className="text-sm font-mono text-gray-500 uppercase">{datosPerfil.card_bg_color}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomizationSection;