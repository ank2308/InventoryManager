
import axiosInstance from "./axiosInstance";// Your back-end API URL

// fetch Brand quantities by name
export const getQuantities = async () => {
    try {
        return await axiosInstance().get("/api/quantities")
    } catch (error) {
        console.error('Error while getting quantities by brand name');
    }
}

// fetch Brand quantities by name
export const getQuantitiesByBrandName = async (brandName) => {
    try {
        return await axiosInstance().get(`/api/quantities/${brandName}`)
    } catch (error) {
        console.error('Error while getting quantities by brand name');
    }
}

