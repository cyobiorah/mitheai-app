import axiosInstance from './axios';

export interface LoginResponse {
  token: string;
  user: any;
  organization?: any;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: 'individual' | 'organization';
  organizationName?: string;
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      
      return response.data;
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || "Login failed");
    }
  },
  
  register: async (userData: RegisterData): Promise<LoginResponse> => {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      
      return response.data;
    } catch (error: any) {
      console.error("Registration error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || "Registration failed");
    }
  },
  
  getMe: async (token: string): Promise<{ user: any; organization?: any }> => {
    try {
      const response = await axiosInstance.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch user data:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch user data");
    }
  },
  
  logout: async (): Promise<void> => {
    // Just clear the token on the client side
    // No need for API call since we're using JWT
    localStorage.removeItem("auth_token");
  }
};
