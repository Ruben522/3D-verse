import React from "react";
import useModels from "../../hooks/useModels";
import AllFiles from "../downloads/AllFiles";
import MainFile from "../downloads/MainFile";
import PartsFiles from "../downloads/PartsFiles";
import ImagesFiles from "../downloads/ImagesFiles";
import { useTranslation } from "react-i18next";
const ModelFiles = () => {
  const { currentModel, detailUI, updateDetailUI } = useModels();
  const { t } = useTranslation();

  const activeUploadTab = detailUI?.activeUploadTab || "todo";
  const modelPartsList = currentModel?.parts || [];
  const imageList = currentModel ? [currentModel.imageUrl, ...(currentModel.gallery || [])].filter(Boolean) : [];

  return (
    <>
      {currentModel ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {console.log(currentModel)}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center shadow-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
            </div>
            <h2 className="text-2xl font-black text-gray-900">{t("model_files.available_files")}</h2>
          </div>

          <div className="flex flex-wrap gap-6 sm:gap-8 border-b border-gray-100 mb-6">
            <button
              onClick={() => updateDetailUI("activeUploadTab", "todo")}
              className={`pb-4 font-bold text-lg transition-colors ${activeUploadTab === "todo" ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              {t("buttons.all")}
            </button>

            <button
              onClick={() => updateDetailUI("activeUploadTab", "principal")}
              className={`pb-4 font-bold text-lg transition-colors ${activeUploadTab === "principal" ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              {t("buttons.main")}
            </button>

            {modelPartsList.length > 0 && (
              <button
                onClick={() => updateDetailUI("activeUploadTab", "partes")}
                className={`pb-4 font-bold text-lg transition-colors ${activeUploadTab === "partes" ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-400 hover:text-gray-600"}`}
              >
                {t("buttons.parts")} ({modelPartsList.length})
              </button>
            )}

            {imageList.length > 0 && (
              <button
                onClick={() => updateDetailUI("activeUploadTab", "imagenes")}
                className={`pb-4 font-bold text-lg transition-colors ${activeUploadTab === "imagenes" ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-400 hover:text-gray-600"}`}
              >
                {t("buttons.images")} ({imageList.length})
              </button>
            )}
          </div>

          <div className="min-h-[200px]">
            {activeUploadTab === "todo" ? <AllFiles /> : null}
            {activeUploadTab === "principal" ? <MainFile /> : null}
            {activeUploadTab === "partes" ? <PartsFiles /> : null}
            {activeUploadTab === "imagenes" ? <ImagesFiles /> : null}
          </div>

        </div>
      ) : null}
    </>
  );
};

export default ModelFiles;