import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { ROUTES } from "../../utils/contstants";
import socialApi from "../../api/socialApi";
import { useAuth } from "../../store/hooks";

const EditScheduledPost = () => {
  //   const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState<any>(null);
  const [content, setContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [userTimezone, setUserTimezone] = useState("America/New_York");
  const [timezones, setTimezones] = useState<string[]>([]);

  const { user } = useAuth();

  const params = useParams();

  useEffect(() => {
    // Get list of common timezones
    const commonTimezones = [
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
      "Europe/London",
      "Europe/Paris",
      "Asia/Tokyo",
      "Australia/Sydney",
    ];
    setTimezones(commonTimezones);

    // console.log({ params });

    setUserTimezone(user?.timezone ?? "America/New_York");

    // Fetch the scheduled post
    const fetchScheduledPost = async () => {
      try {
        setLoading(true);
        // We need to implement this method in the socialApi
        const response = await socialApi.getScheduledPostById(params.id!);
        const fetchedPost = response.data;

        setPost(fetchedPost);
        setContent(fetchedPost.content);
        setScheduledDate(new Date(fetchedPost.scheduledFor));
      } catch (error) {
        console.error("Failed to fetch scheduled post:", error);
        // navigate(`${ROUTES.POST}/scheduled`);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchScheduledPost();
    }
  }, [params.id, navigate]);

  const handleSave = async () => {
    if (!content.trim()) {
      alert("Content cannot be empty");
      return;
    }

    try {
      setSaving(true);

      const updateData = {
        content,
        scheduledFor: scheduledDate,
      };

      await socialApi.updateScheduledPost(params.id!, updateData);
      navigate(`${ROUTES.POST}/scheduled`);
    } catch (error) {
      console.error("Failed to update scheduled post:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <p>Loading scheduled post...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate(`${ROUTES.POST}/scheduled`)}
        className="inline-flex items-center mb-6 text-sm font-medium text-gray-700 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400"
      >
        <ChevronLeftIcon className="w-4 h-4 mr-1" />
        Back to Scheduled Posts
      </button>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Edit Scheduled Post
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Caption Input */}
        <div className="flex-1">
          <div className="mb-4">
            <label
              htmlFor="caption"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Content
            </label>
            <textarea
              id="caption"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              maxLength={280}
              placeholder="Write something amazing..."
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 resize-none text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
              {content.length}/280
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              Platform:
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-700 dark:text-gray-300">
                {post?.platforms?.[0]?.accountName ||
                  post?.platforms?.[0]?.platformId}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Schedule */}
        <div className="w-full md:w-80">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-3">
              Schedule Settings
            </h3>

            <div className="space-y-3">
              <div className="mb-3">
                <label
                  htmlFor="timezone"
                  className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Timezone
                </label>
                <select
                  id="timezone"
                  value={userTimezone}
                  onChange={(e) => setUserTimezone(e.target.value)}
                  className="w-full text-sm px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="scheduledDate"
                  className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Scheduled Date & Time
                </label>
                <DatePicker
                  id="scheduledDate"
                  selected={scheduledDate}
                  onChange={(date) => date && setScheduledDate(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  className="w-full text-sm px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  timeFormat="p"
                  timeIntervals={15}
                  minDate={new Date()}
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Scheduled time shown in {userTimezone.replace(/_/g, " ")}
                </div>
              </div>

              <button
                disabled={saving || !content.trim()}
                onClick={handleSave}
                className="w-full py-2 text-sm font-semibold rounded-md transition text-white bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 dark:disabled:bg-primary-800"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditScheduledPost;
