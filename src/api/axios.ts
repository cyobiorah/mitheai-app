import axios, { InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = (import.meta as any).env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add interceptors for auth, logging, etc.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log({ error });
    return Promise.reject(error as Error);
  }
);

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get the JWT token from localStorage
    const token = localStorage.getItem("auth_token");

    if (token) {
      // Add it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;

      // Add timestamp to help debug caching issues
      config.headers["X-Request-Time"] = new Date().toISOString();
    } else {
      console.log("[DEBUG] No auth token found in localStorage");
    }
    return config;
  },
  (error: Error) => {
    console.error("[DEBUG] Request interceptor error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
