import React, { useEffect, useState } from "react";
import { useAuth } from "../store/hooks";
import { Link, useNavigate } from "react-router-dom";
import { ContentItem } from "../types";
import toast from "react-hot-toast";
// import { ROUTES } from "../utils/constants";
import {
  BookmarkIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PlusIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import StatsCard from "../components/StatsCard";
import * as contentApi from "../api/content";
import { ROUTES } from "../utils/contstants";
import socialApi from "../api/socialApi";

const Dashboard: React.FC = () => {
  const { user, organization, teams } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentContent, setRecentContent] = useState<ContentItem[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalContent: 0,
    totalCollections: 0,
    analyzedContent: 0,
    totalTeams: 0,
    totalMembers: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch personal content
      const content = await socialApi.getPostsByUserId(user?._id!);
      setRecentContent(content.data.slice(0, 5)); // Show only 5 most recent items

      // Fetch personal collections
      // const personalCollections = await contentApi.getPersonalCollections();
      // setCollections(personalCollections);

      // Calculate stats
      setStats({
        totalContent: content.data.length,
        totalCollections: 0,
        analyzedContent: content.data.filter(
          (item: any) => item.status === "published"
        ).length,
        totalTeams: teams?.length || 0,
        totalMembers: 0, // This would need an API call to get total members
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      // setError("Failed to load dashboard data");
      // toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateContent = () => {
    navigate(ROUTES.POST);
  };

  // Render different welcome message based on user type
  const renderWelcomeHeader = () => {
    return (
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {user?.userType === "organization"
              ? `Manage your organization's content and team activities`
              : `Here's an overview of your personal content and activities`}
          </p>
        </div>
        <button
          onClick={handleCreateContent}
          className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <PlusIcon className="mr-2 h-5 w-5" />
          Create Content
        </button>
      </div>
    );
  };

  // Render organization-specific stats
  const renderOrganizationStats = () => {
    if (user?.userType !== "organization") return null;

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Teams"
          value={stats.totalTeams}
          icon={UsersIcon}
          trend={{
            value: 0,
            label: "active teams",
            isPositive: true,
          }}
        />
        <StatsCard
          title="Members"
          value={stats.totalMembers}
          icon={UsersIcon}
          trend={{
            value: 0,
            label: "team members",
            isPositive: true,
          }}
        />
        <StatsCard
          title="Organization Content"
          value={stats.totalContent}
          icon={DocumentTextIcon}
          trend={{
            value: 0,
            label: "pieces of content",
            isPositive: false,
          }}
        />
      </div>
    );
  };

  // Render individual-specific stats
  const renderIndividualStats = () => {
    if (user?.userType === "organization") return null;

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Content"
          value={stats.totalContent}
          icon={DocumentTextIcon}
          trend={{
            value: 0,
            label: "pieces of content",
            isPositive: false,
          }}
        />
        <StatsCard
          title="Collections"
          value={stats.totalCollections}
          icon={BookmarkIcon}
          trend={{
            value: 0,
            label: "personal collections",
            isPositive: false,
          }}
        />
        <StatsCard
          title="Analyzed Content"
          value={stats.analyzedContent}
          icon={ChartBarIcon}
          trend={{
            value: 0,
            label: "analyzed pieces",
            isPositive: false,
          }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Header */}
      {renderWelcomeHeader()}

      {/* Stats Overview - Different for each user type */}
      {user?.userType === "organization"
        ? renderOrganizationStats()
        : renderIndividualStats()}

      {/* Recent Content - Show for both user types */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Recent Content
          </h2>
          <Link
            to={`${ROUTES.POST}/posted`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            View all
          </Link>
        </div>
        <div className="rounded-lg border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mt-4 space-y-4">
            {recentContent.length > 0 ? (
              recentContent.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between rounded-md border p-4 dark:border-gray-700"
                >
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.content}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString() ??
                        new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      item.status === "published"
                        ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No content created yet
              </p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
