import React, { createContext, useState, useCallback, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { messagesStyles } from '../utils/MessagesStyle.jsx';
import Message from '../components/messages/Messages.jsx';

const message = createContext();

export const MessageContext = ({ children }) => {
    const [toast, setToast] = useState(null);
    const location = useLocation();
    const timerRef = useRef(null);

    const hideMessage = useCallback(() => {
        setToast(null);
        if (timerRef.current) clearTimeout(timerRef.current);
    }, []);

    useEffect(() => {
        hideMessage();
    }, [location.pathname, hideMessage]);

    const showMessage = useCallback((message, type = 'info') => {
        hideMessage();
        setToast({ message, type });

        timerRef.current = setTimeout(() => {
            hideMessage();
        }, 5000);
    }, [hideMessage]);

    const showConfirm = useCallback((message, onConfirmCallback) => {
        hideMessage();
        setToast({
            message,
            type: 'confirm',
            onConfirm: onConfirmCallback
        });
    }, [hideMessage]);

    const handleConfirm = useCallback(() => {
        if (toast?.onConfirm) toast.onConfirm();
        hideMessage();
    }, [toast, hideMessage]);

    return (
        <message.Provider value={{ showMessage, showConfirm }}>
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