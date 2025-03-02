export const APP_NAME = "MitheAi";

export const ROUTES = {
  DASHBOARD: '/',
  LIBRARY: '/library',
  CONTENT: '/create',
  MANAGE: '/manage',
  SCHEDULE: '/schedule',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
  LOGIN: '/login',
  REGISTER: '/register',
  ACCEPT_INVITATION: '/accept-invitation',
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
