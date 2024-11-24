// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import StockPage from "./pages/StockPage";
import SalesPage from "./pages/SalesPage";
import Navbar from "./components/Navbar";
import StockForm from "./components/StockForm";
import SalesForm from "./components/SalesForm";
import AddUserForm from "./components/AddUserForm";
import AddBrandTypePage from "./components/AddBrandType";
import LoginPage from "./pages/LoginPage";
import AddUserPage from "./pages/AddUserPage";
import UnauthorizedPage from "./pages/UnauthorizedPage"; // Add Unauthorized page
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
    const location = useLocation();

    // Define routes where the Navbar should be hidden
    const hideNavbarRoutes = ["/","/login"];

    return (
        <AuthProvider>
            <div>
                {/* Conditionally render the Navbar */}
                {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<AddUserPage />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />

                    {/* Role-Based Protected Routes */}

                    <Route path="/home" element={
                        <PrivateRoute allowedRoles={["USER", "ADMIN"]}>
                        <Home />
                        </PrivateRoute>} />

                    <Route
                        path="/stock"
                        element={
                            <PrivateRoute allowedRoles={["USER", "ADMIN"]}>
                                <StockPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/stock/add"
                        element={
                            <PrivateRoute allowedRoles={["ADMIN"]}>
                                <StockForm />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/sales"
                        element={
                            <PrivateRoute allowedRoles={["USER", "ADMIN"]}>
                                <SalesPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/sales/add"
                        element={
                            <PrivateRoute allowedRoles={["ADMIN"]}>
                                <SalesForm />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/user/add"
                        element={
                            <PrivateRoute allowedRoles={["ADMIN"]}>
                                <AddUserForm />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/addAppUser"
                        element={
                            <PrivateRoute allowedRoles={["ADMIN"]}>
                                <AddUserPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/brand/add"
                        element={
                            <PrivateRoute allowedRoles={["ADMIN"]}>
                                <AddBrandTypePage />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </div>
        </AuthProvider>
    );
};

const AppWithRouter = () => (
    <Router>
        <App />
    </Router>
);

export default AppWithRouter;
