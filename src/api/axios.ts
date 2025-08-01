import axios, { InternalAxiosRequestConfig } from "axios";
import { toast } from "../hooks/use-toast";
import { logoutUser } from "../store/authStore";

const API_BASE_URL = (import.meta as any).env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

let hasShownTokenExpiredToast = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    if (status === 401 && !hasShownTokenExpiredToast) {
      hasShownTokenExpiredToast = true; // block subsequent toasts

      console.warn("[DEBUG] Token expired or unauthorized for critical route");

      await logoutUser();

      toast({
        title: "Session expired",
        description: "Your session has expired. Please log in again.",
        variant: "destructive",
      });

      return;
    }

    if (status === 403) {
      console.warn("[DEBUG] Access forbidden — user may lack permissions");
    }

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
