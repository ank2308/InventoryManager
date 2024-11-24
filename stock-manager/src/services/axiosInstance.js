import axios from "axios";
import { useNavigate } from "react-router-dom";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080", // Replace with your backend URL
});

// Add Authorization header to each request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log("Config data ", config.headers.Authorization);
        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

// Handle response errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response; // Simply return the response if it's successful
    },
    async (error) => {
        const navigate = useNavigate();
        if (error.response?.status === 401) {
            // Redirect to login if unauthorized
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            navigate("/login");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
