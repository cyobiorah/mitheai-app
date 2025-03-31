// src/App.tsx
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import { useTeamStore } from "./store/teamStore";
import { useThemeStore } from "./store/themeStore";

function App() {
  const { token, fetchUserData } = useAuthStore();
  const { fetchTeams } = useTeamStore();
  const { theme } = useThemeStore();

  // Initialize app data on mount or when token changes
  useEffect(() => {
    if (token) {
      // Load user data
      fetchUserData();

      // Load teams data
      fetchTeams();
    }
  }, [token, fetchUserData, fetchTeams]);

  // Apply theme on mount and when it changes
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <Router>
      <Toaster />
      <AppRoutes />
    </Router>
  );
}

export default App;
