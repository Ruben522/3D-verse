import React from "react";
import useModels from "../../hooks/useModels";
import AllFiles from "../uploads/AllFiles";
import MainFile from "../uploads/MainFile";
import PartsFiles from "../uploads/PartsFiles";
import ImagesFiles from "../uploads/ImagesFiles";

const ModelFiles = () => {
  const { currentModel, detailUI, updateDetailUI } = useModels();
  
  const activeUploadTab = detailUI?.activeUploadTab || "todo";
  const modelPartsList = currentModel?.parts || [];
  const imageList = currentModel ? [currentModel.imageUrl, ...(currentModel.gallery || [])].filter(Boolean) : [];

  return (
    <>
      {currentModel ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">📦 Archivos del Modelo</h2>

          {/* Selector de Pestañas */}
          <div className="flex flex-wrap gap-6 sm:gap-8 border-b border-gray-100 mb-6">
            <button 
              onClick={() => updateDetailUI("activeUploadTab", "todo")} 
              className={`pb-4 font-bold text-lg transition-colors ${activeUploadTab === "todo" ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              Todo
            </button>
            
            <button 
              onClick={() => updateDetailUI("activeUploadTab", "principal")} 
              className={`pb-4 font-bold text-lg transition-colors ${activeUploadTab === "principal" ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              Principal
            </button>
            
            {modelPartsList.length > 0 && (
              <button 
                onClick={() => updateDetailUI("activeUploadTab", "partes")} 
                className={`pb-4 font-bold text-lg transition-colors ${activeUploadTab === "partes" ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-400 hover:text-gray-600"}`}
              >
                Partes ({modelPartsList.length})
              </button>
            )}
            
            {imageList.length > 0 && (
              <button 
                onClick={() => updateDetailUI("activeUploadTab", "imagenes")} 
                className={`pb-4 font-bold text-lg transition-colors ${activeUploadTab === "imagenes" ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-400 hover:text-gray-600"}`}
              >
                Imágenes ({imageList.length})
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