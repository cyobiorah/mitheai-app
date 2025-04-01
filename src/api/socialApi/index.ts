import axiosInstance from "../axios";

export const socialApi = {
  getAccounts: async () => {
    try {
      const response = await axiosInstance.get("/social-accounts");
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch social accounts:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch social accounts"
      );
    }
  },

  connectTwitter: async ({ skipWelcome }: { skipWelcome: boolean }) => {
    try {
      const response = await axiosInstance.get(
        `/social-accounts/twitter/direct-auth?skipWelcome=${skipWelcome}`
      );
      console.log({ response });
      return response.data;
    } catch (error: any) {
      console.error("Failed to connect to Twitter:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to connect to Twitter"
      );
    }
  },

  disconnectSocialAccount: async ({ accountId }: { accountId: string }) => {
    try {
      const response = await axiosInstance.post(
        `/social-accounts/disconnect/${accountId}`
      );
      console.log({ response });
      return response.data;
    } catch (error: any) {
      console.error("Failed to disconnect account:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to disconnect account"
      );
    }
  },

  connectFacebook: async () => {
    try {
      const response = await axiosInstance.get(
        `/social-accounts/facebook/direct-auth`
      );
      console.log({ response });
      return response.data;
    } catch (error: any) {
      console.error("Failed to connect to Facebook:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to connect to Facebook"
      );
    }
  },

  connectThreads: async () => {
    try {
      const response = await axiosInstance.get(
        `/social-accounts/threads/direct-auth`
      );
      return response.data;
    } catch (error: any) {
      console.error("Failed to connect to Threads:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to connect to Threads"
      );
    }
  },
};

export default socialApi;
