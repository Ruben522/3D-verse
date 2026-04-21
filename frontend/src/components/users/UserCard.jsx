import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const UserCard = ({ user }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-all group">
      <div className="w-20 h-20 rounded-full border-2 border-primary-100 overflow-hidden mb-4 group-hover:border-primary-500 transition-colors flex items-center justify-center bg-primary-100 text-primary-700 text-3xl font-black">
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
        ) : (
          user?.inicial
        )}
      </div>

      <h3 className="font-extrabold text-gray-900 text-lg truncate w-full">{user?.name || user?.username}</h3>
      <p className="text-sm font-medium text-primary-600 mb-4 truncate w-full">@{user?.username}</p>

      <Link
        to={`/perfil/${user?.id}`}
        className="w-full py-2 bg-gray-50 text-gray-700 font-bold text-sm rounded-xl border border-gray-200 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 transition-colors block"
      >
        {t("view_profile")}
      </Link>
    </div>
  );
};

export default UserCard;