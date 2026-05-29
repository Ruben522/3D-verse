import React, { useRef } from 'react';
import useModels from '../../hooks/useModels';
import { useTranslation } from 'react-i18next';

const PartsFiles = () => {
    const { uploadFiles, manejarSeleccionArchivo, eliminarArchivoSeleccionado } = useModels();
    const fileRef = useRef(null);

    const parts = uploadFiles.parts || [];

    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white transition-colors">{t('upload_page.parts_files.parts_files_title')}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">{t('upload_page.parts_files.parts_files_desc')}</p>
                </div>
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="px-4 py-2 bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-300 font-bold rounded-xl hover:bg-primary-100 dark:hover:bg-primary-500/30 transition-colors text-sm"
                >
                    {t('buttons.put_parts')}
                </button>
            </div>

            <input
                type="file"
                ref={fileRef}
                className="hidden"
                multiple
                accept=".stl,.obj,.glb,.gltf"
                onChange={(e) => manejarSeleccionArchivo('parts', e, true)}
            />

            {parts.length > 0 ? (
                <div className="flex flex-col gap-2 mt-2">
                    {parts.map((file, index) => (
                        <div key={`${file.name}-${index}`} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-colors group">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <svg className="w-6 h-6 text-primary-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                </svg>
                                <div className="truncate">
                                    <p className="font-bold text-sm text-gray-900 dark:text-white truncate transition-colors">{file.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => eliminarArchivoSeleccionado('parts', e, index)}
                                className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors flex-shrink-0"
                                title="Eliminar pieza"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div
                    onClick={() => fileRef.current?.click()}
                    className="p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <svg className="w-8 h-8 mb-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                    <p className="text-sm font-medium text-gray-400 dark:text-gray-500 transition-colors">{t('upload_page.parts_files.no_parts')}</p>
                </div>
            )}
        </div>
    );
};

export default PartsFiles;