import React from "react";
import Button from "../common/Button";
import { useTranslation } from "react-i18next";

const UserProfile = ({ profile, email, isOwnProfile = false }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 flex flex-col items-center sm:items-start relative">

      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 w-full border-b border-gray-100 pb-8">
        <div className="relative flex-shrink-0">
          <div className="w-32 h-32 rounded-full border-4 border-primary-50 shadow-md overflow-hidden flex items-center justify-center bg-primary-100 text-primary-700 text-5xl font-black">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              profile?.inicial
            )}
          </div>
          {isOwnProfile ? (
            <button className="absolute bottom-2 right-0 bg-white p-2 rounded-full shadow-lg border border-gray-100 text-gray-600 hover:text-primary-600 transition-colors">
              ✏️
            </button>
          ) : null}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-gray-900">{profile?.name} {profile?.lastname}</h1>
          <p className="text-xl text-primary-600 font-bold">@{profile?.username}</p>
        </div>

        {isOwnProfile ? (
          <Button variant="outline" className="!px-4 !py-2 !text-sm">⚙️ {t("settings")}</Button>
        ) : (
          <Button className="!px-6 !py-2 !text-sm">+ {t("follow")}</Button>
        )}
      </div>

      <div className="w-full mt-8 space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-100 pb-2">
          {t("info")}
        </h3>

        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
          <span className="text-gray-500 font-semibold text-sm">{t("member_since")}</span>
          <span className="text-gray-900 font-bold text-sm">{profile?.fechaRegistro}</span>
        </div>

        {isOwnProfile && email ? (
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-gray-500 font-semibold text-sm">{t("email")}</span>
            <span className="text-gray-900 font-bold text-sm">{email}</span>
          </div>
        ) : null}
      </div>

    </div>
  );
};

export default UserProfile;