import React from "react";
import { useTranslation } from "react-i18next";
import UserModels from "../users/UserModels";
import UserFollowers from "../users/UserFollowers";
import UserFollowings from "../users/UserFollowings";
import UserFavorites from "../users/UserFavorites";

const ProfileContent = ({ activeTab, onTabChange, models, isOwnProfile }) => {
    const { t } = useTranslation();
    const tabs = ["modelos", "seguidos", "seguidores", "favoritos"];

    return (
        <>
            {/* TABS */}
            <div className="flex items-center gap-8 border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto custom-scrollbar transition-colors duration-300">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        className={`pb-4 font-bold text-lg whitespace-nowrap transition-all duration-300 ${activeTab === tab
                            ? "text-primary-600 dark:text-primary-400 border-b-4 border-primary-600 dark:border-primary-400"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                            }`}
                    >
                        {isOwnProfile && tab === "modelos" ? t('user.my_models') : t(`user.${tab}`)}
                    </button>
                ))}
            </div>

            <div className="min-h-[400px]">
                {/* MODELOS */}
                {activeTab === "modelos" && (
                    <div className="py-6 animate-fade-in">
                        <UserModels models={models} />
                    </div>
                )}
                {/* SEGUIDORES */}
                {activeTab === "seguidores" && (
                    <div className="py-6 animate-fade-in">
                        <UserFollowers />
                    </div>
                )}
                {/* SEGUIDOS */}
                {activeTab === "seguidos" && (
                    <div className="py-6 animate-fade-in">
                        <UserFollowings />
                    </div>
                )}
                {/* FAVORITOS */}
                {activeTab === "favoritos" && (
                    <div className="py-6 animate-fade-in">
                        <UserFavorites />
                    </div>
                )}
            </div>
        </>
    );
};

export default ProfileContent;