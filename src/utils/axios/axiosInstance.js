// src/utils/axiosInstance.ts
import axios from "axios";
import { logout, selectRefreshToken, selectToken, setAccessToken } from "../redux/authSlice";
import store from "../redux/store";

// Create axios instance
const axiosInstance = axios.create({
    // 'http://localhost:3500/api/', 
    baseURL: process.env.REACT_APP_BASE_URL_NODE,
    timeout: 60000,
   headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor for handling token and headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = selectToken(store.getState()); // Get accessToken from Redux
        if (token) {
            config.headers.Authorization = `AccessToken=${token}`; // Attach token to headers
        }
        // Handle form data cases
        if (config.data instanceof FormData) {
            config.headers["Content-Type"] = "multipart/form-data";
        } else {
            config.headers["Content-Type"] = "application/json";
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Function to refresh token
const refreshAccessToken = async () => {
    const refreshToken = selectRefreshToken(store.getState());
    if (refreshToken) {
        try {
            // Make API call to refresh the token
            const response = await axios.post(`${process.env.REACT_APP_OMADA_BASE_URL}openapi/authorize/token?client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}&refresh_token=${refreshToken}&grant_type=refresh_token`);

            const newToken = response.data.accessToken;
            store.dispatch(setAccessToken(newToken)); // Update token in Redux
            return newToken; // Return new token for retrying the request
        } catch (error) {
            store.dispatch(logout()); // Logout if refresh token also fails
            return null;
        }
    }
    return null;
};

// Interceptor for handling failed responses
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        console.log(error)
        // Check if error is due to token expiration (401 or 402)
        if (error?.response?.data?.errorCode === -44112) {
            const newToken = await refreshAccessToken(); // Refresh the token

            if (newToken) {
                // Update the authorization header with the new token
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest); // Retry the original request
            }
        }

        // If refresh fails or some other error occurs, reject the promise
        return Promise.reject(error);
    }
);

export default axiosInstance;
