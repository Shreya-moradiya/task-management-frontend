import axios from "axios";

export const AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/",
    headers: {
        "Content-Type": "application/json",
    },
});

AxiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);