import React, { useEffect } from "react";
import useModels from "../../hooks/useModels";
import useViewer3D from "../../hooks/useViewer3D";
import View3D from "./View3D";
import ColorSelector from "../../utils/ColorSelector";
import { useTranslation } from "react-i18next";

const MediaViewer = () => {
  const { currentModel } = useModels();
  const {
    activeMediaTab, setActiveMediaTab,
    mainImage, setMainImage,
    active3DUrl, setActive3DUrl,
    isInteractive, setIsInteractive,
    detectedParts, handlePartsDetected,
    selectedPart, setSelectedPart,
    currentColor, setCurrentColor,
    resetViewer
  } = useViewer3D();
  const { t } = useTranslation();

  useEffect(() => {
    if (currentModel) resetViewer(currentModel);
  }, [currentModel, resetViewer]);

  const modelPartsList = currentModel?.parts || [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">

      <div className="flex gap-8 border-b border-gray-100 dark:border-gray-700 mb-6 transition-colors duration-300">
        <button
          onClick={() => setActiveMediaTab("imagenes")}
          className={`flex items-center gap-2 pb-4 font-bold text-lg transition-colors 
            ${activeMediaTab === "imagenes"
              ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400"
              : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
        >
          {t("media_viwer.images")}
        </button>
        <button
          onClick={() => setActiveMediaTab("modelos")}
          className={`flex items-center gap-2 pb-4 font-bold text-lg transition-colors 
            ${activeMediaTab === "modelos"
              ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400"
              : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
        >
          {t("media_viwer.models")}
        </button>
      </div>

      <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        {activeMediaTab === "imagenes" && (
          <img src={mainImage} alt={currentModel?.title} className="w-full h-full object-cover block" />
        )}

        {activeMediaTab === "modelos" && active3DUrl && (
          <div className="w-full h-full relative">
            <View3D
              currentModelUrl={active3DUrl}
              color={currentColor}
              selectedPart={selectedPart}
              onPartsDetected={handlePartsDetected}
            />
            {!isInteractive && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/5 dark:bg-black/20 cursor-pointer transition-colors duration-300" onClick={() => setIsInteractive(true)}>
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur px-6 py-4 rounded-2xl shadow-xl flex items-center gap-2 text-gray-900 dark:text-white transition-colors duration-300">
                  <span className="font-extrabold">{t("media_viwer.clic_interact")}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {activeMediaTab === "modelos" && (
        <div className="flex gap-3 mt-4 overflow-x-auto py-2">
          <button
            onClick={() => setActive3DUrl(currentModel.fileUrl)}
            className={`px-4 py-3 rounded-xl font-bold text-sm border-2 transition-colors duration-300 whitespace-nowrap
              ${active3DUrl === currentModel.fileUrl
                ? "border-primary-600 dark:border-primary-500/50 bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
          >
            {t("media_viwer.main_model")}
          </button>

          {modelPartsList.map((part) => (
            <button
              key={part.id}
              onClick={() => setActive3DUrl(part.fileUrl)}
              className={`px-4 py-3 rounded-xl font-bold text-sm border-2 transition-colors duration-300 whitespace-nowrap
                ${active3DUrl === part.fileUrl
                  ? "border-primary-600 dark:border-primary-500/50 bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
            >
              {part.name}
            </button>
          ))}
        </div>
      )}

      {activeMediaTab === "modelos" && isInteractive && (
        <div className="mt-6 flex flex-col gap-6 pt-6 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <ColorSelector selectedColor={currentColor} onSelect={setCurrentColor} />

          {detectedParts.length > 1 && (
            <div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedPart(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors duration-300 
                    ${selectedPart === null
                      ? "bg-primary-600 dark:bg-primary-500 text-white border-transparent"
                      : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                >
                  Todo
                </button>
                {detectedParts.map((p) => (
                  <button
                    key={p.uuid}
                    onClick={() => setSelectedPart(p.uuid)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors duration-300 
                      ${selectedPart === p.uuid
                        ? "bg-primary-600 dark:bg-primary-500 text-white border-transparent"
                        : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaViewer;