import React from "react";
import { useThemeStore } from "../store/themeStore";
import clsx from "clsx";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="ml-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-8 p-2 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <svg
        className={clsx(
          "w-5 h-5",
          theme === "light" ? "text-gray-600" : "text-gray-300"
        )}
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
      </svg>
    </button>
  );
};

export default ThemeToggle;
