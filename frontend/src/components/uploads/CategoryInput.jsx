import React from 'react';
import useModels from '../../hooks/useModels';
import { useTranslation } from 'react-i18next';

const CategoryInput = () => {
    const { uploadData, categoriasDisponibles, toggleCategoria } = useModels();
    const { t } = useTranslation();

    return (
        <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">{t("model_files.categories")}</label>
            <div className="flex flex-wrap gap-2.5 mt-2">
                {categoriasDisponibles.map(cat => {
                    const isSelected = uploadData.categories.includes(cat.id);

                    return (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => toggleCategoria(cat.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${isSelected
                                ? 'bg-primary-500 text-white border-primary-500 shadow-md transform scale-105'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                                }`}
                        >
                            {cat.name}
                        </button>
                    );
                })}
            </div>
            <p className="text-xs text-gray-400 font-medium mt-2 ml-1">{t("model_files.categories_text")}</p>
        </div>
    );
};

export default CategoryInput;