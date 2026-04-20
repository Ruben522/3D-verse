import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useModels from "../hooks/useModels";
import Button from "../components/common/Button";
import MediaViewer from "../components/models/MediaViewer";
import ModelSidebar from "../components/models/ModelSidebar";
import ModelInfo from "../components/models/ModelInfo";
import ModelFiles from "../components/models/ModelFiles";
import ModelAuthor from "../components/models/ModelAuthor";

const ModelDetail = () => {
  const { id } = useParams();
  const { getModelById, isFetchingModel, modelError, currentModel, downloadPackage } = useModels();

  useEffect(() => {
    if (id) getModelById(id);
  }, [id]);

  return (
    <div className="min-h-screen bg-surface pb-20">
      {isFetchingModel ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-500 font-medium text-lg">Cargando modelo...</p>
        </div>
      ) : modelError ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-red-500 font-medium text-lg">⚠️ Modelo no encontrado en la base de datos.</p>
        </div>
      ) : currentModel ? (
        <>
          {/* Cabecera */}
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                {currentModel.title}
              </h1>
              <ModelAuthor />
              <Button onClick={() => downloadPackage(currentModel.id, 'all')} className="text-sm px-6 py-3">
                Descargar
              </Button>
            </div>
          </div>

          {/* Grid Principal */}
          <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna Izquierda */}
            <div className="lg:col-span-2 space-y-8">
              <MediaViewer />
              <ModelFiles />
              <ModelInfo />
            </div>

            {/* Columna Derecha */}
            <ModelSidebar />
          </main>
        </>
      ) : null}
    </div>
  );
};

export default ModelDetail;