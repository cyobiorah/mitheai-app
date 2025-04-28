import { BrowserRouter, Route, Routes } from "react-router-dom";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster } from "../components/ui/toaster";
import HomePage from "../pages";
import WaitlistPage from "../pages/waitlist";
import ForgotPasswordPage from "../pages/forgot-password";
import DashboardPage from "../pages/dashboard";
import CreatePostPage from "../pages/dashboard/create-post";
import AccountsPage from "../pages/dashboard/accounts";
import CollectionsPage from "../pages/dashboard/collections";
import TeamsPage from "../pages/dashboard/teams";
import SchedulePage from "../pages/dashboard/schedule";
import NotFound from "../pages/not-found";
import { PublicRoute } from "./PublicRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import SettingsPage from "../pages/Settings";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <HomePage />
                </PublicRoute>
              }
            />
            <Route
              path="/waitlist"
              element={
                <PublicRoute>
                  <WaitlistPage />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPasswordPage />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/create-post"
              element={
                <ProtectedRoute>
                  <CreatePostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/accounts"
              element={
                <ProtectedRoute>
                  <AccountsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/collections"
              element={
                <ProtectedRoute>
                  <CollectionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/teams"
              element={
                <ProtectedRoute>
                  <TeamsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/schedule"
              element={
                <ProtectedRoute>
                  <SchedulePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
