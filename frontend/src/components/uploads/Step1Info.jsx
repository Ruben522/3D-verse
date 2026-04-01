import React from 'react';
import useModels from '../../hooks/useModels';

const Step1Info = () => {
    // Consumimos el contexto directamente aquí para mantener el código limpio
    const { uploadData, actualizarDatoSubida, uploadErrors } = useModels();

    // Mock de categorías (Esto en el futuro lo traerás de tu backend con un useCategories)
    const categorias = [
        { id: "1", name: "Personajes / Miniaturas" },
        { id: "2", name: "Accesorios / Props" },
        { id: "3", name: "Hogar / Decoración" },
        { id: "4", name: "Herramientas" }
    ];

    // ÚNICO RETURN
    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Información Básica</h2>
                <p className="text-gray-500 text-sm">Cuéntanos sobre tu diseño para que la comunidad pueda encontrarlo fácilmente.</p>
            </div>

            <div className="flex flex-col gap-4">
                {/* TÍTULO */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="title" className="text-sm font-bold text-gray-700">Título del modelo *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={uploadData.title}
                        onChange={actualizarDatoSubida}
                        placeholder="Ej: Figura de Arthas 15cm"
                        className={`px-4 py-3 rounded-xl border ${uploadErrors?.title ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all font-medium`}
                    />
                    {uploadErrors?.title && <span className="text-xs font-bold text-red-500">{uploadErrors.title}</span>}
                </div>

                {/* CATEGORÍA */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="category_id" className="text-sm font-bold text-gray-700">Categoría *</label>
                    <select
                        id="category_id"
                        name="category_id"
                        value={uploadData.category_id}
                        onChange={actualizarDatoSubida}
                        className={`px-4 py-3 rounded-xl border ${uploadErrors?.category_id ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all font-medium text-gray-700`}
                    >
                        <option value="">Selecciona una categoría...</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    {uploadErrors?.category_id && <span className="text-xs font-bold text-red-500">{uploadErrors.category_id}</span>}
                </div>

                {/* DESCRIPCIÓN */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="description" className="text-sm font-bold text-gray-700">Descripción *</label>
                    <textarea
                        id="description"
                        name="description"
                        value={uploadData.description}
                        onChange={actualizarDatoSubida}
                        rows="4"
                        placeholder="Explica los detalles de impresión, recomendaciones de soportes, historia del diseño..."
                        className={`px-4 py-3 rounded-xl border ${uploadErrors?.description ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all font-medium resize-none`}
                    />
                    {uploadErrors?.description && <span className="text-xs font-bold text-red-500">{uploadErrors.description}</span>}
                </div>
            </div>
        </div>
    );
};

export default Step1Info;