import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, authLoading } = useAuth();
  const token = localStorage.getItem("auth_token");

  if (authLoading) {
    // You can replace this with a loading spinner component
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user || !token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
