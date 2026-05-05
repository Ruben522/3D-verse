import React from 'react';

const BotBar = ({
    title,
    description,
    onCancel,
    cancelText = "Cancelar",
    onSubmit,
    submitText = "Guardar",
    isLoading = false,
    loadingText = "Guardando...",
    formId
}) => {
    return (
        <div className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 p-4 sm:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)] z-50 transition-colors duration-300">
            <div className="max-w-4xl mx-auto flex items-center justify-between">

                <div className="hidden sm:block">
                    <p className="font-bold text-gray-900 dark:text-white transition-colors">{title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">{description}</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 sm:flex-none px-6 py-4 rounded-xl text-lg font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {cancelText}
                    </button>

                    <button
                        type={formId ? "submit" : "button"}
                        form={formId}
                        onClick={!formId ? onSubmit : undefined}
                        disabled={isLoading}
                        className={`flex-1 sm:flex-none px-8 py-4 rounded-xl text-lg font-bold text-white shadow-sm transition-all 
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
    );
};

export default BotBar;