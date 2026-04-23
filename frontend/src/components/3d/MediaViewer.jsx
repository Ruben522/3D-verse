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
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      <div className="flex gap-8 border-b border-gray-100 mb-6">
        <button onClick={() => setActiveMediaTab("imagenes")} className={`flex items-center gap-2 pb-4 font-bold text-lg transition-colors ${activeMediaTab === "imagenes" ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-400 hover:text-gray-600"}`}>
          {t("media_viwer.images")}
        </button>
        <button onClick={() => setActiveMediaTab("modelos")} className={`flex items-center gap-2 pb-4 font-bold text-lg transition-colors ${activeMediaTab === "modelos" ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-400 hover:text-gray-600"}`}>
          {t("media_viwer.models")}
        </button>
      </div>

      <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
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
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/5 cursor-pointer" onClick={() => setIsInteractive(true)}>
                <div className="bg-white/90 backdrop-blur px-6 py-4 rounded-2xl shadow-xl flex items-center gap-2">
                  <span className="font-extrabold">{t("media_viwer.clic_interact")}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {activeMediaTab === "modelos" && (
        <div className="flex gap-3 mt-4 overflow-x-auto py-2">
          <button onClick={() => setActive3DUrl(currentModel.fileUrl)} className={`px-4 py-3 rounded-xl font-bold text-sm border-2 ${active3DUrl === currentModel.fileUrl ? "border-primary-600 bg-primary-50 text-primary-700" : "border-gray-200 bg-white"}`}>
            {t("media_viwer.main_model")}
          </button>
          {modelPartsList.map((part) => (
            <button key={part.id} onClick={() => setActive3DUrl(part.fileUrl)} className={`px-4 py-3 rounded-xl font-bold text-sm border-2 ${active3DUrl === part.fileUrl ? "border-primary-600 bg-primary-50 text-primary-700" : "border-gray-200 bg-white"}`}>
              {part.name}
            </button>
          ))}
        </div>
      )}

      {activeMediaTab === "modelos" && isInteractive && (
        <div className="mt-6 flex flex-col gap-6 pt-6 border-t border-gray-100">
          <ColorSelector selectedColor={currentColor} onSelect={setCurrentColor} />

          {detectedParts.length > 1 && (
            <div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setSelectedPart(null)} className={`px-4 py-2 rounded-xl text-xs font-bold border ${selectedPart === null ? "bg-primary-600 text-white" : "bg-gray-50"}`}>Todo</button>
                {detectedParts.map((p) => (
                  <button key={p.uuid} onClick={() => setSelectedPart(p.uuid)} className={`px-4 py-2 rounded-xl text-xs font-bold border ${selectedPart === p.uuid ? "bg-primary-600 text-white" : "bg-gray-50"}`}>{p.name}</button>
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