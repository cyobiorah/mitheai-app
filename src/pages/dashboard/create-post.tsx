import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/hooks";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import PostCreate from "../../components/dashboard/PostCreate";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { isAuthenticated, authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />

      <div className="flex-1 flex">
        <div className="hidden md:block">
          <DashboardSidebar />
        </div>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <PostCreate />
          </div>
        </main>
      </div>
    </div>
  );
}
