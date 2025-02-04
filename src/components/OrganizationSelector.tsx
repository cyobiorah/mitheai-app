import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const OrganizationSelector: React.FC = () => {
  const { organization } = useAuth();

  if (!organization) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
        <div className="h-3 bg-neutral-200 rounded w-1/2 mt-2"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-neutral-900">{organization.name}</h2>
      <p className="text-xs text-neutral-500 capitalize">{organization.type} Plan</p>
    </div>
  );
};

export default OrganizationSelector;
