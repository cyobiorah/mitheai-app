import { BrowserRouter, Route, Routes } from "react-router-dom";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster } from "../components/ui/toaster";
import HomePage from "../pages";
import WaitlistPage from "../pages/waitlist";
import ForgotPasswordPage from "../pages/forgot-password";
import DashboardPage from "../components/dashboard";
import NotFound from "../pages/not-found";
import { PublicRoute } from "./PublicRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import TermsOfService from "../pages/TermsOfService";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import DashboardLayout from "../layouts/DashboardLayout";
import SocialAccounts from "../components/social-accounts";
import AnalyticsDashboard from "../components/analytics";
import TeamManagement from "../components/team-management";
import Collections from "../components/collections/Collections";
import Posts from "../components/posts";
import ScheduledPosts from "../components/posts/scheduled-posts/ScheduledPosts";
import PostFlow from "../components/posts/post-flow/PostFlow";
import Billing from "../components/billing";
import HelpSupport from "../components/help-support";
import PostCreate from "../components/posts/post-create/PostCreate";
import UserSettings from "../components/settings";
import ResetPasswordPage from "../pages/reset-password";

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
              path="/terms"
              element={
                <PublicRoute>
                  <TermsOfService />
                </PublicRoute>
              }
            />
            <Route
              path="/privacy"
              element={
                <PublicRoute>
                  <PrivacyPolicy />
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
              path="/reset-password"
              element={
                <PublicRoute>
                  <ResetPasswordPage />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="create-post" element={<PostCreate />} />
              <Route path="accounts" element={<SocialAccounts />} />
              <Route path="collections" element={<Collections />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="post-flow" element={<PostFlow />} />
              <Route path="posts" element={<Posts />} />
              <Route path="teams" element={<TeamManagement />} />
              <Route path="schedule" element={<ScheduledPosts />} />
              <Route path="settings" element={<UserSettings />} />
              <Route path="billing" element={<Billing />} />
              <Route path="help" element={<HelpSupport />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
