import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ContentLibrary from "./pages/ContentLibrary";
import ContentCreation from "./pages/ContentCreation";
import ContentManagement from "./pages/ContentManagement/ContentManagement";
import Scheduling from "./pages/Scheduling";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import OrganizationOverview from "./pages/OrganizationOverview";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AcceptInvitation } from "./pages/AcceptInvitation";
import { AuthProvider } from "./contexts/AuthContext";
import { ROUTES } from "./utils/contstants";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Toaster />
          <Routes>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            <Route
              path={ROUTES.ACCEPT_INVITATION}
              element={<AcceptInvitation />}
            />
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route
                        path={ROUTES.DASHBOARD}
                        element={<OrganizationOverview />}
                      />
                      <Route path={ROUTES.LIBRARY} element={<ContentLibrary />} />
                      <Route
                        path={ROUTES.CONTENT}
                        element={<ContentCreation />}
                      />
                      <Route
                        path={ROUTES.MANAGE}
                        element={<ContentManagement />}
                      />
                      <Route path={ROUTES.SCHEDULE} element={<Scheduling />} />
                      <Route path={ROUTES.ANALYTICS} element={<Analytics />} />
                      <Route path={ROUTES.SETTINGS} element={<Settings />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
