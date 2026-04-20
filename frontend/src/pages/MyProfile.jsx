import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import useUsers from "../hooks/useUsers.js";
import ProfileHeader from "../components/users/ProfileHeader";
import ProfileModels from "../components/users/ProfileModels";

const MyProfile = () => {
    const {
        currentUser,
        isAuthenticated,
        cerrarSesion,
        publicMyProfile,
        getMyPublicProfile,
        isLoadingMyProfile
    } = useUsers();

    const [activeTab, setActiveTab] = useState("modelos");

    useEffect(() => {
        if (isAuthenticated && currentUser?.id) {
            getMyPublicProfile(currentUser.id);
        }
    }, [isAuthenticated, currentUser]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-surface pb-20">
            {isLoadingMyProfile || !publicMyProfile ? (
                <div className="flex flex-col justify-center items-center min-h-[60vh]">
                    <span className="text-5xl animate-bounce mb-6">🧊</span>
                    <p className="text-gray-500 font-bold text-xl">Cargando tu perfil...</p>
                </div>
            ) : (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">

                    <ProfileHeader
                        profile={publicMyProfile.profile}
                        stats={publicMyProfile.stats}
                        isOwnProfile={true}
                        cerrarSesion={cerrarSesion}
                    />

                    <div className="flex items-center gap-8 border-b border-gray-200 mb-6 overflow-x-auto custom-scrollbar">
                        <button
                            onClick={() => setActiveTab("modelos")}
                            className={`pb-4 font-bold text-lg whitespace-nowrap transition-all ${activeTab === "modelos" ? "text-primary-600 border-b-4 border-primary-600" : "text-gray-500 hover:text-gray-800"}`}
                        >
                            🧊 Mis Diseños
                        </button>
                        <button
                            onClick={() => setActiveTab("seguidores")}
                            className={`pb-4 font-bold text-lg whitespace-nowrap transition-all ${activeTab === "seguidores" ? "text-primary-600 border-b-4 border-primary-600" : "text-gray-500 hover:text-gray-800"}`}
                        >
                            👥 Seguidores
                        </button>
                        <button
                            onClick={() => setActiveTab("favoritos")}
                            className={`pb-4 font-bold text-lg whitespace-nowrap transition-all ${activeTab === "favoritos" ? "text-primary-600 border-b-4 border-primary-600" : "text-gray-500 hover:text-gray-800"}`}
                        >
                            ❤️ Guardados
                        </button>
                    </div>

                    <div className="min-h-[400px]">
                        {activeTab === "modelos" ? (
                            <ProfileModels models={publicMyProfile.content?.recent_models} />
                        ) : null}

                        {/* Resto de pestañas... */}
                        {activeTab === "seguidores" ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200 border-dashed">
                                <span className="text-5xl mb-4">🚧</span>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Sección en construcción</h3>
                                <p className="text-gray-500 text-center">Aquí pondremos un Grid con UserCards llamando a los seguidores del usuario.</p>
                            </div>
                        ) : null}

                        {activeTab === "favoritos" ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200 border-dashed">
                                <span className="text-5xl mb-4">🚧</span>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Sección en construcción</h3>
                                <p className="text-gray-500 text-center">Aquí pintaremos ProfileModels pero pasándole los favoritos.</p>
                            </div>
                        ) : null}
                    </div>

                </div>
            )}
        </div>
    );
};

export default MyProfile;