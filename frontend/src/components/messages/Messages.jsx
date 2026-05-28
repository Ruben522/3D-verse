import React, { useEffect } from 'react';
import { messagesStyles } from '../../utils/MessagesStyle.jsx';
import { useTranslation } from "react-i18next";

const Messages = ({ message, isConfirm, config, onClose, onConfirm }) => {
    const { t } = useTranslation();

    return isConfirm ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-colors duration-300" onClick={onClose} title="Haz clic fuera para cancelar" />

            <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 flex flex-col px-6 py-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 transform scale-100 transition-colors duration-300">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-2xl transition-colors duration-300">
                        <svg className={`w-8 h-8 ${config.iconClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {config.icon}
                        </svg>
                    </div>
                    <h3 className="font-black text-xl text-gray-900 dark:text-white transition-colors duration-300">Confirmación</h3>
                </div>

                <p className="font-medium text-gray-600 dark:text-gray-300 mt-2 ml-1 leading-relaxed transition-colors duration-300">
                    {message}
                </p>

                <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-gray-100/60 dark:border-gray-700/60 transition-colors duration-300">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                        {t('buttons.cancel')}
                    </button>
                    <button onClick={onConfirm} className="px-6 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                        {t('buttons.confirm')}
                    </button>
                </div>
            </div>
        </div>

    ) : (
        <div className="fixed top-20 right-4 z-[9999] animate-fade-in">
            <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-xl backdrop-blur-sm transition-colors duration-300 ${config.container}`}>
                <svg className={`w-6 h-6 flex-shrink-0 ${config.iconClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {config.icon}
                </svg>
                <p className="font-bold text-sm pr-2">{message}</p>
                <button onClick={onClose} className="ml-auto p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
                    <svg className="w-4 h-4 opacity-50 hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Messages;