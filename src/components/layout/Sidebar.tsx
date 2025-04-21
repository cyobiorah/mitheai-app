import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineSquares2X2,
  HiOutlinePencilSquare,
  HiOutlineSquare3Stack3D,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
  HiOutlineCog6Tooth,
} from "react-icons/hi2";
import { ROUTES } from "../../utils/contstants";
import { useAuth } from "../../store/hooks";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import ThemeToggle from "../ThemeToggle";
import { getInitials, formatRoleLabel } from "../../utils/helpers";
import TeamSelector from "../TeamSelector";
import MemberSelector from "../MemberSelector";

// Avatar component for the user profile
const UserAvatar = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center px-4 py-6 border-b border-gray-100">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-mithe-primary text-white flex items-center justify-center font-semibold">
          {getInitials(user)}
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-900">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-xs text-gray-500">
          {formatRoleLabel(user?.role || "")}
        </p>
      </div>
    </div>
  );
};

// Sidebar menu item component
type MenuItemProps = {
  icon: React.ElementType;
  text: string;
  href: string;
  active?: boolean;
};

const MenuItem = ({ icon: Icon, text, href, active }: MenuItemProps) => {
  return (
    <Link
      to={href}
      className={`flex items-center px-4 py-3 my-1 rounded-lg transition-colors
        ${
          active
            ? "bg-mithe-secondary text-mithe-primary font-medium"
            : "text-gray-600 hover:bg-gray-50"
        }`}
    >
      <Icon
        size={18}
        className={active ? "text-mithe-primary" : "text-gray-500"}
      />
      <span className="ml-3 text-sm">{text}</span>
    </Link>
  );
};

// Teams section component
const Teams = () => {
  return (
    <div className="mt-6 px-4">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Teams
        </h3>
        <button className="p-1 text-gray-400 hover:text-gray-600">
          <span className="text-sm font-medium">+</span>
          <span className="sr-only">Add</span>
        </button>
      </div>
      <div className="space-y-1">
        {/* <button className="flex items-center w-full py-2 text-left text-sm text-gray-600 rounded-md hover:bg-gray-50">
          <span className="w-1.5 h-1.5 mr-3 bg-green-500 rounded-full"></span>
          <span className="text-sm">Default Team</span>
        </button>   
        <button className="flex items-center w-full py-2 text-left text-sm text-gray-600 rounded-md hover:bg-gray-50">
          <span className="w-1.5 h-1.5 mr-3 bg-gray-300 rounded-full"></span>
          <span className="text-sm">Team Members</span>
        </button> */}
        <TeamSelector />
        <MemberSelector />
      </div>
    </div>
  );
};

// Main Sidebar component
export const Sidebar = () => {
  const { user, logout } = useAuth();

  const navigationItems = useMemo(() => {
    const baseNavigation = [
      { name: "Dashboard", href: ROUTES.DASHBOARD, icon: HiOutlineSquares2X2 },
      {
        name: "Create Content",
        href: ROUTES.CONTENT,
        icon: HiOutlinePencilSquare,
      },
      { name: "Create Post", href: ROUTES.POST, icon: HiOutlinePencilSquare },
      {
        name: "Manage Content",
        href: ROUTES.MANAGE,
        icon: HiOutlineSquare3Stack3D,
      },
      { name: "Schedule", href: ROUTES.SCHEDULE, icon: HiOutlineCalendarDays },
      { name: "Analytics", href: ROUTES.ANALYTICS, icon: HiOutlineChartBar },
      {
        name: "Profile & Settings",
        href: ROUTES.SETTINGS,
        icon: HiOutlineCog6Tooth,
      },
      {
        name: "Account Setup",
        href: ROUTES.ACCOUNT_SETUP,
        icon: HiOutlineCog6Tooth,
      },
    ];

    return baseNavigation;
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      // No need to navigate manually, AuthContext will handle it
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white border-r border-gray-100">
      <div className="flex flex-col h-full">
        {/* Brand logo */}
        <div className="px-4 py-5">
          <Link to="/" className="text-xl font-bold text-mithe-primary">
            MitheAI
          </Link>
        </div>

        {/* Dark mode toggle */}
        <ThemeToggle />

        {/* User avatar */}
        <UserAvatar />

        {/* Navigation */}
        <div className="px-2 py-4 flex-1 overflow-y-auto">
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <MenuItem
                key={item.name}
                icon={item.icon}
                text={item.name}
                href={item.href}
                active={item.href === location.pathname}
              />
            ))}
          </nav>
        </div>

        {/* Teams */}
        <Teams />

        {/* Logout */}
        <div className="flex-shrink-0 p-4 border-t border-neutral-200 dark:border-gray-700">
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="ml-auto flex items-center justify-center h-10 w-10 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <ArrowLeftStartOnRectangleIcon
                className="h-5 w-5"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
