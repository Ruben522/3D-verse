import React from 'react';

export const messagesStyles = {
    success: {
        container: "bg-green-50 border-green-200 text-green-800",
        iconClass: "text-green-500",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        )
    },
    error: {
        container: "bg-red-50 border-red-200 text-red-800",
        iconClass: "text-red-500",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        )
    },
    warning: {
        container: "bg-yellow-50 border-yellow-200 text-yellow-800",
        iconClass: "text-yellow-500",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        )
    },
    info: {
        container: "bg-blue-50 border-blue-200 text-blue-800",
        iconClass: "text-blue-500",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        )
    },
    confirm: {
        container: "bg-white border-gray-200 text-gray-800",
        iconClass: "text-primary-500",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        )
    }
};