import React from "react";
import useModels from "../../hooks/useModels";
import View3D from "./View3D";
import ColorSelector from "./ColorSelector";

const MediaViewer = () => {
  const { currentModel, detailUI, updateDetailUI } = useModels();
  const { activeMediaTab, mainImage, active3DUrl, isInteractive, detectedParts, selectedPart, currentColor } = detailUI;

  const modelPartsList = currentModel?.parts || [];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      <div className="flex gap-8 border-b border-gray-100 mb-6">
        <button
          onClick={() => updateDetailUI("activeMediaTab", "imagenes")}
          className={`flex items-center gap-2 pb-4 font-bold text-lg transition-colors ${activeMediaTab === "imagenes" ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-400 hover:text-gray-600"}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          Imágenes
        </button>
        <button
          onClick={() => updateDetailUI("activeMediaTab", "modelos")}
          className={`flex items-center gap-2 pb-4 font-bold text-lg transition-colors ${activeMediaTab === "modelos" ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-400 hover:text-gray-600"}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          Modelos 3D
        </button>
      </div>

      <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
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
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
                  <span className="font-extrabold text-gray-800">Clica para interactuar</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {activeMediaTab === "imagenes" && currentModel.gallery?.length > 0 && (
        <div className="flex gap-3 mt-4 overflow-x-auto py-2 custom-scrollbar">
          <img src={currentModel.imageUrl} onClick={() => updateDetailUI("mainImage", currentModel.imageUrl)} alt="Portada" className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 flex-shrink-0 transition-all ${mainImage === currentModel.imageUrl ? 'border-primary-600 scale-105 shadow-md' : 'border-transparent hover:border-gray-300'}`} />
          {currentModel.gallery.map((imgUrl, index) => (
            <img key={index} src={imgUrl} onClick={() => updateDetailUI("mainImage", imgUrl)} alt={`Miniatura ${index}`} className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 flex-shrink-0 transition-all ${mainImage === imgUrl ? 'border-primary-600 scale-105 shadow-md' : 'border-transparent hover:border-gray-300'}`} />
          ))}
        </div>
      )}

      {activeMediaTab === "modelos" && (
        <div className="flex gap-3 mt-4 overflow-x-auto py-2 custom-scrollbar">
          <button onClick={() => updateDetailUI("active3DUrl", currentModel.fileUrl)} className={`px-4 py-3 rounded-xl font-bold text-sm flex-shrink-0 flex items-center gap-2 border-2 transition-all ${active3DUrl === currentModel.fileUrl ? "border-primary-600 bg-primary-50 text-primary-700 shadow-sm" : "border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:bg-gray-50"}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            Modelo Principal
          </button>
          {modelPartsList.map((part) => (
            <button key={part.id} onClick={() => updateDetailUI("active3DUrl", part.fileUrl)} className={`px-4 py-3 rounded-xl font-bold text-sm flex-shrink-0 flex items-center gap-2 border-2 transition-all ${active3DUrl === part.fileUrl ? "border-primary-600 bg-primary-50 text-primary-700 shadow-sm" : "border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:bg-gray-50"}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path></svg>
              {part.name}
            </button>
          ))}
        </div>
      )}

      {activeMediaTab === "modelos" && isInteractive && (
        <div className="mt-6 flex flex-col gap-6 pt-6 border-t border-gray-100">
          <div className="w-full">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Color de la pieza</p>
            <ColorSelector selectedColor={currentColor} onSelect={(c) => updateDetailUI("currentColor", c)} />
          </div>

          {detectedParts.length > 1 && (
            <div className="w-full">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Partes Internas</p>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                <button onClick={() => updateDetailUI("selectedPart", null)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedPart === null ? "bg-primary-600 text-white shadow-md border-primary-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}>Todas</button>
                {detectedParts.map((p) => (
                  <button key={p.uuid} onClick={() => updateDetailUI("selectedPart", p.uuid)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedPart === p.uuid ? "bg-primary-600 text-white shadow-md border-primary-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}>{p.name}</button>
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