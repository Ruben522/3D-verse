import React, { useRef } from 'react';
import useModels from '../../hooks/useModels';
import { useTranslation } from 'react-i18next';

const MainFile = () => {
    const {
        uploadFiles,
        uploadErrors,
        manejarSeleccionArchivo,
        eliminarArchivoSeleccionado
    } = useModels();
    const { t } = useTranslation();
    const fileRef = useRef(null);

    return (
        <div
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${uploadErrors?.main_file ? 'border-red-400 bg-red-50' :
                uploadFiles?.main_file ? 'border-primary-500 bg-primary-50' : 'border-primary-200 bg-primary-50/50 hover:bg-primary-50'
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
                    <span className="text-4xl mb-2">📦</span>
                    <p className="font-bold text-gray-900 truncate max-w-[200px]">{uploadFiles.main_file.name}</p>
                    <p className="text-sm text-primary-600 font-medium">
                        {(uploadFiles.main_file.size / (1024 * 1024)).toFixed(2)} {t("model_files.mb")}
                    </p>
                    <button
                        type="button"
                        onClick={(e) => {
                            eliminarArchivoSeleccionado('main_file', e);
                            fileRef.current.value = "";
                        }}
                        className="mt-4 text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg text-sm font-bold transition-colors"
                    >
                        {t("model_files.delete_file")}
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <span className="text-4xl mb-2">🧊</span>
                    <p className="font-bold text-gray-900">{t("model_files.model_upload_text")}</p>
                    <p className="text-sm text-gray-500">{t("model_files.model_extensions")} ({t("model_files.model_size_limit")})</p>
                    {uploadErrors?.main_file && <p className="text-red-500 text-sm font-bold mt-2">{uploadErrors.main_file}</p>}
                </div>
            )}
        </div>
    );
};

export default MainFile;