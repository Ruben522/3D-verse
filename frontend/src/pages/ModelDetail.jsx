import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useModels from "../hooks/useModels";
import Button from "../components/common/Button";
import MediaViewer from "../components/models/MediaViewer";
import ModelSidebar from "../components/models/ModelSidebar";
import ModelInfo from "../components/models/ModelInfo";
import ModelFiles from "../components/models/ModelFiles";

const ModelDetail = () => {
  const { id } = useParams();
  const { getModelById, isLoading, error, currentModel } = useModels();

  useEffect(() => {
    if (id) getModelById(id);
  }, [id]);

  if (isLoading || !currentModel) {
    return <p className="text-center py-20 text-gray-500 font-medium bg-surface min-h-screen">Cargando modelo...</p>;
  }

  if (error) {
    return <p className="text-center py-20 text-red-500 font-medium bg-surface min-h-screen">Modelo no encontrado</p>;
  }

  return (
    <div className="min-h-screen bg-surface pb-20">
      {/* Cabecera */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            {currentModel.title}
          </h1>
          <Button onClick={() => console.log("Descargar")}>
            ⬇️ Descargar todo
          </Button>
        </div>
      </div>

      {/* Grid Principal */}
      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda */}
        <div className="lg:col-span-2 space-y-8">
          <MediaViewer />
          <ModelInfo />
          <ModelFiles />
        </div>

        {/* Columna Derecha (Estadísticas y Tags) */}
        <ModelSidebar />
        
      </main>
    </div>
  );
};

export default ModelDetail;