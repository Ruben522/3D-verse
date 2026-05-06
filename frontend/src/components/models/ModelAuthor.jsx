import React from "react";
import { useNavigate } from "react-router-dom";
import useModels from "../../hooks/useModels";
import { useTranslation } from "react-i18next";

const ModelAuthor = () => {
    const navigate = useNavigate();
    const { currentModel } = useModels();
    const { t } = useTranslation();

    return (
        <div
            onClick={() => navigate(`/perfil/${currentModel.username}`)}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full pl-1 pr-4 py-1 cursor-pointer shadow-sm hover:shadow-md hover:border-primary-300 dark:hover:border-primary-500/50 hover:-translate-y-0.5 transition-all duration-300 group w-fit"
        >
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-900">
                {currentModel.avatarUrl ? (
                    <img
                        src={currentModel.avatarUrl}
                        alt={currentModel.username}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-white font-bold text-sm transition-colors duration-300">
                        {currentModel.username.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>

            <div className="flex flex-col justify-center">
                <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 leading-none mt-0.5">
                    @{currentModel.username}
                </span>
                <span className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1 transition-colors duration-300 leading-none">
                    {t("user.creator")}
                </span>
            </div>
        </div>
    );
};

export default ModelAuthor;