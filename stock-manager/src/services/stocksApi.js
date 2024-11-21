// src/services/api.js

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/stocks';  // Your back-end API URL

// Fetch stock items
export const getStocks = async () => {
    try {
        const response = await axios.get(`${API_URL}/details`);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error("Error fetching stocks", error);
    }
};

// Fetch brand types for available stocks for usedId
export const getBrandTypesForAvailableStocks = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/brands/types/${userId}`); // Adjust URL as needed
        return response.data; // Assuming the API returns an array of brand types
    } catch (error) {
        console.error('Error fetching brand types:', error);
        throw error; // Re-throw the error to handle it in the component
    }
};

// Fetch brand types for available stocks for usedId
export const getBrandNamesForAvailableStocks = async (userId, brandType) => {
    try {
        const response = await axios.get(`${API_URL}/brands/types/${brandType}/${userId}`); // Adjust URL as needed
        return response.data; // Assuming the API returns an array of brand types
    } catch (error) {
        console.error('Error fetching brand types:', error);
        throw error; // Re-throw the error to handle it in the component
    }
};


// Add a new stock item
export const addStock = async (stockData) => {
    try {
        const response = await axios.post(`${API_URL}/add`, stockData);
        return response.data;
    } catch (error) {
        console.error("Error adding stock", error);
    }
};

// Update stock
export const updateStock = async (stockId, stockData) => {
    try {
        const response = await axios.put(`${API_URL}/stocks/${stockId}`, stockData);
        return response.data;
    } catch (error) {
        console.error("Error updating stock", error);
    }
};
