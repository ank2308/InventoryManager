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
        console.log("Response by axios:", response);

        // Map response data into dropdown-compatible options
        return response.data.map((brand) => ({
            value: brand.brandId, // Use brandId as the value
            label: brand.brandName, // Use brandName as the label
        }));
    } catch (error) {
        console.error("Error fetching brand names by type:", error);
        throw error; // Re-throw error to handle it higher in the call stack
    }
};

// get brand details by brand name
export const getBrandDetailsById = async (brandId) => {
    try {
        const response = await axiosInstance.get(`/api/brands/${brandId}`);
        console.log("Brand Details Response:", response.data);

        return response.data; // Returns the full BrandDetailsWithQuantitiesResponseDTO object
    } catch (error) {
        console.error("Error fetching brand details:", error);
        throw error; // Re-throw error to handle it in calling code
    }
};


// Add new Brand type
export const addBrandType = async (addbrandDetailRequest) => {
    return await axiosInstance.post("/api/brands/add", addbrandDetailRequest);
}
