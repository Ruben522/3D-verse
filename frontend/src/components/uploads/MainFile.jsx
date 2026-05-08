import React, { useRef } from 'react';
import useModels from '../../hooks/useModels';
import { useTranslation } from 'react-i18next';

const MainFile = () => {
    const {
        uploadFiles,
        uploadErrors,
        manejarSeleccionArchivo,
        eliminarArchivoSeleccionado,
        archivosExistentes
    } = useModels();
    const { t } = useTranslation();
    const fileRef = useRef(null);

    return (
        <div
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-300 
            ${uploadErrors?.main_file
                    ? 'border-red-400 bg-red-50 dark:border-red-500/50 dark:bg-red-900/30'
                    : uploadFiles?.main_file
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                        : archivosExistentes?.main_file
                            ? 'border-primary-400 bg-primary-50/80 dark:border-primary-700 dark:bg-primary-900/20'
                            : 'border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/10 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                }`}
        >
            <input
                type="file"
                ref={fileRef}
                className="hidden"
                accept=".stl,.obj,.glb,.gltf"
                onChange={(e) => manejarSeleccionArchivo('main_file', e)}
            />

            {uploadFiles?.main_file ? (
                <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 mb-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"></path>
                    </svg>
                    <p className="font-bold text-gray-900 dark:text-white truncate max-w-[200px] transition-colors">{uploadFiles.main_file.name}</p>
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-medium transition-colors">
                        {(uploadFiles.main_file.size / (1024 * 1024)).toFixed(2)} {t("model_files.mb")}
                    </p>
                    <button
                        type="button"
                        onClick={(e) => {
                            eliminarArchivoSeleccionado('main_file', e);
                            fileRef.current.value = "";
                            e.stopPropagation();
                        }}
                        className="mt-4 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 px-3 py-1 rounded-lg text-sm font-bold transition-colors"
                    >
                        {t("model_files.delete_file")}
                    </button>
                </div>
            ) : archivosExistentes?.main_file ? (
                <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 mb-3 text-primary-500/80 dark:text-primary-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"></path>
                    </svg>
                    <p className="font-bold text-primary-700 dark:text-primary-400 transition-colors">Archivo 3D Actual Guardado</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">Haz clic para subir uno nuevo y reemplazarlo</p>
                    {uploadErrors?.main_file && <p className="text-red-500 dark:text-red-400 text-sm font-bold mt-2">{uploadErrors.main_file}</p>}
                </div>

            ) : (
                <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 mb-3 text-gray-400 dark:text-gray-500 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"></path>
                    </svg>
                    <p className="font-bold text-gray-900 dark:text-white transition-colors">{t("model_files.model_upload_text")}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">{t("model_files.model_extensions")} ({t("model_files.model_size_limit")})</p>
                    {uploadErrors?.main_file && <p className="text-red-500 dark:text-red-400 text-sm font-bold mt-2">{uploadErrors.main_file}</p>}
                </div>
            )}

        </div>
    );
};

export default MainFile;