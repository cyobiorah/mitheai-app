import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
  FaPinterest,
  FaYoutube,
} from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { PiButterflyBold } from "react-icons/pi";
import { LiaBlogger } from "react-icons/lia";
import { BsPencilSquare, BsCardImage, BsCameraVideo } from "react-icons/bs";
import { useNavigate, Outlet, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../store/hooks";
import { ROUTES } from "../../utils/contstants";

const platformIcons = {
  facebook: { icon: <FaFacebookF />, name: "Facebook" },
  butterfly: { icon: <PiButterflyBold />, name: "Butterfly" },
  linkedin: { icon: <FaLinkedinIn />, name: "LinkedIn" },
  blogger: { icon: <LiaBlogger />, name: "Blogger" },
  twitter: { icon: <FaTwitter />, name: "Twitter" },
  instagram: { icon: <FaInstagram />, name: "Instagram" },
  pinterest: { icon: <FaPinterest />, name: "Pinterest" },
  tiktok: { icon: <SiTiktok />, name: "TikTok" },
  youtube: { icon: <FaYoutube />, name: "YouTube" },
};

const CreatePost = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const postTypes = [
    {
      type: "text",
      title: "Text Post",
      icon: <BsPencilSquare className="text-primary-500 text-2xl" />,
      platforms: ["facebook", "butterfly", "linkedin", "blogger", "twitter"],
    },
    {
      type: "image",
      title: "Image Post",
      icon: <BsCardImage className="text-pink-500 text-2xl" />,
      platforms: [
        "facebook",
        "butterfly",
        "linkedin",
        "blogger",
        "twitter",
        "instagram",
        "pinterest",
        "tiktok",
      ],
      disabled: true,
    },
    {
      type: "video",
      title: "Video Post",
      icon: <BsCameraVideo className="text-red-500 text-2xl" />,
      platforms: [
        "facebook",
        "linkedin",
        "blogger",
        "twitter",
        "instagram",
        "pinterest",
        "tiktok",
        "youtube",
      ],
      disabled: true,
    },
  ];

  const getStyles = (type: string, disabled: boolean) => {
    if (disabled) {
      return "bg-gray-100 dark:bg-gray-700";
    }
    switch (type) {
      case "text":
        return "bg-blue-500";
      case "image":
        return "bg-pink-500";
      case "video":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-gray-800 dark:text-gray-100">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Create a New Post
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("scheduled")}
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
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Scheduled</span>
            </button>

            <button
              onClick={() => navigate("posted")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-800/50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Published</span>
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
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                Create and Share Content
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Choose the type of content you'd like to share across your
                connected social platforms. Schedule for later or publish
                immediately.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {postTypes.map(({ title, icon, platforms, type, disabled }) => (
          <button
            key={type}
            onClick={() => {
              if (disabled) {
                toast.error("This feature is not available yet.");
                return;
              }
              navigate(type);
            }}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700 transition-all cursor-pointer group"
          >
            <div className="relative">
              <div
                className={`h-3 w-full ${getStyles(type, disabled || false)}`}
              ></div>
              <div className="p-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 shadow-sm">
                  <div className="transform group-hover:scale-110 transition-transform">
                    {icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-3">
                  {title}
                </h3>

                <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                  {platforms.slice(0, 5).map((platform) => {
                    const { icon } =
                      platformIcons[platform as keyof typeof platformIcons];
                    return (
                      <div
                        key={platform}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700"
                        title={
                          platform.charAt(0).toUpperCase() + platform.slice(1)
                        }
                      >
                        {icon}
                      </div>
                    );
                  })}
                  {platforms.length > 5 && (
                    <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-xs font-medium">
                      +{platforms.length - 5}
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  <span className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-800/40 transition-colors">
                    Create {title}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {isAdmin && (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">
              🔗 Connect your social media accounts
            </span>
            <span>to publish your content.</span>
          </div>
          <Link
            to={ROUTES.ACCOUNT_SETUP}
            className="mt-3 sm:mt-0 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold py-2 px-4 rounded-md transition"
          >
            Connect Accounts
          </Link>
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default CreatePost;
