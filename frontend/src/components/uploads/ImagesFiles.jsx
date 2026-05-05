import React, { useRef } from 'react';
import useModels from '../../hooks/useModels';
import { useTranslation } from 'react-i18next';

const ImagesFiles = () => {
    const {
        uploadFiles,
        uploadErrors,
        manejarSeleccionArchivo,
        eliminarArchivoSeleccionado
    } = useModels();
    const { t } = useTranslation();

    const fileRef = useRef(null);
    const previewUrl = uploadFiles?.main_image ? URL.createObjectURL(uploadFiles.main_image) : null;

    return (
        <div
            onClick={() => fileRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 overflow-hidden min-h-[250px] 
            ${uploadErrors?.main_image
                    ? 'border-red-400 bg-red-50 dark:border-red-500/50 dark:bg-red-900/30'
                    : previewUrl
                        ? 'border-transparent shadow-sm'
                        : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
        >
            <input
                type="file"
                ref={fileRef}
                className="hidden"
                accept="image/jpeg, image/png, image/webp"
                onChange={(e) => manejarSeleccionArchivo('main_image', e)}
            />

            {previewUrl ? (
                <div className="absolute inset-0 w-full h-full group">
                    <img src={previewUrl} alt="Portada" className="w-full h-full object-cover" />

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            type="button"
                            onClick={(e) => {
                                eliminarArchivoSeleccionado('main_image', e);
                                fileRef.current.value = "";
                            }}
                            className="bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 border border-transparent dark:border-gray-700 px-4 py-2 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
                        >
                            Cambiar Portada
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center p-8">
                    <span className="text-4xl mb-2">🖼️</span>
                    <p className="font-bold text-gray-900 dark:text-white transition-colors">Imagen de Portada</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">{t('galley_files.images_type.jpg')} {t('words.or')} {t('galley_files.images_type.png')}</p>
                    {uploadErrors?.main_image && <p className="text-red-500 dark:text-red-400 text-sm font-bold mt-2 transition-colors">{uploadErrors.main_image}</p>}
                </div>
            )}
        </div>
    );
};

export default ImagesFiles;