// src/services/saleApi.js

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/sale';  // Your back-end API URL

// Record a sale
export const addSale = async (saleData) => {
    try {
        const response = await axios.post(`${API_URL}/day-wise`, saleData);

        return response.data;
    } catch (error) {
        console.error("Error recording sale", error);
    }
};

// Fetch sales data
export const getSales = async () => {
    try {
        const response = await axios.get(`${API_URL}/sales`);
        return response.data;
    } catch (error) {
        console.error("Error fetching sales", error);
    }
};
