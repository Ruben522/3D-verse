import React, { useRef } from 'react';
import useModels from '../../hooks/useModels';
import { useTranslation } from 'react-i18next';

const ImagesFiles = () => {
    const {
        uploadFiles,
        uploadErrors,
        manejarSeleccionArchivo,
        eliminarArchivoSeleccionado,
        archivosExistentes
    } = useModels();

    const { t } = useTranslation();
    const fileRef = useRef(null);

    const isNewImage = !!uploadFiles?.main_image;

    const previewUrl = isNewImage
        ? URL.createObjectURL(uploadFiles.main_image)
        : archivosExistentes?.main_image || null;

    return (
        <div
            onClick={() => fileRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 overflow-hidden min-h-[250px]
            ${uploadErrors?.main_image
                    ? 'border-red-400 bg-red-50 dark:border-red-500/50 dark:bg-red-900/30'
                    : previewUrl
                        ? 'border-transparent shadow-sm'
                        : 'border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/10 hover:bg-primary-50 dark:hover:bg-primary-900/20'
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
                    <img
                        src={previewUrl}
                        alt="Portada"
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            type="button"
                            onClick={(e) => {
                                if (isNewImage) {
                                    eliminarArchivoSeleccionado('main_image', e);
                                    fileRef.current.value = "";
                                } else {
                                    e.stopPropagation();
                                    fileRef.current?.click();
                                }
                            }}
                            className={`px-4 py-2 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform border border-transparent dark:border-gray-700
                                ${isNewImage
                                    ? 'bg-white dark:bg-gray-800 text-red-600 dark:text-red-400'
                                    : 'bg-primary-500 text-white'
                                }`}
                        >
                            {isNewImage
                                ? 'Quitar Nueva Portada'
                                : 'Reemplazar Portada'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center p-8">
                    <svg
                        className="w-14 h-14 mb-4 text-gray-400 dark:text-gray-500 opacity-70"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 16.5V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25v-.75z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 15l4.5-4.5a1.5 1.5 0 012.12 0L14 15" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 14l1.5-1.5a1.5 1.5 0 012.12 0L21 17" />
                        <circle cx="8.5" cy="8.5" r="1.25" strokeWidth="1.5" />
                    </svg>

                    <p className="font-bold text-gray-900 dark:text-white transition-colors">
                        Imagen de Portada
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                        JPG, PNG o WEBP
                    </p>

                    {uploadErrors?.main_image && (
                        <p className="text-red-500 dark:text-red-400 text-sm font-bold mt-2 transition-colors">
                            {uploadErrors.main_image}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImagesFiles;