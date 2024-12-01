import axiosInstance from "./axiosInstance";

// Fetch brand  types
export const getBrandTypes = async () => {
    try {
        const response = await axiosInstance.get("/api/brands/types");
        console.log(response)
        return response;
    } catch (error) {
        console.error("Error fetching stocks", error);
    }
};

// Fetch brand names by type
export const getBrandNamesByType = async (brandType) => {
    try {
        const response = await axiosInstance.get(`/api/brands/by-type/${brandType}`);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error("Error fetching stocks", error);
    }
};

// get brand details by brand name
export const getBrandDetailsById = async (brandId) => {
    try {
        const response = await axiosInstance.get(`/api/brands/${brandId}`);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error("Error fetching stocks", error);
    }
};


// Add new Brand type
export const addBrandType = async (addbrandDetailRequest) => {
    return await axiosInstance.post("/api/brands/add", addbrandDetailRequest);
}
