import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/contstants";
import { ChevronLeftIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { PiButterflyBold } from "react-icons/pi";
import socialApi from "../../api/socialApi";
import { format } from "date-fns";

// Platform icons mapping
const platformIcons: Record<string, JSX.Element> = {
  facebook: <FaFacebookF className="text-blue-600" />,
  linkedin: <FaLinkedinIn className="text-blue-700" />,
  twitter: <FaTwitter className="text-blue-400" />,
  instagram: <FaInstagram className="text-pink-600" />,
  threads: <PiButterflyBold className="text-black dark:text-white" />,
};

// Status badge colors
const statusColors: Record<string, string> = {
  published:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  scheduled:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
};

// Interface for post data
interface Post {
  _id: string;
  content: string;
  platform: string;
  mediaType: string;
  status: string;
  publishedDate: string;
  accountName: string;
  accountAvatar: string | null;
  likes?: number;
  comments?: number;
  shares?: number;
  impressions?: number;
}

// Filter interface
interface Filters {
  platform?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: string;
}

const Posted = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    sortBy: "publishedDate",
    sortOrder: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch posts based on filters
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await socialApi.getPosts(filters);
      setPosts(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load posts");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a post
  const handleDeletePost = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await socialApi.deletePost(postId);
        // Refresh posts after deletion
        fetchPosts();
      } catch (err: any) {
        console.error("Error deleting post:", err);
        alert(err.message || "Failed to delete post");
      }
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    fetchPosts();
    setShowFilters(false);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      sortBy: "publishedDate",
      sortOrder: "desc",
    });
    setShowFilters(false);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return "Unknown date";
    }
  };

  // Truncate text
  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Load posts on component mount and when filters change
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-gray-800 dark:text-gray-100">
      {/* Back button */}
      <button
        onClick={() => navigate(ROUTES.POST)}
        className="inline-flex items-center mb-6 text-sm font-medium text-gray-700 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400"
      >
        <ChevronLeftIcon className="w-4 h-4 mr-1" />
        Back
      </button>

      {/* Header and Info Panel */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Posted Content
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z"
                  clipRule="evenodd"
                />
              </svg>
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            <button
              onClick={fetchPosts}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-800/50 transition-colors"
            >
              <ArrowPathIcon className="w-5 h-5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                Published Social Media Content
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                View and manage all your social media posts. Track engagement
                metrics and filter by platform or date.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Filter Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Platform filter */}
            <div>
              <label
                htmlFor="platform"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Platform
              </label>
              <select
                id="platform"
                value={filters.platform ?? ""}
                onChange={(e) => handleFilterChange("platform", e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Platforms</option>
                <option value="linkedin">LinkedIn</option>
                <option value="threads">Threads</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="instagram">Instagram</option>
              </select>
            </div>

            {/* Status filter */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                value={filters.status ?? ""}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Statuses</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Date range filter */}
            <div>
              <label
                htmlFor="dateRange"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Date Range
              </label>
              <div className="flex space-x-2">
                <input
                  id="startDate"
                  type="date"
                  value={filters.startDate ?? ""}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="From"
                />
                <input
                  id="endDate"
                  type="date"
                  value={filters.endDate ?? ""}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="To"
                />
              </div>
            </div>
          </div>

          {/* Sorting options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label
                htmlFor="sortBy"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Sort By
              </label>
              <select
                id="sortBy"
                value={filters.sortBy ?? "publishedDate"}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="publishedDate">Date Posted</option>
                <option value="likes">Likes</option>
                <option value="comments">Comments</option>
                <option value="shares">Shares</option>
                <option value="impressions">Impressions</option>
                <option value="platform">Platform</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="sortOrder"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Sort Order
              </label>
              <select
                id="sortOrder"
                value={filters.sortOrder ?? "desc"}
                onChange={(e) =>
                  handleFilterChange("sortOrder", e.target.value)
                }
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          {/* Filter action buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            No posts found
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {Object.keys(filters).some(
              (key) =>
                filters[key as keyof Filters] &&
                key !== "sortBy" &&
                key !== "sortOrder"
            )
              ? "Try changing your filters or create a new post."
              : "Get started by creating your first social media post."}
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate(ROUTES.POST)}
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              Create a Post
            </button>
          </div>
        </div>
      )}

      {/* Posts timeline */}
      {!loading && !error && posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700 transition-all flex flex-col h-full"
            >
              {/* Color bar based on platform */}
              <div
                className={`h-1.5 w-full ${
                  post.platform === "twitter"
                    ? "bg-blue-400"
                    : post.platform === "linkedin"
                    ? "bg-blue-700"
                    : post.platform === "facebook"
                    ? "bg-blue-600"
                    : post.platform === "instagram"
                    ? "bg-pink-500"
                    : post.platform === "threads"
                    ? "bg-black dark:bg-white"
                    : "bg-gray-500"
                }`}
              ></div>

              <div className="p-5 flex flex-col h-full">
                {/* Post header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    {post.accountAvatar ? (
                      <img
                        src={post.accountAvatar}
                        alt={post.accountName}
                        className="w-10 h-10 rounded-full mr-3 border-2 border-gray-100 dark:border-gray-700"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 border-2 border-gray-200 dark:border-gray-600">
                        {platformIcons[post.platform] || (
                          <span className="text-gray-500 dark:text-gray-400">
                            ?
                          </span>
                        )}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-800 dark:text-gray-100">
                          {post.accountName}
                        </span>
                      </div>
                      <div className="flex items-center text-xs mt-0.5">
                        <span className="flex items-center text-gray-500 dark:text-gray-400">
                          {platformIcons[post.platform] || null}
                          <span className="ml-1 capitalize">
                            {post.platform}
                          </span>
                        </span>
                        <span className="mx-1 text-gray-400 dark:text-gray-500">
                          •
                        </span>
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[post.status] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {post.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Delete post"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {/* Date */}
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {formatDate(post.publishedDate)}
                </div>

                {/* Post content */}
                <div className="mb-4 flex-grow">
                  <p className="text-gray-800 dark:text-gray-200">
                    {truncateText(post.content, 100)}
                  </p>
                </div>

                {/* Post analytics */}
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400 mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                  {post.likes !== undefined && (
                    <div className="flex items-center bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{post.likes}</span>
                    </div>
                  )}
                  {post.comments !== undefined && (
                    <div className="flex items-center bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-blue-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{post.comments}</span>
                    </div>
                  )}
                  {post.shares !== undefined && (
                    <div className="flex items-center bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                      <span>{post.shares}</span>
                    </div>
                  )}
                  {post.impressions !== undefined && (
                    <div className="flex items-center bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-purple-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{post.impressions}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posted;
