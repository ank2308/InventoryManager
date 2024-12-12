// src/services/saleApi.js
import axiosInstance from "./axiosInstance";

// Record a sale
export const addSale = async (saleData) => {
    try {
        const response = await axiosInstance.post("/api/sale/day-wise", saleData);

        return response.data;
    } catch (error) {
        console.error("Error recording sale", error);
    }
};

// Fetch sales data
export const getSales = async (requestData) => {
    try {
        const response = await axiosInstance.post("/api/sale/list", requestData);
        console.log("Sales Data", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching sales", error);
    }
};

export const getQuantity = async (quantityId) => {
    try {
        const response = await axiosInstance.get(`/api/quantities/getQuantityById/${quantityId}`);
        let quantity = response.data.quantityName + " - " + response.data.quantity;
        console.log("Quantity", quantity);
        return quantity;
    } catch (error) {
        console.error("Error fetching sales", error);
    }
};
