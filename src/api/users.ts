import axiosInstance from "./axios";
import { User } from "../types";

interface InviteUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: User["role"];
  organizationId: string;
}

export const usersApi = {
  getUsers: async (organizationId: string): Promise<User[]> => {
    const response = await axiosInstance.get(
      `/users/organization/${organizationId}`
    );
    return response.data;
  },

  inviteUser: async (data: InviteUserRequest): Promise<void> => {
    await axiosInstance.post("/users/invite", data);
  },

  updateUser: async (userId: string, updates: Partial<User>): Promise<User> => {
    try {
      const response = await axiosInstance.put<User>(`/users/${userId}`, updates);
      return response.data;
    } catch (error: any) {
      return error;
    }
  },

  deleteUser: async (userId: string): Promise<void> => {
    await axiosInstance.delete(`/users/${userId}`);
  },

  getUser: async (userId: string): Promise<User> => {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  },
};
