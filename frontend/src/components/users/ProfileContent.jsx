import React from "react";
import { useTranslation } from "react-i18next";
import ModelCard from "../models/ModelCard";
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

            {/* VISTAS */}
            <div className="min-h-[400px]">

                {/* MODELOS */}
                {activeTab === "modelos" && (
                    <div className="py-6 animate-fade-in">
                        {models.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {models.map((model) => (
                                    <ModelCard key={model.id} model={model} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 border-dashed transition-colors duration-300">
                                <span className="text-6xl mb-4">🏜️</span>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                                    {t("no_designs")}
                                </h3>
                            </div>
                        )}
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