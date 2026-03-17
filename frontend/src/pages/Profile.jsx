import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import useUsers from "../hooks/useUsers.js";
import ProfileHeader from "../components/users/ProfileHeader";
import ProfileModels from "../components/users/ProfileModels";

const Profile = () => {
  const { id } = useParams();
  const { 
    currentUser, 
    isAuthenticated, 
    cerrarSesion, 
    publicProfile, 
    getPublicProfile, 
    isLoadingProfile 
  } = useUsers();

  // Estado que controla qué pestaña estamos viendo
  const [activeTab, setActiveTab] = useState("modelos");

  const targetId = id || currentUser?.id;
  const isOwnProfile = currentUser?.id === targetId;

  useEffect(() => {
    if (targetId) getPublicProfile(targetId);
  }, [targetId]);

  // ÚNICO RETURN
  return (
    <>
      {!isAuthenticated && !id ? (
        <Navigate to="/login" replace />
      ) : (
        <div className="min-h-screen bg-surface pb-20">
          
          {isLoadingProfile || !publicProfile ? (
            <div className="flex flex-col justify-center items-center min-h-[60vh]">
              <span className="text-5xl animate-bounce mb-6">🧊</span>
              <p className="text-gray-500 font-bold text-xl">Cargando creador...</p>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
              
              {/* 1. Cabecera Moderna del Perfil */}
              <ProfileHeader 
                profile={publicProfile.profile} 
                stats={publicProfile.stats} 
                isOwnProfile={isOwnProfile}
                cerrarSesion={cerrarSesion}
              />

              {/* 2. Botonera de Pestañas (Tabs) */}
              <div className="flex items-center gap-8 border-b border-gray-200 mb-6 overflow-x-auto custom-scrollbar">
                <button
                  onClick={() => setActiveTab("modelos")}
                  className={`pb-4 font-bold text-lg whitespace-nowrap transition-all ${activeTab === "modelos" ? "text-primary-600 border-b-4 border-primary-600" : "text-gray-500 hover:text-gray-800"}`}
                >
                  🧊 Diseños
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
                  ❤️ Favoritos
                </button>
              </div>

              {/* 3. Contenido Dinámico de la Pestaña */}
              <div className="min-h-[400px]">
                {activeTab === "modelos" ? (
                  /* Usamos nuestro nuevo componente pasándole los modelos */
                  <ProfileModels models={publicProfile.content?.recent_models} />
                ) : null}

                {activeTab === "seguidores" ? (
                  /* AQUÍ IRÁ EL GRID CON LOS USERCARD */
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200 border-dashed">
                    <span className="text-5xl mb-4">🚧</span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Sección en construcción</h3>
                    <p className="text-gray-500 text-center">Aquí pondremos un Grid con UserCards llamando a los seguidores del usuario.</p>
                  </div>
                ) : null}

                {activeTab === "favoritos" ? (
                  /* AQUÍ IRÁ EL GRID CON LOS MODELOS FAVORITOS */
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
      )}
    </>
  );
};

export default Profile;