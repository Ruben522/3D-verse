import React from "react";
import useModels from "../../hooks/useModels";
import { useTranslation } from "react-i18next";

const ModelInfo = () => {
  const { currentModel, detailUI, updateDetailUI } = useModels();
  const { activeInfoTab } = detailUI;
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div className="flex gap-8 border-b border-gray-100 mb-6">
        <button
          onClick={() => updateDetailUI("activeInfoTab", "detalles")}
          className={`flex items-center gap-2 pb-4 font-bold text-lg transition-colors ${activeInfoTab === "detalles" ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-400 hover:text-gray-600"
            }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          {t("buttons.details")}
        </button>
        <button
          onClick={() => updateDetailUI("activeInfoTab", "comentarios")}
          className={`flex items-center gap-2 pb-4 font-bold text-lg transition-colors ${activeInfoTab === "comentarios" ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-400 hover:text-gray-600"
            }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
          {t("comments.comments")}
        </button>
      </div>

      {activeInfoTab === "detalles" && (
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 font-medium leading-relaxed whitespace-pre-line">
            {currentModel.description || t("model_files.no_description")}
          </p>
        </div>
      )}

      {activeInfoTab === "comentarios" && (
        <div className="text-center py-12 text-yellow-500 font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          Los comentarios estarán disponibles próximamente.
        </div>
      )}
    </div>
  );
};

export default ModelInfo;