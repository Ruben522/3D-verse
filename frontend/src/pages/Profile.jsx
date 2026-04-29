import React, { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import useUsers from "../hooks/useUsers.js";
import ProfileHeader from "../components/users/ProfileHeader";
import ProfileContent from "../components/users/ProfileContent";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { username } = useParams();
  const { t } = useTranslation();

  const {
    isAuthenticated,
    currentUser,
    cerrarSesion,
    loadProfile,
    activeProfileData,
    isLoadingActiveProfile,
    isOwnProfile,
    activeProfileTab,
    changeProfileTab
  } = useUsers();

  useEffect(() => {
    loadProfile(username);
  }, [username, currentUser]);

  return (
    <div className="min-h-screen bg-surface pb-20">

      {/* LOADING */}
      {(isLoadingActiveProfile || !activeProfileData) ? (
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <p className="text-gray-500 font-bold text-xl">
            {t("messages.loading")}
          </p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">

          <ProfileHeader
            profile={activeProfileData.profile}
            stats={activeProfileData.stats}
            isOwnProfile={isOwnProfile}
            cerrarSesion={isOwnProfile ? cerrarSesion : null}
          />

          <ProfileContent
            activeTab={activeProfileTab}
            onTabChange={changeProfileTab}
            models={activeProfileData.content?.recent_models || []}
            isOwnProfile={isOwnProfile}
          />

        </div>
      )}
    </div>
  );
};

export default Profile;