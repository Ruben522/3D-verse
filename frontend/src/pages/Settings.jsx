import React, { useEffect, useState } from 'react';
import UserSettings from '../components/settings/UserSettings/UserSettings.jsx';
import CustomizationSection from '../components/settings/UserSettings/CustomizationSection';
import useUsers from '../hooks/useUsers';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const {
        cargarDatosConfiguracion,
        guardarCambiosPerfil,
        isUpdatingProfile,
        currentUser,
    } = useUsers();

    useEffect(() => {
        if (currentUser) {
            cargarDatosConfiguracion();
        }
    }, [currentUser]);

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Configuración
            </h1>

            <form
                onSubmit={guardarCambiosPerfil}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
                {/* Tabs */}
                <div className="flex overflow-x-auto border-b border-gray-200">
                    <button
                        type="button"
                        onClick={() => setActiveTab('profile')}
                        className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors outline-none ${activeTab === 'profile'
                                ? 'border-b-2 border-primary-500 text-primary-600'
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        Perfil Público
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('customization')}
                        className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors outline-none ${activeTab === 'customization'
                                ? 'border-b-2 border-primary-500 text-primary-600'
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        Personalización y Diseño
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                    {activeTab === 'profile' && <UserSettings />}

                    {activeTab === 'customization' && (
                        <CustomizationSection />
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 md:px-8 py-5 border-t border-gray-100 flex justify-end bg-gray-50/80">
                    <button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className={`inline-flex justify-center rounded-xl px-8 py-3 text-sm font-bold text-white shadow-sm transition-all ${isUpdatingProfile
                                ? 'bg-primary-400 cursor-wait'
                                : 'bg-primary-600 hover:bg-primary-700 hover:shadow-md active:scale-95'
                            }`}
                    >
                        {isUpdatingProfile
                            ? 'Guardando cambios...'
                            : 'Guardar cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;