import React, { createContext, useState, useCallback, useRef } from 'react';
import { messagesStyles } from '../utils/TempStyle.jsx';
import Message from '../components/messages/Messages.jsx';

const message = createContext();

export const MessageContext = ({ children }) => {
    const [toast, setToast] = useState(null);
    const timerRef = useRef(null);

    const hideMessage = useCallback(() => {
        setToast(null);
        if (timerRef.current) clearTimeout(timerRef.current);
    }, []);

    const showMessage = useCallback((messageText, type = 'info') => {
        hideMessage();
        setToast({ message: messageText, type });

        timerRef.current = setTimeout(() => {
            hideMessage();
        }, 5000);
    }, [hideMessage]);

    const showConfirm = useCallback((messageText, onConfirmCallback) => {
        hideMessage();
        setToast({
            message: messageText,
            type: 'confirm',
            onConfirm: onConfirmCallback
        });
    }, [hideMessage]);

    const handleConfirm = useCallback(() => {
        if (toast?.onConfirm) toast.onConfirm();
        hideMessage();
    }, [toast, hideMessage]);

    const exportData = {
        showMessage,
        showConfirm
    }

    return (
        <message.Provider value={exportData}>
            {children}
            {toast && (
                <Message
                    message={toast.message}
                    isConfirm={toast.type === 'confirm'}
                    config={messagesStyles[toast.type] || messagesStyles.info}
                    onClose={hideMessage}
                    onConfirm={handleConfirm}
                />
            )}
        </message.Provider>
    );
};

export { message };
export default MessageContext;