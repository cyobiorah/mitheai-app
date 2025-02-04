import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  QueueListIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { ROUTES } from "../utils/contstants";
import { useAuth } from "../contexts/AuthContext";
import OrganizationSelector from "./OrganizationSelector";
import TeamSelector from "./TeamSelector";
import MemberSelector from "./MemberSelector";
import ThemeToggle from "./ThemeToggle";

const navigation = [
  { name: "Dashboard", href: ROUTES.DASHBOARD, icon: UsersIcon },
  { name: "View Content", href: ROUTES.LIBRARY, icon: DocumentTextIcon },
  { name: "Create Content", href: ROUTES.CONTENT, icon: PencilSquareIcon },
  { name: "Manage Content", href: ROUTES.MANAGE, icon: QueueListIcon },
  { name: "Schedule", href: ROUTES.SCHEDULE, icon: CalendarIcon },
  { name: "Analytics", href: ROUTES.ANALYTICS, icon: ChartBarIcon },
  { name: "Profile & Settings", href: ROUTES.SETTINGS, icon: Cog6ToothIcon },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      // No need to navigate manually, AuthContext will handle it
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "bg-primary" : "hover:bg-background";
  };

  // Get user's initials for avatar
  const getInitials = () => {
    if (!user) return "?";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-900">
      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-neutral-200 dark:border-gray-700 flex items-center justify-between px-4 lg:hidden z-50">
        <button
          className="p-2 rounded-lg text-neutral-600 hover:bg-neutral-50 bg-white"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
        <Link to={ROUTES.DASHBOARD} className="flex items-center">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
            MeetCiryl
          </span>
        </Link>
        <div className="w-12" /> {/* Spacer to center logo */}
      </div>

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-neutral-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          {
            "translate-x-0": isSidebarOpen,
            "-translate-x-full": !isSidebarOpen,
          }
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo section */}
          <div className="h-16 flex items-center justify-between px-4">
            <Link to={ROUTES.DASHBOARD} className="flex items-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
                MeetCiryl
              </span>
            </Link>
          </div>

          {/* Theme toggle and user info */}
          <div className="px-4 py-2 flex items-center justify-between border-t border-neutral-200 dark:border-gray-700">
            <ThemeToggle />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300">
                {getInitials()}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  "flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors",
                  location.pathname === item.href
                    ? "bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                )}
              >
                <item.icon
                  className={clsx(
                    "mr-3 h-5 w-5",
                    location.pathname === item.href
                      ? "text-primary-600 dark:text-primary-300"
                      : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Team and Member Selectors */}
          <div className="flex-shrink-0 border-t border-b border-neutral-200 dark:border-gray-700 py-4 space-y-4 px-4">
            <TeamSelector />
            <MemberSelector />
          </div>

          {/* User section */}
          <div className="flex-shrink-0 p-4 border-t border-neutral-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-600 to-primary-400 flex items-center justify-center text-white font-medium">
                  {getInitials()}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200">
                  View profile
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto flex items-center justify-center h-10 w-10 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={clsx(
          "transition-all duration-200 ease-in-out pt-16 lg:pt-0",
          {
            "pl-64": isSidebarOpen,
            "pl-0": !isSidebarOpen,
          }
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;