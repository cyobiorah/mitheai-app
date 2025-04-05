export const APP_NAME = "MitheAi";

export const ROUTES = {
  DASHBOARD: "/",
  LIBRARY: "/library",
  CONTENT: "/create",
  MANAGE: "/manage",
  POST: "/create-post",
  SCHEDULE: "/schedule",
  ANALYTICS: "/analytics",
  SETTINGS: "/settings",
  ACCOUNT_SETUP: "/account-setup",
  LOGIN: "/login",
  REGISTER: "/register",
  ACCEPT_INVITATION: "/accept-invitation",
  // SCHEDULED_POSTS: "/scheduled",
  EDIT_SCHEDULED_POST: "/schedule/:id",
} as const;

export const API_ENDPOINTS = {
  AUTH: "/auth",
  USERS: "/users",
  CONTENT: "/content",
  ANALYTICS: "/analytics",
  TEAMS: "/teams",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  INVITATIONS: "/invitations",
} as const;
