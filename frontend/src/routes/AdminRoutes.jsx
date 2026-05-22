import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useUsers from '../hooks/useUsers';
import useMessage from '../hooks/useMessage';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, currentUser, isAuthLoading } = useUsers();
    const { showMessage } = useMessage();

    useEffect(() => {
        if (!isAuthLoading && currentUser && !isAdmin) {
            showMessage("No tienes permisos para acceder a esta zona.", "error");
        }
    }, [isAuthLoading, isAdmin, currentUser, showMessage]);

    if (isAuthLoading || (isAuthenticated && !currentUser)) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children ? children : <Outlet />;
};

export default AdminRoute;