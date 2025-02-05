import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";
import { auth } from "../config/firebase";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const axiosInstance = axios.create({
  baseURL: API_URL, // This will work both locally and in production
  timeout: 10000,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get the current user
    const user = auth.currentUser;
    if (user) {
      // Get the ID token
      const token = await user.getIdToken();
      // Add it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
      // console.log('[DEBUG] Making request:', {
      //   method: config.method,
      //   baseURL: config.baseURL,
      //   url: config.url,
      //   fullURL: `${config.baseURL}${config.url}`,
      //   headers: config.headers,
      //   params: config.params,
      //   data: config.data
      // });
    } else {
      console.log("[DEBUG] No user is currently signed in");
    }
    return config;
  },
  (error) => {
    console.error("[DEBUG] Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // console.log('[DEBUG] Response received:', {
    //   status: response.status,
    //   statusText: response.statusText,
    //   config: {
    //     method: response.config.method,
    //     baseURL: response.config.baseURL,
    //     url: response.config.url,
    //     fullURL: `${response.config.baseURL}${response.config.url}`,
    //   },
    //   data: response.data,
    //   headers: response.headers,
    // });
    return response;
  },
  (error: AxiosError) => {
    console.error("[DEBUG] Response error:", {
      message: error.message,
      config: error.config
        ? {
            method: error.config.method,
            baseURL: error.config.baseURL,
            url: error.config.url,
            fullURL: `${error.config.baseURL}${error.config.url}`,
          }
        : "No config available",
      response: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
      },
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;
