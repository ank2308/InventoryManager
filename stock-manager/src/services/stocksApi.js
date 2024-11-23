// src/services/api.js

import axiosInstance from "./axiosInstance";

// Fetch stock items
export const getStocks = async () => {
    try {
        const response = await axiosInstance.get("/api/stocks/details");
        console.log(response)
        return response.data;
    } catch (error) {
        console.error("Error fetching stocks", error);
    }
};

// Fetch brand types for available stocks for usedId
export const getBrandTypesForAvailableStocks = async (userId) => {
    try {
        const response = await axiosInstance.get(`/api/stocks/brands/types/${userId}`); // Adjust URL as needed
        return response.data; // Assuming the API returns an array of brand types
    } catch (error) {
        console.error('Error fetching brand types:', error);
        throw error; // Re-throw the error to handle it in the component
    }
};

// Fetch brand types for available stocks for usedId
export const getBrandNamesForAvailableStocks = async (userId, brandType) => {
    try {
        const response = await axiosInstance.get(`/api/stocks/brands/types/${brandType}/${userId}`); // Adjust URL as needed
        return response.data; // Assuming the API returns an array of brand types
    } catch (error) {
        console.error('Error fetching brand types:', error);
        throw error; // Re-throw the error to handle it in the component
    }
};


// Add a new stock item
export const addStock = async (stockData) => {
    try {
        const response = await axiosInstance.post(`/api/stocks/add`, stockData);
        return response.data;
    } catch (error) {
        console.error("Error adding stock", error);
    }
};

// Update stock
export const updateStock = async (stockId, stockData) => {
    try {
        const response = await axiosInstance.put(`/api/stocks/stocks/${stockId}`, stockData);
        return response.data;
    } catch (error) {
        console.error("Error updating stock", error);
    }
};
