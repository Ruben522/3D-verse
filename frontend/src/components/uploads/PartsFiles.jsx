import React, { useRef } from "react";
import useModels from "../../hooks/useModels";
import { useTranslation } from "react-i18next";

const PartsFiles = () => {
    const {
        uploadFiles,
        manejarSeleccionArchivo,
        eliminarArchivoSeleccionado,
    } = useModels();
    const { t } = useTranslation();

    const fileRef = useRef(null);
    const parts = uploadFiles.parts || [];

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
                <div>
                    <h4 className='font-bold text-gray-900'>
                        {t("parts_files.parts_files")}
                    </h4>
                </div>
                <button
                    type='button'
                    onClick={() => fileRef.current?.click()}
                    className='px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm'
                >
                    {t("buttons.put_parts")}
                </button>
            </div>

            <input
                type='file'
                ref={fileRef}
                className='hidden'
                multiple
                accept='.stl,.obj,.glb,.gltf'
                onChange={(e) => manejarSeleccionArchivo("parts", e, true)}
            />

            {parts.length > 0 ? (
                <div className='flex flex-col gap-2 mt-2'>
                    {parts.map((file, index) => (
                        <div
                            key={`${file.name}-${index}`}
                            className='flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors group'
                        >
                            <div className='flex items-center gap-3 overflow-hidden'>
                                <span className='text-2xl opacity-70'>🧩</span>
                                <div className='truncate'>
                                    <p className='font-bold text-sm text-gray-900 truncate'>
                                        {file.name}
                                    </p>
                                    <p className='text-xs text-gray-500'>
                                        {(file.size / (1024 * 1024)).toFixed(2)}{" "}
                                        {t("model_files.mb")}
                                    </p>
                                </div>
                            </div>
                            <button
                                type='button'
                                onClick={(e) =>
                                    eliminarArchivoSeleccionado(
                                        "parts",
                                        e,
                                        index,
                                    )
                                }
                                className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0'
                                title='Eliminar pieza'
                            >
                                <svg
                                    className='w-5 h-5'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                                    ></path>
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='p-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center bg-gray-50'>
                    <span className='text-3xl mb-2 grayscale opacity-50'>
                        ⚙️
                    </span>
                    <p className='text-sm font-medium text-gray-400'>
                        {t("parts_files.no_parts")}
                    </p>
                </div>
            )}
        </div>
    );
};

export default PartsFiles;
