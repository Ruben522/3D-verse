import React from "react";
import { useTranslation } from "react-i18next";
import ModelCard from "../models/ModelCard";

const ProfileContent = ({ activeTab, onTabChange, models, isOwnProfile }) => {
    const { t } = useTranslation();
    const tabs = ["modelos", "seguidores", "favoritos"];

    return (
        <>
            {/* TABS */}
            <div className="flex items-center gap-8 border-b border-gray-200 mb-6 overflow-x-auto custom-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        className={`pb-4 font-bold text-lg whitespace-nowrap transition-all ${activeTab === tab
                                ? "text-primary-600 border-b-4 border-primary-600"
                                : "text-gray-500 hover:text-gray-800"
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
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200 border-dashed">
                                <span className="text-6xl mb-4">🏜️</span>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {t("no_designs")}
                                </h3>
                            </div>
                        )}
                    </div>
                )}

                {/* SEGUIDORES */}
                {activeTab === "seguidores" && (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200 border-dashed">
                        <span className="text-5xl mb-4">🚧</span>
                        <h3 className="text-xl font-bold text-yellow-900 mb-2">
                            Sección en construcción
                        </h3>
                    </div>
                )}

                {/* FAVORITOS */}
                {activeTab === "favoritos" && (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200 border-dashed">
                        <span className="text-5xl mb-4">🚧</span>
                        <h3 className="text-xl font-bold text-yellow-900 mb-2">
                            Sección en construcción
                        </h3>
                    </div>
                )}
            </div>
        </>
    );
};

export default ProfileContent;