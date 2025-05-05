import axiosInstance from "./axios";

export const billingApi = {
  createCheckoutSession: async (userId: string, email: string) => {
    const response = await axiosInstance.post(
      "/checkout/create-checkout-session",
      {
        userId,
        email,
      }
    );
    return response.data;
  },

  getBillingPortalUrl: async (customerId: string) => {
    const response = await axiosInstance.post("/billing/billing-portal", {
      customerId,
    });
    return response.data;
  },
};
