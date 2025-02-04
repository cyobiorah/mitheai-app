import { Team } from '../types';
import axiosInstance from './axios';

const API_URL = import.meta.env.VITE_API_URL;

export const teamsApi = {
  createTeam: async (name: string, organizationId: string): Promise<Team> => {
    console.log('Creating team for organization:', organizationId);
    const response = await axiosInstance.post('/teams', {
      name,
      organizationId,
    });
    return response.data;
  },

  getTeams: async (organizationId: string): Promise<Team[]> => {
    console.log('Fetching teams for organization:', organizationId);
    console.log('API URL:', `${API_URL}/teams/organization/${organizationId}`);
    try {
      const response = await axiosInstance.get(`/teams/organization/${organizationId}`);
      console.log('Teams API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getTeams:', error);
      throw error;
    }
  },

  getTeam: async (teamId: string): Promise<Team> => {
    const response = await axiosInstance.get(`/teams/${teamId}`);
    return response.data;
  },

  updateTeam: async (teamId: string, updates: Partial<Team>): Promise<Team> => {
    const response = await axiosInstance.put(`/teams/${teamId}`, updates);
    return response.data;
  },

  deleteTeam: async (teamId: string): Promise<void> => {
    await axiosInstance.delete(`/teams/${teamId}`);
  },

  addTeamMember: async (teamId: string, userId: string): Promise<void> => {
    await axiosInstance.post(`/teams/${teamId}/members/${userId}`);
  },

  removeTeamMember: async (teamId: string, userId: string): Promise<void> => {
    await axiosInstance.delete(`/teams/${teamId}/members/${userId}`);
  },
};
