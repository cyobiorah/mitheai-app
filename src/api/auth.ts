import { apiRequest } from "../lib/queryClient";
import { Team, User } from "../types";

export interface LoginResponse {
  token: string;
  user: any;
  organization?: any;
  teams?: any[];
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: "individual" | "organization";
  organizationName?: string;
}

export const authApi = {
  loginUser: async (credentials: any) => {
    const response = await apiRequest("POST", "/auth/login", credentials);
    return response;
  },

  registerUser: async (userData: RegisterData): Promise<LoginResponse> => {
    const response = await apiRequest("POST", "/auth/register", userData);
    return response;
  },

  getCurrentUser: async (): Promise<{
    teams: Team[];
    user: User;
    organization?: any;
  }> => {
    const response = await apiRequest("GET", "/users/me");
    return response;
  },

  logout: async (): Promise<void> => {
    // Just clear the token on the client side
    // No need for API call since we're using JWT
    localStorage.removeItem("auth_token");
  },
};
