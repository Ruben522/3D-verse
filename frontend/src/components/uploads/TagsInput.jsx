import React from 'react';
import useModels from '../../hooks/useModels';
import { useTranslation } from 'react-i18next';

const TagsInput = () => {
    const { uploadData, agregarTag, eliminarTag } = useModels();
    const { t } = useTranslation();

    return (
        <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-2 transition-colors">
                {t("model_files.tags")}
            </label>
            {/* Contenedor principal que simula ser un input */}
            <div className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus-within:bg-white dark:focus-within:bg-gray-800 focus-within:ring-2 focus-within:ring-primary-500 dark:focus-within:ring-primary-500 transition-all flex flex-wrap gap-2 min-h-[52px]">

                {uploadData.tags.map(tag => (
                    <span
                        key={tag}
                        className="flex items-center gap-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-lg text-sm font-bold animate-fade-in transition-colors"
                    >
                        #{tag}
                        <button
                            type="button"
                            onClick={() => eliminarTag(tag)}
                            className="text-primary-500 dark:text-primary-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                            &times;
                        </button>
                    </span>
                ))}

                {/* Input real donde el usuario escribe */}
                <input
                    type="text"
                    onKeyDown={agregarTag}
                    placeholder={t("model_files.tags_placeholder")}
                    className="flex-1 bg-transparent outline-none min-w-[200px] px-2 py-1 text-sm font-medium text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1.5 ml-1 transition-colors">
                {t("model_files.tags_example")}
            </p>
        </div>
    );
};

export default TagsInput;