import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL, // Access the environment variable
});

export default axiosInstance;