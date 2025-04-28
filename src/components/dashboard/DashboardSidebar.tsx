import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import {
  BarChart3,
  CalendarCheck,
  Folder,
  Home,
  Link2,
  Users,
  Settings,
} from "lucide-react";
import { useAuth } from "../../store/hooks";
import { useMemo } from "react";

interface SidebarItemProps {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly href: string;
  readonly active: boolean;
  readonly disabled?: boolean;
}

function SidebarItem({
  icon,
  label,
  href,
  active,
  disabled,
}: SidebarItemProps) {
  return (
    <Link to={href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2",
          active && "bg-accent text-accent-foreground",
          disabled && "hidden"
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
}

export default function DashboardSidebar() {
  const location = useLocation();
  const { isAdmin, user } = useAuth();

  const menuItems = useMemo(
    () => [
      {
        icon: <Home size={18} />,
        label: "Dashboard",
        href: "/dashboard",
      },
      {
        icon: <CalendarCheck size={18} />,
        label: "Schedule",
        href: "/dashboard/schedule",
      },
      {
        icon: <Link2 size={18} />,
        label: "Social Accounts",
        href: "/dashboard/accounts",
      },
      {
        icon: <Folder size={18} />,
        label: "Collections",
        href: "/dashboard/collections",
      },
      {
        icon: <Users size={18} />,
        label: "Teams",
        href: "/dashboard/teams",
        disabled: user?.userType === "individual",
      },
      {
        icon: <BarChart3 size={18} />,
        label: "Analytics",
        href: "/dashboard/analytics",
      },
    ],
    [isAdmin, user]
  );

  return (
    <div className="h-full min-w-[220px] border-r bg-background px-3 py-4">
      <div className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={location.pathname === item.href}
            disabled={item.disabled}
          />
        ))}
      </div>

      <div className="mt-auto pt-4 border-t">
        <SidebarItem
          icon={<Settings size={18} />}
          label="Settings"
          href="/settings"
          active={location.pathname === "/settings"}
        />
      </div>
    </div>
  );
}
