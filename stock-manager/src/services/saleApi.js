// src/services/saleApi.js
import axiosInstance from "./axiosInstance";

// Record a sale
export const addSale = async (saleData) => {
    try {
        const response = await axiosInstance().post("/api/sale/day-wise", saleData);

        return response.data;
    } catch (error) {
        console.error("Error recording sale", error);
    }
};

// Fetch sales data
export const getSales = async () => {
    try {
        const response = await axiosInstance().get("/api/sale/sales");
        return response.data;
    } catch (error) {
        console.error("Error fetching sales", error);
    }
};
