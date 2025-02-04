import { User, Team, Organization } from '../types';

export type Permission = {
  id: string;
  name: string;
  description: string;
};

export type Role = {
  id: string;
  name: string;
  permissions: string[];
  organizationId?: string;
};

export type PermissionScope = {
  organizationId?: string;
  teamId?: string;
};

/**
 * Check if a user has a specific permission within a given scope
 */
export const hasPermission = async (
  user: User | null,
  permissionName: string,
  scope?: PermissionScope
): Promise<boolean> => {
  if (!user) return false;

  // Super admin has all permissions
  if (user.role === 'super_admin') {
    return true;
  }

  // Filter roles based on scope
  const relevantRoles = user.roles.filter(role => {
    if (!scope) return true;
    if (scope.organizationId && role.organizationId !== scope.organizationId) return false;
    return true;
  });

  // Check if any of the user's roles have the required permission
  return relevantRoles.some(role => role.permissions.includes(permissionName));
};

/**
 * Check if a user has all of the specified permissions within a given scope
 */
export const hasPermissions = async (
  user: User | null,
  permissionNames: string[],
  scope?: PermissionScope
): Promise<boolean> => {
  if (!user) return false;

  const results = await Promise.all(
    permissionNames.map(permission => hasPermission(user, permission, scope))
  );

  return results.every(result => result);
};

/**
 * Get all permissions for a user within a given scope
 */
export const getUserPermissions = async (
  user: User | null,
  scope?: PermissionScope
): Promise<string[]> => {
  if (!user) return [];

  // Super admin has all permissions
  if (user.role === 'super_admin') {
    // TODO: Return all available permissions from Firestore
    return ['*'];
  }

  // Filter roles based on scope
  const relevantRoles = user.roles.filter(role => {
    if (!scope) return true;
    if (scope.organizationId && role.organizationId !== scope.organizationId) return false;
    return true;
  });

  // Combine all permissions from relevant roles
  const permissions = new Set<string>();
  relevantRoles.forEach(role => {
    role.permissions.forEach(permission => permissions.add(permission));
  });

  return Array.from(permissions);
};
