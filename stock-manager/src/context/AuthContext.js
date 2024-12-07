import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // User state
    const [loading, setLoading] = useState(true); // Loading state
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        console.log("Stored User from localStorage:", storedUser);
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error("Error parsing user from localStorage:", error);
            }
        }
        setLoading(false); // Mark loading as complete
    }, []);

    const login = (userData) => {
        console.log("Logging in user:", userData);
        setUser(userData);
        sessionStorage.setItem("user", JSON.stringify(userData));
        sessionStorage.setItem("token", userData.token);
    };

    const logout = () => {
        console.log("Logging out user");
        setUser(null);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
        navigate("/login");
    };

    const hasRole = (roles) => {
        if (!user || !user.roles) return false;
        return roles.some((role) => user.roles.includes(role));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, hasRole, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
