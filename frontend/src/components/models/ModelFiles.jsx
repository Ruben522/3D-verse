import React from "react";
import useModels from "../../hooks/useModels";

const ModelFiles = () => {
  const { currentModel } = useModels();
  const modelPartsList = currentModel?.parts || [];

  if (modelPartsList.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        📦 Archivos individuales ({modelPartsList.length})
      </h3>
      <div className="space-y-3">
        {modelPartsList.map((part) => (
          <div key={part.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary-200 transition-colors">
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800">{part.name}</span>
              <span className="text-xs text-gray-500 mt-1 font-mono">
                {part.size ? `${(part.size / 1024 / 1024).toFixed(2)} MB` : "Tamaño desconocido"}
              </span>
            </div>
            <a 
              href={part.fileUrl} 
              download 
              className="text-primary-600 bg-white border border-primary-200 hover:bg-primary-600 hover:text-white text-sm font-bold px-4 py-2 rounded-lg transition-all shadow-sm"
            >
              Descargar
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelFiles;