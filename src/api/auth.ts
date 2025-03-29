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
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }
    
    return response.json();
  },
  
  register: async (userData: RegisterData): Promise<LoginResponse> => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }
    
    return response.json();
  },
  
  getMe: async (token: string): Promise<{ user: any; organization?: any }> => {
    const response = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch user data");
    }
    
    return response.json();
  },
  
  logout: async (): Promise<void> => {
    // Just clear the token on the client side
    // No need for API call since we're using JWT
    localStorage.removeItem("auth_token");
  }
};
