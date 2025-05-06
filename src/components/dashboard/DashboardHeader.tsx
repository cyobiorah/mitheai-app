import { Button } from "../../components/ui/button";
import { ThemeToggle } from "../../components/ui/theme-toggle";
import { useAuth } from "../../store/hooks";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { getInitials } from "../../lib/utils";
import { Bell, Menu, Plus } from "lucide-react";
import { useMobileMenuStore } from "../../store/layout";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardHeader() {
  const { user, logout } = useAuth();

  const mobileMenuOpen = useMobileMenuStore(
    (state: any) => state.mobileMenuOpen
  );
  const setMobileMenuOpen = useMobileMenuStore(
    (state: any) => state.setMobileMenuOpen
  );

  return (
    <header className="h-16 border-b flex items-center px-4 sticky top-0 bg-background z-10">
      <div className="flex-1 flex">
        <Link to="/dashboard">
          <div className="text-primary-600 text-xl font-bold flex items-center dark:text-primary-400">
            <i className="ri-calendar-check-fill mr-1"></i>
            <span className="font-heading">Skedlii</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {/* <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard/create-post">
            <Plus className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">New Post</span>
          </Link>
        </Button> */}

        {/* <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button> */}

        <ThemeToggle variant="ghost" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user?.avatar ?? ""}
                  alt={user?.firstName ?? ""}
                />
                <AvatarFallback>
                  {user?.firstName
                    ? getInitials(user.firstName)
                    : user?.username?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="font-medium">
                  {user?.firstName ?? user?.username}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings">Profile Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/accounts">Manage Accounts</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden mr-4"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0 w-[240px] z-50">
            <DashboardSidebar
              closeMenu={() => setMobileMenuOpen(false)}
              isMobile={mobileMenuOpen}
            />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
