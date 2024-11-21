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

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/stock" element={<StockPage />} />
                <Route path="/stock/add" element={<StockForm />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/sales/add" element={<SalesForm />} />
                <Route path="/user/add" element={<AddUserForm />} />
            </Routes>
        </Router>
    );
};

export default App;
