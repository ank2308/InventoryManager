// src/services/api.js

import axiosInstance from "./axiosInstance";

// Fetch stock items
export const fetchShopsByUserId = async (userId) => {
    try {
        const response = await axiosInstance.get(`/api/shops/all/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching stocks", error);
    }
};

