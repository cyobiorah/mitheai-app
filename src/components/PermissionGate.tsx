import React, { useEffect, useState } from 'react';
import { PermissionScope } from '../utils/permissions';
import { usePermissions } from '../hooks/usePermissions';

interface PermissionGateProps {
  permissions: string | string[];
  scope?: PermissionScope;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  permissions,
  scope,
  children,
  fallback = null,
}) => {
  const { checkPermission, checkPermissions } = usePermissions(scope);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (typeof permissions === 'string') {
        const result = await checkPermission(permissions);
        setHasAccess(result);
      } else {
        const result = await checkPermissions(permissions);
        setHasAccess(result);
      }
    };

    checkAccess();
  }, [permissions, checkPermission, checkPermissions]);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
