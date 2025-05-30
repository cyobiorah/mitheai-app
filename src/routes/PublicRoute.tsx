import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/hooks";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, authLoading } = useAuth();
  const isAuthenticated = !!user;

  if (authLoading) {
    // You can replace this with a loading spinner component
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};
