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
import { useNavigate, Outlet } from "react-router-dom";

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
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-gray-800 dark:text-gray-100">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold">Create a New Post</h1>
        <button
          onClick={() => navigate('posted')}
          className="flex items-center gap-2 text-primary-500 hover:text-primary-600 transition-colors"
        >
          <span>View Posted Content</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Choose the type of content you'd like to share across your connected
        social platforms.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {postTypes.map(({ title, icon, platforms, type }) => (
          <button
            key={type}
            onClick={() => navigate(type)}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer text-left w-full"
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
                {icon}
              </div>
              <h2 className="font-semibold text-base">{title}</h2>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                {platforms.map((key) => {
                  const { icon } =
                    platformIcons[key as keyof typeof platformIcons];
                  return (
                    <span key={key} className="flex items-center gap-1">
                      {icon}
                    </span>
                  );
                })}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium">
            🔗 Connect your social media accounts
          </span>
          <span>to publish your content.</span>
        </div>
        <button className="mt-3 sm:mt-0 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold py-2 px-4 rounded-md transition">
          Connect Accounts
        </button>
      </div>

      <Outlet />
    </div>
  );
};

export default CreatePost;
