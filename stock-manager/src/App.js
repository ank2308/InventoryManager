import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import StockPage from "./pages/StockPage";
import SalesPage from "./pages/SalesPage";
import Navbar from "./components/Navbar";
import StockForm from "./components/StockForm";
import SalesForm from "./components/SalesForm";
import AddUserForm from "./components/AddUserForm";
import AddBrandTypePage from "./components/AddBrandType";
import LoginPage from "./pages/LoginPage";
import AddUserss from "./pages/AddUserss";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import AuthContext from "./context/AuthContext";
import {useContext} from "react";
import BrandsList from "./components/BrandsList";
import ManageUsersPage from "./components/ManageUsersPage";
import AddApplicationUserPage from "./pages/AddAplicationUserPage";
import CurrentStockList from "./components/CurrentStockList";

const App = () => {

    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
};

// Navbar Wrapper Component
const NavbarWrapper = ({ children }) => {
    const location = window.location.pathname;

    // Define routes where the Navbar should be hidden
    const hideNavbarRoutes = ["/", "/login"];

    return (
        <>
            {!hideNavbarRoutes.includes(location) && <Navbar />}
            {children}
        </>
    );
};

const AppContent = () => {
    const { loading } = useContext(AuthContext);

    if (loading) {
        // Show a global loading spinner while AuthContext initializes
        return <div>Loading...</div>;
    }

    return (
        <NavbarWrapper>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* Role-Based Protected Routes */}
                <Route
                    path="/home"
                    element={
                        <PrivateRoute allowedRoles={["ROLE_USER", "ROLE_ADMIN"]}>
                            <Home />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/stock"
                    element={
                        <PrivateRoute allowedRoles={["ROLE_USER", "ROLE_ADMIN"]}>
                            <StockPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/current-stock"
                    element={
                        <PrivateRoute allowedRoles={["ROLE_USER", "ROLE_ADMIN"]}>
                            <CurrentStockList />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/stock/add"
                    element={
                        <PrivateRoute allowedRoles={["ROLE_USER","ROLE_ADMIN"]}>
                            <StockForm />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/sales"
                    element={
                        <PrivateRoute allowedRoles={["ROLE_USER", "ROLE_ADMIN"]}>
                            <SalesPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/sales/add"
                    element={
                        <PrivateRoute allowedRoles={["ROLE_USER","ROLE_ADMIN"]}>
                            <SalesForm />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/user/add"
                    element={
                        <PrivateRoute allowedRoles={["ROLE_ADMIN"]}>
                            <AddUserForm />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/addAppUser"
                    element={
                        <PrivateRoute allowedRoles={["ROLE_ADMIN"]}>
                            <AddUserss />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/brand/add"
                    element={
                        <PrivateRoute allowedRoles={["ROLE_ADMIN"]}>
                            <AddBrandTypePage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/brand/list"
                    element={
                        <PrivateRoute allowedRoles={["ROLE_USER","ROLE_ADMIN"]}>
                            <BrandsList />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/user/manage"
                    element={
                        <PrivateRoute allowedRoles={["ROLE_ADMIN"]}>
                            <ManageUsersPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/appuser/add"
                    element={
                        <PrivateRoute allowedRoles={["ROLE_ADMIN"]}>
                            <AddApplicationUserPage />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </NavbarWrapper>
    );
};

export default App;
