import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PermissionScope, hasPermission, hasPermissions, getUserPermissions } from '../utils/permissions';

export const usePermissions = (scope?: PermissionScope) => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    const loadPermissions = async () => {
      const userPermissions = await getUserPermissions(user, scope);
      setPermissions(userPermissions);
    };

    loadPermissions();
  }, [user, scope]);

  const checkPermission = useCallback(
    async (permissionName: string): Promise<boolean> => {
      return hasPermission(user, permissionName, scope);
    },
    [user, scope]
  );

  const checkPermissions = useCallback(
    async (permissionNames: string[]): Promise<boolean> => {
      return hasPermissions(user, permissionNames, scope);
    },
    [user, scope]
  );

  return {
    permissions,
    checkPermission,
    checkPermissions,
  };
};
