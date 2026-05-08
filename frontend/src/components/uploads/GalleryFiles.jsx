import React, { useRef } from 'react';
import useModels from '../../hooks/useModels';
import { useTranslation } from 'react-i18next';

const GalleryFiles = () => {
    const { uploadFiles, manejarSeleccionArchivo, eliminarArchivoSeleccionado } = useModels();
    const { t } = useTranslation();
    const fileRef = useRef(null);

    const gallery = uploadFiles?.gallery || [];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white transition-colors">{t("gallery_files.gallery_files")}</h4>
                </div>
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="px-4 py-2 bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-300 font-bold rounded-xl hover:bg-primary-100 dark:hover:bg-primary-500/30 transition-colors text-sm"
                >
                    {t("buttons.put_images")}
                </button>
            </div>

            <input
                type="file"
                ref={fileRef}
                className="hidden"
                multiple
                accept="image/jpeg, image/png, image/webp"
                onChange={(e) => manejarSeleccionArchivo('gallery', e, true)}
            />

            {gallery.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                    {gallery.map((file, index) => {
                        const previewUrl = URL.createObjectURL(file);
                        return (
                            <div key={`${file.name}-${index}`} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200 dark:border-gray-700 transition-colors">
                                <img src={previewUrl} alt={`Preview ${index}`} className="w-full h-full object-cover" />

                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            eliminarArchivoSeleccionado('gallery', e, index);
                                        }}
                                        className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform shadow-sm"
                                        title="Eliminar foto"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div
                    onClick={() => fileRef.current?.click()}
                    className="p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <svg className="w-8 h-8 mb-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p className="text-sm font-medium text-gray-400 dark:text-gray-500 transition-colors">{t("gallery_files.no_images")}</p>
                </div>
            )}
        </div>
    );
};

export default GalleryFiles;