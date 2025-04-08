import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeState {
  // State
  theme: Theme;

  // Actions
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => {
      // Check system preference for initial theme
      const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      const initialTheme: Theme = prefersDark ? "dark" : "light";

      return {
        // Initial state
        theme: initialTheme,

        // Actions
        toggleTheme: () =>
          set((state) => {
            const newTheme = state.theme === "light" ? "dark" : "light";
            // Apply theme to document
            if (typeof document !== "undefined") {
              document.documentElement.classList.remove("light", "dark");
              document.documentElement.classList.add(newTheme);
            }
            return { theme: newTheme };
          }),

        setTheme: (theme) =>
          set(() => {
            // Apply theme to document
            if (typeof document !== "undefined") {
              document.documentElement.classList.remove("light", "dark");
              document.documentElement.classList.add(theme);
            }
            return { theme };
          }),
      };
    },
    {
      name: "mitheai-theme",
    }
  )
);
