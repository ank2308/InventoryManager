// src/services/api.js

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/brands';  // Your back-end API URL

// Fetch brand  types
export const getBrandTypes = async () => {
    try {
        const response = await axios.get(`${API_URL}/types`);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error("Error fetching stocks", error);
    }
};

// Fetch brand names by type
export const getBrandNamesByType = async (brandType) => {
    try {
        const response = await axios.get(`${API_URL}/by-type/${brandType}`);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error("Error fetching stocks", error);
    }
};

