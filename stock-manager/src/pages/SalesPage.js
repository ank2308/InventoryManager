// src/pages/SalesPage.js
import React from 'react';
import SalesForm from '../components/SalesForm';
import SalesList from '../components/SalesList';

const SalesPage = () => {
    return (
        <div>
            <h2>Sales Management</h2>
            <SalesForm />
            <SalesList />
        </div>
    );
};

export default SalesPage;
