import React from "react";
import useModels from "../../hooks/useModels";
import View3D from "./View3D";
import ColorSelector from "./ColorSelector";

const MediaViewer = () => {
  const { currentModel, detailUI, updateDetailUI } = useModels();
  const { activeMediaTab, mainImage, active3DUrl, isInteractive, detectedParts, selectedPart, currentColor } = detailUI;

  const modelPartsList = currentModel?.parts || [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex gap-8 border-b border-gray-100 mb-6">
        <button onClick={() => updateDetailUI("activeMediaTab", "imagenes")} className={`pb-4 font-bold text-lg transition-colors ${activeMediaTab === "imagenes" ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-400 hover:text-gray-600"}`}>🖼️ Imágenes</button>
        <button onClick={() => updateDetailUI("activeMediaTab", "modelos")} className={`pb-4 font-bold text-lg transition-colors ${activeMediaTab === "modelos" ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-400 hover:text-gray-600"}`}>🧊 Modelos 3D</button>
      </div>

      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
        {activeMediaTab === "imagenes" && (
          <img src={mainImage} alt={currentModel.title} className="w-full h-full object-cover block" onError={(e) => { e.target.src = 'https://via.placeholder.com/800x450?text=Sin+Imagen'; }} />
        )}

        {activeMediaTab === "modelos" && active3DUrl && (
          <div className="w-full h-full relative">
            <View3D 
              currentModelUrl={active3DUrl} 
              color={currentColor} 
              selectedPart={selectedPart} 
              onPartsDetected={(parts) => updateDetailUI("detectedParts", parts)} 
            />
            {!isInteractive && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors cursor-pointer" onClick={() => updateDetailUI("isInteractive", true)}>
                <div className="bg-white/90 backdrop-blur px-6 py-4 rounded-2xl shadow-xl flex flex-col items-center gap-2 transform transition-transform hover:scale-105">
                  <span className="text-2xl">👆</span><span className="font-extrabold text-gray-800">Clica para interactuar</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Carrusel de Imágenes */}
      {activeMediaTab === "imagenes" && currentModel.gallery?.length > 0 && (
        <div className="flex gap-3 mt-4 overflow-x-auto py-2 custom-scrollbar">
          <img src={currentModel.imageUrl} onClick={() => updateDetailUI("mainImage", currentModel.imageUrl)} alt="Portada" className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 flex-shrink-0 transition-all ${mainImage === currentModel.imageUrl ? 'border-primary-600 scale-105' : 'border-transparent hover:border-gray-300'}`} />
          {currentModel.gallery.map((imgUrl, index) => (
            <img key={index} src={imgUrl} onClick={() => updateDetailUI("mainImage", imgUrl)} alt={`Miniatura ${index}`} className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 flex-shrink-0 transition-all ${mainImage === imgUrl ? 'border-primary-600 scale-105' : 'border-transparent hover:border-gray-300'}`} />
          ))}
        </div>
      )}

      {/* Botonera de Partes 3D */}
      {activeMediaTab === "modelos" && (
        <div className="flex gap-3 mt-4 overflow-x-auto py-2 custom-scrollbar">
          <button onClick={() => updateDetailUI("active3DUrl", currentModel.fileUrl)} className={`px-4 py-3 rounded-xl font-bold text-sm flex-shrink-0 flex items-center gap-2 border-2 transition-all ${active3DUrl === currentModel.fileUrl ? "border-primary-600 bg-primary-50 text-primary-700" : "border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:bg-gray-50"}`}>
            🧊 Modelo Principal
          </button>
          {modelPartsList.map((part) => (
            <button key={part.id} onClick={() => updateDetailUI("active3DUrl", part.fileUrl)} className={`px-4 py-3 rounded-xl font-bold text-sm flex-shrink-0 flex items-center gap-2 border-2 transition-all ${active3DUrl === part.fileUrl ? "border-primary-600 bg-primary-50 text-primary-700" : "border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:bg-gray-50"}`}>
              🧩 {part.name}
            </button>
          ))}
        </div>
      )}

      {/* Selector de colores y Partes Internas */}
      {activeMediaTab === "modelos" && isInteractive && (
        <div className="mt-6 flex flex-col gap-6 pt-6 border-t border-gray-100">
          <div className="w-full">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Color de la pieza</p>
            <ColorSelector selectedColor={currentColor} onSelect={(c) => updateDetailUI("currentColor", c)} />
          </div>

          {detectedParts.length > 1 && (
            <div className="w-full">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Partes Internas</p>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                <button onClick={() => updateDetailUI("selectedPart", null)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${selectedPart === null ? "bg-primary-600 text-white" : "bg-gray-50 text-gray-600"}`}>Todas</button>
                {detectedParts.map((p) => (
                  <button key={p.uuid} onClick={() => updateDetailUI("selectedPart", p.uuid)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${selectedPart === p.uuid ? "bg-primary-600 text-white" : "bg-gray-50 text-gray-600"}`}>{p.name}</button>
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