import axiosInstance from './axios';
import { User } from '../types';

interface InviteUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: User['role'];
  organizationId: string;
}

export const usersApi = {
  getUsers: async (organizationId: string): Promise<User[]> => {
    const response = await axiosInstance.get(`/users/organization/${organizationId}`);
    return response.data;
  },

  inviteUser: async (data: InviteUserRequest): Promise<void> => {
    await axiosInstance.post('/users/invite', data);
  },

  updateUser: async (userId: string, updates: Partial<User>): Promise<User> => {
    const response = await axiosInstance.patch(`/users/${userId}`, updates);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await axiosInstance.delete(`/users/${userId}`);
  },

  getUser: async (userId: string): Promise<User> => {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  }
};
