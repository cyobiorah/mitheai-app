import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

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

      // Log the request for debugging
      // console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      //   headers: {
      //     Authorization: "Bearer " + token.substring(0, 10) + "...",
      //     "X-Request-Time": config.headers["X-Request-Time"]
      //   }
      // });
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

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
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
