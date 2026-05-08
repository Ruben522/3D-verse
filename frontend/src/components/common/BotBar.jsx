import React from 'react';

const BotBar = ({
    title,
    description,
    onCancel,
    onDelete,
    deleteText = "Eliminar",
    isEditMode,
    cancelText = "Cancelar",
    onSubmit,
    submitText = "Guardar",
    isLoading = false,
    loadingText = "Guardando...",
    formId
}) => {
    return (
        <div className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 p-4 sm:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)] z-50 transition-colors duration-300">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                <div className="hidden sm:block flex-1">
                    <p className="font-bold text-gray-900 dark:text-white transition-colors">{title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">{description}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto flex-1 sm:flex-none">
                    {isEditMode && (
                        <button
                            type="button"
                            onClick={onDelete}
                            disabled={isLoading}
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-3 sm:px-5 sm:py-3 rounded-xl font-bold transition-colors text-base flex items-center gap-2 disabled:opacity-50"
                            title={deleteText}
                        >
                            <svg className="w-6 h-6 sm:w-5 sm:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span className="hidden xs:inline-block">{deleteText}</span>
                        </button>
                    )}

                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {cancelText}
                        </button>

                        <button
                            type={formId ? "submit" : "button"}
                            form={formId}
                            onClick={!formId ? onSubmit : undefined}
                            disabled={isLoading}
                            className={`flex-1 sm:flex-none px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-bold text-white shadow-sm transition-all whitespace-nowrap
                            ${isLoading
                                    ? 'bg-primary-400 dark:bg-primary-500/50 cursor-wait'
                                    : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400 hover:shadow-lg active:scale-95'
                                }`}
                        >
                            {isLoading ? loadingText : submitText}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BotBar;