// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import StockPage from './pages/StockPage';
import SalesPage from './pages/SalesPage';
import Navbar from "./components/Navbar";
import StockForm from "./components/StockForm";
import SalesForm from "./components/SalesForm";
import AddUserForm from "./components/AddUserForm";
import AddBrandTypePage from "./components/AddBrandType";
import LoginPage from "./pages/LoginPage";
import AddUserPage from "./pages/AddUserPage";

const App = () => {
    const location = useLocation();

    // Define routes where the Navbar should be hidden
    const hideNavbarRoutes = ["/login"];

    return (
        <div>
            {/* Conditionally render the Navbar */}
            {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/stock" element={<StockPage />} />
                <Route path="/stock/add" element={<StockForm />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/sales/add" element={<SalesForm />} />
                <Route path="/user/add" element={<AddUserForm />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/addAppUser" element={<AddUserPage />} />
                <Route path="/brand/add" element={<AddBrandTypePage />} />
            </Routes>
        </div>
    );
};

const AppWithRouter = () => (
    <Router>
        <App />
    </Router>
);

export default AppWithRouter;
