import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useUsers from "../hooks/useUsers.js";
import ProfileHeader from "../components/users/ProfileHeader";
import ProfileModels from "../components/users/ProfileModels";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { username } = useParams();
  const { publicProfile, getPublicProfile, isLoadingProfile } = useUsers();
  const [activeTab, setActiveTab] = useState("modelos");
  const { t } = useTranslation();

  useEffect(() => {
    if (username) {
      getPublicProfile(username);
    }
  }, [username]);

  return (
    <div className="min-h-screen bg-surface pb-20">
      {isLoadingProfile || !publicProfile ? (
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <p className="text-gray-500 font-bold text-xl">{t('messages.loading_creator')}</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">

          <ProfileHeader
            profile={publicProfile.profile}
            stats={publicProfile.stats}
            isOwnProfile={false}
          />

          <div className="flex items-center gap-8 border-b border-gray-200 mb-6 overflow-x-auto custom-scrollbar">
            <button
              onClick={() => setActiveTab("modelos")}
              className={`pb-4 font-bold text-lg whitespace-nowrap transition-all ${activeTab === "modelos" ? "text-primary-600 border-b-4 border-primary-600" : "text-gray-500 hover:text-gray-800"}`}
            >
              {t('user.models')}
            </button>
            <button
              onClick={() => setActiveTab("seguidores")}
              className={`pb-4 font-bold text-lg whitespace-nowrap transition-all ${activeTab === "seguidores" ? "text-primary-600 border-b-4 border-primary-600" : "text-gray-500 hover:text-gray-800"}`}
            >
              {t('user.followers')}
            </button>
            <button
              onClick={() => setActiveTab("favoritos")}
              className={`pb-4 font-bold text-lg whitespace-nowrap transition-all ${activeTab === "favoritos" ? "text-primary-600 border-b-4 border-primary-600" : "text-gray-500 hover:text-gray-800"}`}
            >
              {t('user.favorites')}
            </button>
          </div>

          <div className="min-h-[400px]">
            {activeTab === "modelos" ? (
              <ProfileModels models={publicProfile.content?.recent_models} />
            ) : null}

            {activeTab === "seguidores" ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200 border-dashed">
                <span className="text-5xl mb-4">🚧</span>
                <h3 className="text-xl font-bold text-yellow-900 mb-2">Sección en construcción</h3>
                <p className="text-gray-500 text-center">Aquí pondremos un Grid con UserCards llamando a los seguidores del usuario.</p>
              </div>
            ) : null}

            {activeTab === "favoritos" ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200 border-dashed">
                <span className="text-5xl mb-4">🚧</span>
                <h3 className="text-xl font-bold text-yellow-900 mb-2">Sección en construcción</h3>
                <p className="text-gray-500 text-center">Aquí pintaremos ProfileModels pero pasándole los favoritos.</p>
              </div>
            ) : null}
          </div>

        </div>
      )}
    </div>
  );
};

export default Profile;