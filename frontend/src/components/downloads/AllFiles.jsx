import React from 'react';
import useModels from '../../hooks/useModels';
import Button from "../common/Button";

const AllFiles = () => {
  const { currentModel, isDownloading, downloadPackage } = useModels();

  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-6 animate-fade-in bg-gray-50/50 rounded-3xl border border-gray-100 mt-2">

      <p className="text-gray-500 text-center max-w-md font-medium leading-relaxed px-4">
        Descarga el paquete completo que incluye el modelo principal, todas las piezas preparadas y la galería de imágenes en alta calidad.
      </p>

      {/* Botón con el SVG unificado */}
      <Button
        onClick={() => downloadPackage(currentModel.id, 'all')}
        disabled={isDownloading}
        className="!font-bold !px-8 !py-4 !rounded-2xl shadow-lg shadow-primary-500/30 flex items-center justify-center gap-3 transition-transform hover:-translate-y-0.5"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
        </svg>
        {isDownloading ? "Preparando .zip..." : "Descargar Paquete Completo"}
      </Button>

    </div>
  );
};

export default AllFiles;