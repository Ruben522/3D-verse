import React, { useEffect } from 'react';
import useUsers from '../../../hooks/useUsers';
import BasicInfoSection from './BasicInfoSection';
import CustomizationSection from './CustomizationSection';
import SocialMediaSection from './SocialMediaSection';

const UserSettings = () => {
    const {
        cargarDatosConfiguracion,
        guardarCambiosPerfil,
        isUpdatingProfile
    } = useUsers();

    useEffect(() => {
        cargarDatosConfiguracion();
    }, []);

    return (
        <form onSubmit={(e) => guardarCambiosPerfil(e)} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">

            <BasicInfoSection />
            <CustomizationSection />
            <SocialMediaSection />

            <div className="pt-5 flex justify-end border-t border-gray-100">
                <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className={`inline-flex justify-center rounded-lg px-8 py-3 text-sm font-bold text-white shadow-sm transition-all
                        ${isUpdatingProfile ? 'bg-primary-400 cursor-wait' : 'bg-primary-600 hover:bg-primary-700 hover:shadow-md active:scale-95'}`}
                >
                    {isUpdatingProfile ? 'Guardando cambios...' : 'Guardar Perfil'}
                </button>
            </div>

        </form>
    );
};

export default UserSettings;