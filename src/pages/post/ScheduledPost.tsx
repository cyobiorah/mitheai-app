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
  const [filter, setFilter] = useState({ status: "scheduled" });
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
  }, [filter]);

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
    navigate(`${ROUTES.EDIT_SCHEDULED_POST}/${postId}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate(ROUTES.POST)}
        className="inline-flex items-center mb-6 text-sm font-medium text-gray-700 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400"
      >
        <ChevronLeftIcon className="w-4 h-4 mr-1" />
        Back
      </button>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Scheduled Posts
        </h1>
        <button
          onClick={() => navigate(ROUTES.POST)}
          className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition"
        >
          Create New Post
        </button>
      </div>

      <div className="mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter({ ...filter, status: "scheduled" })}
            className={`px-3 py-1 rounded-md ${
              filter.status === "scheduled"
                ? "bg-primary-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Scheduled
          </button>
          <button
            onClick={() => setFilter({ ...filter, status: "completed" })}
            className={`px-3 py-1 rounded-md ${
              filter.status === "completed"
                ? "bg-primary-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter({ ...filter, status: "failed" })}
            className={`px-3 py-1 rounded-md ${
              filter.status === "failed"
                ? "bg-primary-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Failed
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p>Loading scheduled posts...</p>
        </div>
      ) : scheduledPosts.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <FaCalendarAlt className="mx-auto text-4xl text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No scheduled posts
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            You don't have any {filter.status} posts yet.
          </p>
          <button
            onClick={() => navigate(ROUTES.POST)}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition"
          >
            Create a Post
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {scheduledPosts.map((post: any) => (
            <div
              key={post._id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Scheduled for{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {format(new Date(post.scheduledForDisplay), "PPpp")}
                    </span>
                  </p>
                  <p className="text-gray-800 dark:text-gray-200 mb-3">
                    {post.content.substring(0, 100)}
                    {post.content.length > 100 ? "..." : ""}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.platforms.map((platform: any, idx: number) => (
                      <div
                        key={idx}
                        className={`text-xs px-2 py-1 rounded-full ${
                          platform.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : platform.status === "published"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {platform.accountName} ({platform.status})
                        <br />
                        {platform.platformId}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {filter.status === "scheduled" && (
                    <>
                      <button
                        onClick={() => handleEdit(post._id)}
                        className="p-2 text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="p-2 text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </>
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

export default ScheduledPosts;
