import React, { useRef } from 'react';
import useModels from '../../hooks/useModels';

const GalleryFiles = () => {
    const { uploadFiles, manejarSeleccionArchivo, eliminarArchivoSeleccionado } = useModels();
    const fileRef = useRef(null);

    // Array de archivos de galería en el estado actual
    const gallery = uploadFiles.gallery || [];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-gray-900">Galería de Imágenes</h4>
                    <p className="text-sm text-gray-500">Muestra tu modelo desde diferentes ángulos.</p>
                </div>
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="px-4 py-2 bg-primary-50 text-primary-600 font-bold rounded-xl hover:bg-primary-100 transition-colors text-sm"
                >
                    + Añadir Fotos
                </button>
            </div>

            <input
                type="file"
                ref={fileRef}
                className="hidden"
                multiple
                accept="image/jpeg, image/png, image/webp"
                // Pasamos "true" como tercer parámetro para indicar que es múltiple
                onChange={(e) => manejarSeleccionArchivo('gallery', e, true)}
            />

            {/* Grid de previsualizaciones */}
            {gallery.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                    {gallery.map((file, index) => {
                        // Generamos URL al vuelo para previsualizar
                        const previewUrl = URL.createObjectURL(file);
                        return (
                            <div key={`${file.name}-${index}`} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200">
                                <img src={previewUrl} alt={`Preview ${index}`} className="w-full h-full object-cover" />

                                {/* Capa oscura con botón de borrar (solo visible al pasar el ratón) */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={(e) => eliminarArchivoSeleccionado('gallery', e, index)}
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
                <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center bg-gray-50">
                    <span className="text-3xl mb-2 grayscale opacity-50">📸</span>
                    <p className="text-sm font-medium text-gray-400">Aún no hay fotos adicionales.</p>
                </div>
            )}
        </div>
    );
};

export default GalleryFiles;