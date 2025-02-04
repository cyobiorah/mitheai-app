import axiosInstance from './axios';

export interface SendInvitationRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId: string;
  teamIds?: string[];
}

export interface SendInvitationResponse {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId: string;
  teamIds: string[];
  settings: {
    permissions: string[];
    theme: string;
    notifications: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface VerifyInvitationResponse {
  email: string;
  firstName: string;
  lastName: string;
  organizationName: string;
}

export interface ResendInvitationResponse {
  message: string;
}

export const invitationsApi = {
  sendInvitation: async (data: SendInvitationRequest): Promise<SendInvitationResponse> => {
    const response = await axiosInstance.post<SendInvitationResponse>('/users/invite', data);
    return response.data;
  },

  verifyInvitation: async (token: string): Promise<VerifyInvitationResponse> => {
    const response = await axiosInstance.get<VerifyInvitationResponse>(`/invitations/${token}/verify`);
    return response.data;
  },

  acceptInvitation: async (token: string, password: string): Promise<{ email: string }> => {
    const response = await axiosInstance.post<{ email: string }>(`/invitations/${token}/accept`, { password });
    return response.data;
  },

  resendInvitation: async (email: string): Promise<ResendInvitationResponse> => {
    const response = await axiosInstance.post<ResendInvitationResponse>('/invitations/resend', { email });
    return response.data;
  },
};
