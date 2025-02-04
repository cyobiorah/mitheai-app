export const PERMISSIONS = {
  // Organization permissions
  ORG_CREATE: 'org:create',
  ORG_READ: 'org:read',
  ORG_UPDATE: 'org:update',
  ORG_DELETE: 'org:delete',
  ORG_MANAGE_MEMBERS: 'org:manage:members',
  ORG_MANAGE_TEAMS: 'org:manage:teams',
  ORG_MANAGE_ROLES: 'org:manage:roles',

  // Team permissions
  TEAM_CREATE: 'team:create',
  TEAM_READ: 'team:read',
  TEAM_UPDATE: 'team:update',
  TEAM_DELETE: 'team:delete',
  TEAM_MANAGE_MEMBERS: 'team:manage:members',

  // Content permissions
  CONTENT_CREATE: 'content:create',
  CONTENT_READ: 'content:read',
  CONTENT_UPDATE: 'content:update',
  CONTENT_DELETE: 'content:delete',
  CONTENT_PUBLISH: 'content:publish',
  CONTENT_REVIEW: 'content:review',

  // User permissions
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_MANAGE_ROLES: 'user:manage:roles',

  // System permissions
  SYSTEM_SETTINGS: 'system:settings',
  SYSTEM_AUDIT_LOGS: 'system:audit:logs',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ORG_OWNER: 'Organization Owner',
  TEAM_MANAGER: 'Team Manager',
  USER: 'User',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// Default permissions for each role
export const DEFAULT_ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ORG_OWNER]: [
    PERMISSIONS.ORG_READ,
    PERMISSIONS.ORG_UPDATE,
    PERMISSIONS.ORG_MANAGE_MEMBERS,
    PERMISSIONS.ORG_MANAGE_TEAMS,
    PERMISSIONS.ORG_MANAGE_ROLES,
    PERMISSIONS.TEAM_CREATE,
    PERMISSIONS.TEAM_READ,
    PERMISSIONS.TEAM_UPDATE,
    PERMISSIONS.TEAM_DELETE,
    PERMISSIONS.TEAM_MANAGE_MEMBERS,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.CONTENT_UPDATE,
    PERMISSIONS.CONTENT_DELETE,
    PERMISSIONS.CONTENT_PUBLISH,
    PERMISSIONS.CONTENT_REVIEW,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_MANAGE_ROLES,
  ],
  [ROLES.TEAM_MANAGER]: [
    PERMISSIONS.TEAM_READ,
    PERMISSIONS.TEAM_UPDATE,
    PERMISSIONS.TEAM_MANAGE_MEMBERS,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.CONTENT_UPDATE,
    PERMISSIONS.CONTENT_DELETE,
    PERMISSIONS.CONTENT_PUBLISH,
    PERMISSIONS.CONTENT_REVIEW,
    PERMISSIONS.USER_READ,
  ],
  [ROLES.USER]: [
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.CONTENT_UPDATE,
    PERMISSIONS.CONTENT_DELETE,
  ],
};
