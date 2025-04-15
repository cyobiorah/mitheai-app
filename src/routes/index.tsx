import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout";
import ContentLibrary from "../pages/ContentLibrary";
import ContentCreation from "../pages/ContentCreation";
import ContentManagement from "../pages/ContentManagement/ContentManagement";
import Scheduling from "../pages/Scheduling";
import Analytics from "../pages/Analytics";
import Settings from "../pages/Settings";
import OrganizationOverview from "../pages/OrganizationOverview";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { AcceptInvitation } from "../pages/AcceptInvitation";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { PublicRoute } from "../components/PublicRoute";
import { ROUTES } from "../utils/contstants";
import Dashboard from "../pages/Dashboard";
import { useAuth } from "../store/hooks";
import CreatePost from "../pages/post/CreatePost";
import TextPost from "../pages/post/TextPost";
import Posted from "../pages/post/Posted";
import AccountSetup from "../pages/account/AccountSetup";
import ScheduledPosts from "../pages/post/ScheduledPost";
import EditScheduledPost from "../pages/post/EditScheduledPost";
import HomePage from "../pages/home/HomePage";

// Wrapper component to conditionally render dashboard
const DashboardRouter: React.FC = () => {
  const { user } = useAuth();
  return user?.organizationId && user?.organizationId !== null ? (
    <OrganizationOverview />
  ) : (
    <Dashboard />
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.REGISTER}
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.ACCEPT_INVITATION}
        element={
          <PublicRoute>
            <AcceptInvitation />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.HOME}
        element={
          <PublicRoute>
            <HomePage />
          </PublicRoute>
        }
      />
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path={ROUTES.DASHBOARD} element={<DashboardRouter />} />
                <Route path={ROUTES.LIBRARY} element={<ContentLibrary />} />
                <Route path={ROUTES.CONTENT} element={<ContentCreation />} />
                <Route path={ROUTES.MANAGE} element={<ContentManagement />} />
                <Route path={ROUTES.POST} element={<CreatePost />} />
                <Route path={`${ROUTES.POST}/text`} element={<TextPost />} />
                <Route path={`${ROUTES.POST}/posted`} element={<Posted />} />
                <Route
                  path={`${ROUTES.POST}/scheduled`}
                  element={<ScheduledPosts />}
                />
                <Route
                  path={`${ROUTES.SCHEDULE}/:id`}
                  element={<EditScheduledPost />}
                />
                <Route path={ROUTES.SCHEDULE} element={<Scheduling />} />
                <Route path={ROUTES.ANALYTICS} element={<Analytics />} />
                <Route path={ROUTES.SETTINGS} element={<Settings />} />
                <Route path={ROUTES.ACCOUNT_SETUP} element={<AccountSetup />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
