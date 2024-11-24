import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user, hasRole, loading } = useContext(AuthContext);

    console.log("AuthContext in PrivateRoute:", { user, loading });

    if (loading) {
        // Show a loading indicator while AuthContext is being initialized
        return <div>Loading...</div>;
    }

    if (!user) {
        console.log("User is not authenticated. Redirecting to login...");
        return <Navigate to="/login" />;
    }

    if (!hasRole(allowedRoles)) {
        console.log("User lacks required roles. Redirecting to unauthorized...");
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default PrivateRoute;
