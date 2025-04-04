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

  connectLinkedIn: async () => {
    try {
      const response = await axiosInstance.get(
        `/social-accounts/linkedin/direct-auth`
      );
      console.log("nowhere", { response });
      return response.data;
    } catch (error: any) {
      console.error("Failed to connect to LinkedIn:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to connect to LinkedIn"
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

  postToThreads: async (
    accountId: string,
    content: string,
    mediaType: string
  ) => {
    try {
      const response = await axiosInstance.post(
        `/social-accounts/threads/${accountId}/post`,
        {
          content,
          mediaType,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error posting to Threads:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to post to Threads"
      );
    }
  },

  postToLinkedIn: async (accountId: string, content: string) => {
    try {
      const response = await axiosInstance.post(
        `/social-accounts/linkedin/${accountId}/post`,
        {
          content,
        },
        {
          withCredentials: true, // Include cookies for session authentication
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error posting to LinkedIn:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to post to LinkedIn"
      );
    }
  },

  getPosts: async (filters = {}) => {
    try {
      // Convert filters object to query string
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });

      const queryString = queryParams.toString()
        ? `?${queryParams.toString()}`
        : "";
      const response = await axiosInstance.get(
        `/social-posts/posts${queryString}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch social posts:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch social posts"
      );
    }
  },

  deletePost: async (postId: string) => {
    try {
      const response = await axiosInstance.delete(
        `/social-posts/posts/${postId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Failed to delete social post:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete social post"
      );
    }
  },
};

export default socialApi;
