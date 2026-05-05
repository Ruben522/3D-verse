import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useModels from "../hooks/useModels";
import Button from "../components/common/Button";
import MediaViewer from "../components/3d/MediaViewer";
import ModelSidebar from "../components/models/ModelSidebar";
import ModelInfo from "../components/models/ModelInfo";
import ModelFiles from "../components/models/ModelFiles";
import ModelAuthor from "../components/models/ModelAuthor";
import { useTranslation } from "react-i18next";
import Viewer3DContext from "../contexts/Viewer3DContext";

const ModelDetail = () => {
  const { id } = useParams();
  const { getModelById, isFetchingModel, modelError, currentModel, downloadPackage } = useModels();
  const { t } = useTranslation();

  useEffect(() => {
    if (id) getModelById(id);
  }, [id]);

  return (
    <Viewer3DContext>
      {/* Eliminamos bg-surface para heredar el fondo oscuro global */}
      <div className="min-h-screen pb-20 transition-colors duration-300">
        {isFetchingModel ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg transition-colors">{t('messages.loading')}</p>
          </div>
        ) : modelError ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-red-500 dark:text-red-400 font-medium text-lg transition-colors">{t('messages.no_model')}</p>
          </div>
        ) : currentModel ? (
          <>
            {/* Cabecera */}
            <div className="max-w-7xl mx-auto px-6 py-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors">
                  {currentModel.title}
                </h1>
                <ModelAuthor />
                <Button onClick={() => downloadPackage(currentModel.id, 'all')} className="text-sm px-6 py-3">
                  {t('buttons.download')}
                </Button>
              </div>
            </div>

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
    </Viewer3DContext>
  );
};

export default ModelDetail;