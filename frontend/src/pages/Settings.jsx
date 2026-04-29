import React, { useState } from 'react';
import UserSettings from '../components/settings/UserSettings/UserSettings';
// import PrivateUserSettings from '../components/settings/PrivateUserSettings/PrivateUserSettings';

const Settings = () => {
    // Estado para controlar qué pestaña de configuración estamos viendo
    const [activeTab, setActiveTab] = useState('public');

    return (
        <div className="min-h-screen bg-surface py-12 px-4 sm:px-6 pb-32">
            <div className="max-w-4xl mx-auto">

                {/* Cabecera */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900">Configuración</h1>
                    <p className="text-gray-500 mt-2">Gestiona tu perfil público y las preferencias de tu cuenta.</p>
                </div>

                {/* Sistema de Pestañas (Preparado para escalar) */}
                <div className="border-b border-gray-200 mb-8">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('public')}
                            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-bold text-sm transition-colors ${activeTab === 'public'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Perfil Público
                        </button>

                        <button
                            onClick={() => setActiveTab('private')}
                            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-bold text-sm transition-colors ${activeTab === 'private'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Cuenta y Seguridad
                        </button>
                    </nav>
                </div>

                {/* Renderizado dinámico según la pestaña */}
                {activeTab === 'public' && <UserSettings />}

                {activeTab === 'private' && (
                    <div className="p-8 text-center text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                        {/* <PrivateUserSettings /> */}
                        🔒 Configuración de correo y contraseña próximamente...
                    </div>
                )}

            </div>
        </div>
    );
};

export default Settings;