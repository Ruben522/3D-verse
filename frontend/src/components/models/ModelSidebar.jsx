import React from "react";
import useModels from "../../hooks/useModels";

const ModelSidebar = () => {
  const { currentModel } = useModels();

  return (
    <aside className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Estadísticas</h3>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between items-center"><span className="text-gray-500">📥 Descargas</span><span className="font-mono font-bold">{currentModel.downloads}</span></div>
          <div className="flex justify-between items-center"><span className="text-gray-500">❤️ Likes</span><span className="font-mono font-bold">{currentModel.likes}</span></div>
          <div className="flex justify-between items-center"><span className="text-gray-500">👁️ Vistas</span><span className="font-mono font-bold">{currentModel.views}</span></div>
        </div>
      </div>

      {currentModel.tags?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Etiquetas</h3>
          <div className="flex flex-wrap gap-2">
            {currentModel.tags.map((tag, i) => (
              <span key={i} className="bg-gray-50 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-lg border">#{tag}</span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default ModelSidebar;