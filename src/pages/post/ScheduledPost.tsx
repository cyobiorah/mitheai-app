import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ROUTES } from "../../utils/contstants";
import socialApi from "../../api/socialApi";
import { FaCalendarAlt, FaEdit, FaTrash } from "react-icons/fa";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

const ScheduledPosts = () => {
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchScheduledPosts = async () => {
    try {
      setLoading(true);
      const response = await socialApi.getScheduledPosts();
      setScheduledPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch scheduled posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduledPosts();
  }, []);

  const handleDelete = async (postId: string) => {
    if (
      !window.confirm("Are you sure you want to delete this scheduled post?")
    ) {
      return;
    }

    try {
      await socialApi.deleteScheduledPost(postId);
      fetchScheduledPosts();
    } catch (error) {
      console.error("Failed to delete scheduled post:", error);
      alert("Failed to delete scheduled post. Please try again.");
    }
  };

  const handleEdit = (postId: string) => {
    navigate(`${ROUTES.SCHEDULE}/${postId}`);
  };

  // Function to determine status styling
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  // Function to determine platform color
  const getPlatformColor = (platformId: string) => {
    switch (platformId.toLowerCase()) {
      case "twitter":
        return "bg-blue-400";
      case "linkedin":
        return "bg-blue-700";
      case "facebook":
        return "bg-blue-600";
      case "instagram":
        return "bg-pink-500";
      case "threads":
        return "bg-black dark:bg-white";
      default:
        return "bg-gray-500";
    }
  };

  const handleScheduledPostsView = () => {
    return scheduledPosts.length === 0 ? (
      <EmptyScheduledPost navigate={navigate} />
    ) : (
      <ScheduledPostCard
        scheduledPosts={scheduledPosts}
        getPlatformColor={getPlatformColor}
        getStatusStyles={getStatusStyles}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-gray-800 dark:text-gray-100">
      <button
        onClick={() => navigate(ROUTES.POST)}
        className="inline-flex items-center mb-6 text-sm font-medium text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
      >
        <ChevronLeftIcon className="w-4 h-4 mr-1" />
        Back
      </button>

      {/* Header and Info Panel */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Scheduled Posts
          </h1>

          <button
            onClick={() => navigate(ROUTES.POST)}
            className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create New Post
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 flex-shrink-0">
              <FaCalendarAlt className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                Scheduled Content
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                View and manage your upcoming social media posts. Edit or delete
                posts before they go live.
              </p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p>Loading scheduled posts...</p>
        </div>
      ) : (
        handleScheduledPostsView()
      )}
    </div>
  );
};

export default ScheduledPosts;

const EmptyScheduledPost = ({ navigate }: { navigate: any }) => {
  return (
    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <FaCalendarAlt className="mx-auto text-5xl text-gray-400 dark:text-gray-500 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        No scheduled posts
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
        You don't have any scheduled posts yet. Create a post and schedule it
        for later.
      </p>
      <button
        onClick={() => navigate(ROUTES.POST)}
        className="mt-6 px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Create a Post
      </button>
    </div>
  );
};

const ScheduledPostCard = ({
  scheduledPosts,
  getPlatformColor,
  getStatusStyles,
  handleEdit,
  handleDelete,
}: {
  scheduledPosts: any;
  getPlatformColor: (platformId: string) => string;
  getStatusStyles: (status: string) => string;
  handleEdit: (postId: string) => void;
  handleDelete: (postId: string) => void;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {scheduledPosts.map((post: any) => (
        <div
          key={post._id}
          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700 transition-all flex flex-col h-full"
        >
          {/* Color bar based on platform */}
          <div
            className={`h-1.5 w-full ${getPlatformColor(
              post.platforms[0].platformId
            )}`}
          ></div>

          <div className="p-5 flex flex-col h-full">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <FaCalendarAlt className="text-blue-500 mr-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Scheduled for{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {format(new Date(post.scheduledFor), "PPpp")}
                  </span>
                </p>
              </div>

              <p className="text-gray-800 dark:text-gray-200 mb-4">
                {post.content.substring(0, 100)}
                {post.content.length > 100 ? "..." : ""}
              </p>

              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-full">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mr-1 capitalize">
                      {post.platforms[0].platformId}:
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      @{post.platforms[0].accountName}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <span
                className={`text-xs px-2 py-1 rounded-full ${getStatusStyles(
                  post.platforms[0].status
                )}`}
              >
                {post.platforms[0].status}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(post._id)}
                  className="p-1.5 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Edit"
                >
                  <FaEdit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Delete"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
