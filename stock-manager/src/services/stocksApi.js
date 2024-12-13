// src/services/api.js

import axiosInstance from "./axiosInstance";

// Fetch stock items
export const fetchStockData = async (stockRequestDTO) => {
    try {
        console.log("Stock Request DTO", stockRequestDTO);
        const response = await axiosInstance.post(`/api/stocks/details`, stockRequestDTO);
        console.log("Stock Data {}", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching stocks", error);
    }
};

// Fetch brand types for available stocks for usedId
export const getBrandTypesForAvailableStocks = async (userId) => {
    try {
        const response = await axiosInstance.get(`/api/brands/types/${userId}`); // Adjust URL as needed
        return response.data; // Assuming the API returns an array of brand types
    } catch (error) {
        console.error('Error fetching brand types:', error);
        throw error; // Re-throw the error to handle it in the component
    }
};

// Fetch brand types for available stocks for usedId
export const getBrandNamesForAvailableStocks = async (userId, brandType) => {
    try{
        const response = await axiosInstance.get(`/api/brands/types/${brandType}/${userId}`);

        console.log("Response by axios:", response);

        // Map response data into dropdown-compatible options
        return response.data.map((brand) => ({
            value: brand, // Use brandId as the value
            label: brand, // Use brandName as the label
        }));
    } catch (error) {
        console.error('Error fetching brand types:', error);
        throw error; // Re-throw the error to handle it in the component
    }
};

export const getQuantitiesForAvailableStocks = async (brandType, userId, brandName) => {
    try {
        const response = await axiosInstance.get(`/api/stocks/types/${brandType}/${userId}/${brandName}`);
        console.log("Quantity", response.data);

        return response.data; // Returns the full BrandDetailsWithQuantitiesResponseDTO object
    } catch (error) {
        console.error("Error fetching brand details:", error);
        throw error; // Re-throw error to handle it in calling code
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
