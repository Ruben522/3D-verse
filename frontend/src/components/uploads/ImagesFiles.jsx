import React from 'react';
import useModels from '../../hooks/useModels';
import Button from "../common/Button";

const ImagesFiles = () => {
  const { currentModel, isDownloading, downloadPackage } = useModels();
  const imageList = currentModel ? [currentModel.imageUrl, ...(currentModel.gallery || [])].filter(Boolean) : [];

  return (
    <div className="space-y-6 py-4 animate-fade-in">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <p className="text-sm text-gray-500">Imágenes de referencia y renderizados ({imageList.length})</p>
        <Button
          onClick={() => downloadPackage(currentModel.id, 'gallery')}
          disabled={isDownloading}
          className="text-sm font-bold text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {isDownloading ? "⏳ Comprimiendo..." : "🖼️ Bajar galería (.zip)"}
        </Button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {imageList.map((imgUrl, index) => {
          return (
            <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
              <img src={imgUrl} alt={`Galería ${index}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImagesFiles;