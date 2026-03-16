import React from 'react';
import useModels from '../../hooks/useModels';
import Button from "../common/Button";

const PartsFiles = () => {
  const { currentModel, isDownloading, downloadPackage } = useModels();
  const modelPartsList = currentModel?.parts || [];

  return (
    <div className="space-y-6 py-4 animate-fade-in">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <p className="text-sm text-gray-500">Listado de piezas individuales ({modelPartsList.length})</p>
        <Button
          onClick={() => downloadPackage(currentModel.id, 'parts')}
          disabled={isDownloading}
          className="text-sm font-bold text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {isDownloading ? "⏳ Comprimiendo..." : "📥 Bajar todo (.zip)"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {modelPartsList.map((part) => (
          <div key={part.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors">
            <div className="flex flex-col truncate pr-4">
              <span className="font-semibold text-gray-800 text-base truncate">{part.name}</span>
              <span className="text-sm text-gray-500 mt-1 font-mono">
                {part.size ? `${(part.size / 1024 / 1024).toFixed(2)} MB` : "Pieza STL/GLB"}
              </span>
            </div>
            <a 
              href={part.fileUrl} 
              download 
              className="text-gray-600 hover:text-primary-600 bg-white border border-gray-200 hover:border-primary-300 text-sm font-bold px-4 py-2 rounded-lg transition-all shadow-sm flex-shrink-0"
            >
              Bajar
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartsFiles;