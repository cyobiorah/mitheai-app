import axiosInstance from "../axios";

export const teamApi = {
  // Team Content Management
  listTeamContent: async (teamId: string) => {
    try {
      const response = await axiosInstance.get(`/content/team/${teamId}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to list team content:", error);
      throw new Error(
        error.response?.data?.message ??
          error.message ??
          "Failed to list team content"
      );
    }
  },

  //   Personal Content
  //   TODO: Move personal content to userApi todo
  getPersonalContent: async () => {
    try {
      const response = await axiosInstance.get("/content/personal");
      return response.data;
    } catch (error: any) {
      console.error("Failed to get personal content:", error);
      throw new Error(
        error.response?.data?.message ??
          error.message ??
          "Failed to get personal content"
      );
    }
  },

  // Assign Team
  assignTeam: async (accountId: string, teamId: string | null) => {
    try {
      const response = await axiosInstance.patch(
        `/social-accounts/${accountId}/assign`,
        {
          teamId,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Failed to assign team:", error);
      throw new Error(
        error.response?.data?.message ??
          error.message ??
          "Failed to assign team"
      );
    }
  },
};

export default teamApi;
