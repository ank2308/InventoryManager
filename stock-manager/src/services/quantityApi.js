
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/quantities';  // Your back-end API URL

// fetch Brand quantities by name
export const getQuantities = async () => {
    try {
        return await axios.get(`${API_URL}`)
    } catch (error) {
        console.error('Error while getting quantities by brand name');
    }
}

// fetch Brand quantities by name
export const getQuantitiesByBrandName = async (brandName) => {
    try {
        return await axios.get(`${API_URL}/${brandName}`)
    } catch (error) {
        console.error('Error while getting quantities by brand name');
    }
}

