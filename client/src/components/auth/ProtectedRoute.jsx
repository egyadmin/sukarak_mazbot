import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('sukarak_token');
    const userRole = localStorage.getItem('sukarak_user_role');
    const location = useLocation();

    if (!token) {
        // Redirect to appropriate login based on the path
        const loginPath = location.pathname.startsWith('/admin') ? '/admin/login' : '/';
        return <Navigate to={loginPath} replace state={{ from: location }} />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Role not authorized
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
