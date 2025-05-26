import { Outlet, useLocation } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col">
      <DashboardHeader />
      <div className="flex-1 flex overflow-hidden">
        <div className="hidden md:block">
          <DashboardSidebar />
        </div>

        <div
          key={location.pathname}
          className="flex-1 p-6 overflow-y-auto ml-0 md:ml-64"
        >
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
