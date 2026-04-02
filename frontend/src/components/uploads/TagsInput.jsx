import React from 'react';
import useModels from '../../hooks/useModels';

const TagsInput = () => {
    const { uploadData, agregarTag, eliminarTag } = useModels();

    return (
        <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">Etiquetas (Opcional)</label>
            <div className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-500 transition-all flex flex-wrap gap-2 min-h-[52px]">

                {/* Renderizado de los tags creados */}
                {uploadData.tags.map(tag => (
                    <span
                        key={tag}
                        className="flex items-center gap-1.5 bg-primary-100 text-primary-700 px-3 py-1 rounded-lg text-sm font-bold animate-fade-in"
                    >
                        #{tag}
                        <button
                            type="button"
                            onClick={() => eliminarTag(tag)}
                            className="text-primary-500 hover:text-red-500 transition-colors"
                        >
                            &times;
                        </button>
                    </span>
                ))}

                {/* Input para añadir nuevos */}
                <input
                    type="text"
                    onKeyDown={agregarTag}
                    placeholder="Escribe un tag y pulsa Enter o coma (,)"
                    className="flex-1 bg-transparent outline-none min-w-[200px] px-2 py-1 text-sm font-medium text-gray-700"
                />
            </div>
            <p className="text-xs text-gray-400 font-medium mt-1.5 ml-1">Ejemplo: figura, articulado, soporte-facil</p>
        </div>
    );
};

export default TagsInput;