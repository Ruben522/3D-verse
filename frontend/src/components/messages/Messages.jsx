import React, { useEffect } from 'react';
import { messagesStyles } from '../../utils/messagesStyle.jsx';

const Messages = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const currentStyle = messagesStyles[type] || messagesStyles.info;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] animate-fade-in transform transition-all duration-300 translate-y-0 opacity-100">
            <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-xl backdrop-blur-sm ${currentStyle.container}`}>
                <svg className={`w-6 h-6 flex-shrink-0 ${currentStyle.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {currentStyle.svg}
                </svg>
                <p className="font-bold text-sm pr-2">{message}</p>
                <button
                    onClick={onClose}
                    className="ml-auto p-1 hover:bg-black/5 rounded-full transition-colors"
                >
                    <svg className="w-4 h-4 opacity-50 hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Messages;