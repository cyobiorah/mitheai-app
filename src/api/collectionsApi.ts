import axiosInstance from "./axios";

export const collectionsApi = {
  list: async () => {
    try {
      const response = await axiosInstance.get(`/collections`);
      return response.data;
    } catch (error) {
      console.error("Error getting collections list:", error);
      throw error;
    }
  },
  listOrg: async (orgId: string) => {
    try {
      const response = await axiosInstance.get(`/collections/${orgId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting collections list:", error);
      throw error;
    }
  },
  get: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/collections/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error getting collection:", error);
      throw error;
    }
  },
  create: async (data: any) => {
    try {
      const response = await axiosInstance.post(`/collections`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating collection:", error);
      throw error;
    }
  },
  update: async (id: string, data: any) => {
    try {
      const response = await axiosInstance.patch(`/collections/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating collection:", error);
      throw error;
    }
  },
  remove: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/collections/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error removing collection:", error);
      throw error;
    }
  },
  addContent: async (id: string, contentId: string, type: string) => {
    try {
      const response = await axiosInstance.post(`/collections/${id}/content/`, {
        type,
        contentId,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding content to collection:", error);
      throw error;
    }
  },
  removeContent: async (id: string, contentId: string) => {
    try {
      const response = await axiosInstance.delete(
        `/collections/${id}/content/${contentId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error removing content from collection:", error);
      throw error;
    }
  },
};
