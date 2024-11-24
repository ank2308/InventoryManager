import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
    const { auth } = useContext(AuthContext);

    if (!auth) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" />;
    }

    const userRoles = auth.roles || [];
    const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

    return hasAccess ? children : <Navigate to="/unauthorized" />;
};

export default PrivateRoute;
