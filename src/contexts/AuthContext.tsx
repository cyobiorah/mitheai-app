import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/contstants";
import { User, Organization, Team, AuthState } from "../types";
import { teamsApi } from "../api/teams";
import { authApi, RegisterData } from "../api/auth";
import toast from "react-hot-toast";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshTeams: () => Promise<void>;
  error: string | null;
  isOrganizationUser: boolean;
  isIndividualUser: boolean;
  activeTeam: Team | null;
  setActiveTeam: (team: Team) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("auth_token")
  );

  // Computed properties for user type
  const isOrganizationUser = useMemo(() => user?.userType === 'organization', [user?.userType]);
  const isIndividualUser = useMemo(() => user?.userType !== 'organization', [user?.userType]);

  const fetchUserData = async (): Promise<User | null> => {
    if (!token) return null;

    try {
      const data = await authApi.getMe(token);
      if (data.user) {
        setUser(data.user);

        if (data.organization) {
          setOrganization(data.organization);
        }

        return data.user;
      } else {
        console.log("No user data returned from API");
        setError("User account not fully set up. Please contact support.");
        return null;
      }
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      setError(error.message || "Failed to fetch user data");

      // If token is invalid, clear it
      if (
        error.message?.includes("token") ||
        error.message?.includes("authentication")
      ) {
        localStorage.removeItem("auth_token");
        setToken(null);
      }

      return null;
    }
  };

  const fetchTeams = async (organizationId: string): Promise<void> => {
    if (!token) return;

    try {
      console.log("Fetching teams for organization ID:", organizationId);
      const fetchedTeams = await teamsApi.getTeams(organizationId);
      console.log("Fetched teams:", fetchedTeams);
      setTeams(fetchedTeams);
    } catch (error: any) {
      console.error("Error fetching teams:", error);
      setError(error.message || "Failed to fetch teams");
    }
  };

  const refreshTeams = async () => {
    if (organization && token) {
      setError(null);
      await fetchTeams(organization.id);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        setError(null);
        try {
          const userData = await fetchUserData();
          if (
            userData?.userType === "organization" &&
            userData?.organizationId
          ) {
            await fetchTeams(userData.organizationId);
          }
        } catch (error: any) {
          console.error("Error in auth initialization:", error);
          setError(error.message || "Authentication initialization failed");
          localStorage.removeItem("auth_token");
          setToken(null);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setOrganization(null);
        setTeams([]);
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token]);

  // Set active team when teams are loaded or changed
  useEffect(() => {
    if (teams.length > 0 && !activeTeam) {
      setActiveTeam(teams[0]);
    }
  }, [teams, activeTeam]);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login(email, password);

      // Save token to localStorage
      localStorage.setItem("auth_token", response.token);
      setToken(response.token);

      // Set user data
      setUser(response.user);

      // Handle organization data if present
      if (response.organization) {
        setOrganization(response.organization);

        // Fetch teams for organization
        if (
          response.user.userType === "organization" &&
          response.user.organizationId
        ) {
          await fetchTeams(response.user.organizationId);
        }
      }

      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Invalid email or password.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.register(data);

      // Save token to localStorage
      localStorage.setItem("auth_token", response.token);
      setToken(response.token);

      // Set user data
      setUser(response.user);

      // Handle organization data if present
      if (response.organization) {
        setOrganization(response.organization);
      }

      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Failed to register. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setError(null);
    try {
      await authApi.logout();

      // Clear token from state
      setToken(null);

      // Clear user data
      setUser(null);
      setOrganization(null);
      setTeams([]);

      navigate(ROUTES.LOGIN);
    } catch (error: any) {
      console.error("Logout error:", error);
      setError(error.message || "Failed to logout. Please try again.");
    }
  };

  // Provide the auth context value
  const contextValue = useMemo(
    () => ({
      user,
      organization,
      teams,
      loading,
      error,
      login,
      register,
      logout,
      refreshTeams,
      isOrganizationUser,
      isIndividualUser,
      activeTeam,
      setActiveTeam,
    }),
    [
      user,
      organization,
      teams,
      loading,
      error,
      isOrganizationUser,
      isIndividualUser,
      activeTeam,
      login,
      register,
      logout,
      refreshTeams,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
