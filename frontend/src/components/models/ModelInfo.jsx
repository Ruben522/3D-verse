import React from "react";
import useModels from "../../hooks/useModels";
import CommentsSection from "../comments/CommentsSection";
import { useTranslation } from "react-i18next";

const ModelInfo = () => {
  const { currentModel, detailUI, updateDetailUI } = useModels();
  const { activeInfoTab } = detailUI;
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 transition-colors duration-300">
      <div className="flex gap-8 border-b border-gray-100 dark:border-gray-700 mb-6 transition-colors duration-300">
        <button
          onClick={() => updateDetailUI("activeInfoTab", "detalles")}
          className={`flex items-center gap-2 pb-4 font-bold text-lg transition-colors duration-300 
            ${activeInfoTab === "detalles"
              ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400"
              : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          {t("buttons.details")}
        </button>
        <button
          onClick={() => updateDetailUI("activeInfoTab", "comentarios")}
          className={`flex items-center gap-2 pb-4 font-bold text-lg transition-colors duration-300 
            ${activeInfoTab === "comentarios"
              ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400"
              : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
          {t(`comments.comments`)}
        </button>
      </div>

      {activeInfoTab === "detalles" && (
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed whitespace-pre-line transition-colors duration-300">
            {currentModel.description || t("model_files.no_description")}
          </p>
        </div>
      )}

      {activeInfoTab === "comentarios" && (
        <div className="mt-4 animate-fade-in">
          <CommentsSection modelId={currentModel.id} />
        </div>
      )}
    </div>
  );
};

export default ModelInfo;