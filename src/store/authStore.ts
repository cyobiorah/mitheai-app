import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "../api/auth";
import { User, Organization, Team } from "../types";
import { useTeamStore } from "./teamStore";

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  organization: Organization | null;
  teams: Team[];
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
  fetchUserData: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: localStorage.getItem("auth_token"),
      organization: null,
      teams: [],
      isLoading: false,
      error: null,

      // Actions
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authApi.login(email, password);
          localStorage.setItem("auth_token", data.token);
          set({
            token: data.token,
            user: data.user,
            organization: data.organization || null,
            teams: data.teams || [],
            isLoading: false,
          });
          
          // Initialize team store with teams from login
          if (data.teams && data.teams.length > 0) {
            const teamStore = useTeamStore.getState();
            teamStore.setTeams(data.teams);
            
            // Set active team to the first team
            teamStore.setActiveTeam(data.teams[0]);
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          localStorage.removeItem("auth_token");
          set({
            user: null,
            token: null,
            organization: null,
            teams: [],
          });
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.register(data);
          localStorage.setItem("auth_token", response.token);
          set({
            token: response.token,
            user: response.user,
            organization: response.organization || null,
            isLoading: false,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      fetchUserData: async () => {
        const token = get().token;
        if (!token) return;

        set({ isLoading: true });
        try {
          const data = await authApi.getMe();
          set({
            user: data.user,
            organization: data.organization || null,
            isLoading: false,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "mitheai-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        organization: state.organization,
        teams: state.teams,
      }),
    }
  )
);
