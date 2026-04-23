import React, { createContext, useState, useCallback } from 'react';
import Message from '../components/messages/Messages.jsx';

const message = createContext();

export const MessageContext = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showMessage = useCallback((message, type = 'info') => {
        setToast({ message, type });
    }, []);

    const hideMessage = useCallback(() => {
        setToast(null);
    }, []);

    const styles = {
        success: {
            container: "bg-green-50 border-green-200 text-green-800",
            icon: "text-green-500",
            svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        },
        error: {
            container: "bg-red-50 border-red-200 text-red-800",
            icon: "text-red-500",
            svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        },
        warning: {
            container: "bg-yellow-50 border-yellow-200 text-yellow-800",
            icon: "text-yellow-500",
            svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        },
        info: {
            container: "bg-blue-50 border-blue-200 text-blue-800",
            icon: "text-blue-500",
            svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        }
    };

    return (
        <message.Provider value={{ showMessage }}>
            {children}
            {toast && (
                <Message
                    message={toast.message}
                    type={toast.type}
                    onClose={hideMessage}
                />
            )}
        </message.Provider>
    );
};

export { message };
export default MessageContext;