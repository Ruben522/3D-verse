import React from "react";
import useModels from "../../hooks/useModels";

const ModelInfo = () => {
  const { currentModel, detailUI, updateDetailUI } = useModels();
  const { activeInfoTab } = detailUI;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex gap-8 border-b border-gray-100 mb-6">
        <button
          onClick={() => updateDetailUI("activeInfoTab", "detalles")}
          className={`pb-4 font-bold text-lg transition-colors ${
            activeInfoTab === "detalles" ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          📝 Detalles
        </button>
        <button
          onClick={() => updateDetailUI("activeInfoTab", "comentarios")}
          className={`pb-4 font-bold text-lg transition-colors ${
            activeInfoTab === "comentarios" ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          💬 Comentarios
        </button>
      </div>

      {activeInfoTab === "detalles" && (
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {currentModel.description || "El autor no ha proporcionado una descripción para este modelo."}
          </p>
        </div>
      )}
      
      {activeInfoTab === "comentarios" && (
        <div className="text-center py-10 text-gray-500 italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
          {/* Aquí irá tu futuro componente <CommentList modelId={currentModel.id} /> */}
          Los comentarios estarán disponibles próximamente.
        </div>
      )}
    </div>
  );
};

export default ModelInfo;