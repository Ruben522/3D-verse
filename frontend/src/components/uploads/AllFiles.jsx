import React from 'react';
import useModels from '../../hooks/useModels';
import Button from "../common/Button";

const AllFiles = () => {
  const { currentModel, isDownloading, downloadPackage } = useModels();

  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-fade-in">
      <p className="text-gray-500 text-center max-w-md">
        Descarga el paquete completo que incluye el modelo principal, todas las piezas preparadas y la galería de imágenes en alta calidad.
      </p>
      <Button
        onClick={() => downloadPackage(currentModel.id, 'all')}
        disabled={isDownloading}
        className={`font-bold px-8 py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${isDownloading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
      >
        {isDownloading ? "⏳ Preparando .zip..." : "⬇️ Descargar Paquete Completo"}
      </Button>
    </div>
  );
};

export default AllFiles;