import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { ROUTES } from "../../utils/contstants";
import { SocialAccount } from "../../api/social";
import socialApi from "../../api/socialApi";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { PiButterflyBold } from "react-icons/pi";
import { useAuth } from "../../store/hooks";
import { allTimezones } from "../../utils/timezone";
import { useTeamStore } from "../../store/teamStore";

const TextPost = () => {
  const [caption, setCaption] = useState("");
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  // const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
  //   null
  // );
  const [selectedAccountDetails, setSelectedAccountDetails] = useState({
    accountId: "",
    id: "",
  });
  const [userTimezone, setUserTimezone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const navigate = useNavigate();

  const { user } = useAuth();
  const { activeTeam } = useTeamStore();

  useEffect(() => {
    if (user?.timezone) {
      setUserTimezone(user.timezone);
    }
  }, [user]);

  const handlePost = async () => {
    if (!selectedAccountDetails.accountId) {
      alert("Please select an account to post to");
      return;
    }

    // Find the selected account object
    const selectedAccount = accounts.find(
      (acc) => acc.accountId === selectedAccountDetails.accountId
    );
    if (!selectedAccount) {
      alert("Selected account not found");
      return;
    }

    if (scheduleEnabled) {
      // Schedule the post
      const scheduledPost = {
        content: caption,
        platforms: [
          {
            platformId: selectedAccount.platform,
            accountId: selectedAccountDetails.accountId,
          },
        ],
        scheduledFor: scheduledDate,
        // Add team and organization IDs if available
        teamId: selectedAccount.teamId,
        organizationId: selectedAccount.organizationId,
        timezone: userTimezone,
        mediaType: "TEXT",
      };

      await socialApi.schedulePost(scheduledPost);
      alert("Post scheduled successfully!");
      navigate(`${ROUTES.POST}/scheduled`);
    } else {
      // Post now
      try {
        setLoading(true);

        const data = {
          content: caption,
          accountId: selectedAccountDetails.accountId,
          id: selectedAccountDetails.id,
          teamId: activeTeam?._id,
          organizationId: user?.organizationId,
        };

        // Check which platform to post to
        switch (selectedAccount.platform) {
          case "threads": {
            const threadsData = {
              ...data,
              mediaType: "TEXT",
            };
            await socialApi.postToThreads(
              selectedAccountDetails.accountId,
              threadsData
            );
            alert("Posted successfully to Threads!");
            break;
          }
          case "linkedin":
            await socialApi.postToLinkedIn(
              selectedAccountDetails.accountId,
              caption
            );
            alert("Posted successfully to LinkedIn!");
            break;
          case "twitter": {
            await socialApi.postToTwitter(
              selectedAccountDetails.accountId,
              data
            );
            alert("Posted successfully to Twitter!");
            break;
          }
          default:
            alert(
              `Posting to ${selectedAccount.platform} is not yet supported.`
            );
        }
      } catch (error) {
        console.error("Failed to post:", error);
        alert("Failed to post. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGetSocials = async () => {
    if (user?.userType === "individual") {
      return await socialApi.listAccountsIndividual({ userId: user?._id });
    } else if (user?.role === "user") {
      return await socialApi.listSocialAccountsByTeam({
        teamId: activeTeam?._id!,
      });
    } else {
      return await socialApi.getAccounts();
    }
  };

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const accounts = await handleGetSocials();
      setAccounts(accounts);
    } catch (error) {
      console.error("Failed to fetch social accounts:", error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [activeTeam, user]);

  // Get platform icon based on platform name
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <FaFacebookF className="text-blue-600" />;
      case "twitter":
        return <FaTwitter className="text-blue-400" />;
      case "linkedin":
        return <FaLinkedinIn className="text-blue-700" />;
      case "instagram":
        return <FaInstagram className="text-pink-500" />;
      case "threads":
        return <PiButterflyBold className="text-black dark:text-white" />;
      default:
        return null;
    }
  };

  const handleRenderAccountsSection = () => {
    let renderAccountsSection;

    if (loading) {
      renderAccountsSection = (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      );
    } else if (accounts.length === 0) {
      renderAccountsSection = (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-yellow-700 dark:text-yellow-300">
          <p>No social accounts connected. Please connect an account first.</p>
          <button
            onClick={() => navigate(ROUTES.ACCOUNT_SETUP)}
            className="mt-2 text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Go to Settings
          </button>
        </div>
      );
    } else {
      renderAccountsSection = (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {accounts.map((account) => {
            const isSelected =
              selectedAccountDetails.accountId === account.accountId;
            return (
              <button
                key={account._id}
                // onClick={() => setSelectedAccountId(account.accountId)}
                onClick={() =>
                  setSelectedAccountDetails({
                    accountId: account.accountId,
                    id: account._id,
                  })
                }
                className={`relative flex items-center p-3 border rounded-lg transition-all ${
                  isSelected
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-500"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700"
                }`}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    {getPlatformIcon(account.platform)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      @{account.accountName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {account.platform}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <CheckCircleIcon className="absolute top-2 right-2 w-5 h-5 text-primary-500" />
                )}
              </button>
            );
          })}
        </div>
      );
    }

    return renderAccountsSection;
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

      {/* Account Selection */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
          Select account to post to
        </h2>

        {handleRenderAccountsSection()}

        {accounts.length > 0 && !selectedAccountDetails.accountId && (
          <p className="mt-2 text-sm text-red-500 dark:text-red-400">
            * Please select an account to post to
          </p>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Caption Input */}
        <div className="flex-1">
          <CaptionInput value={caption} onChange={setCaption} />
          {/* Optional additional caption tools */}
          <div className="flex gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
            <button className="hover:text-primary-500 transition-colors">
              Platform Captions
            </button>
            <button className="hover:text-primary-500 transition-colors">
              Past Captions
            </button>
          </div>
        </div>

        {/* Right: Schedule */}
        <div className="w-full md:w-80 md:pt-6">
          <ScheduleControls
            scheduleEnabled={scheduleEnabled}
            setScheduleEnabled={setScheduleEnabled}
            scheduledDate={scheduledDate}
            setScheduledDate={setScheduledDate}
            caption={caption}
            handlePost={handlePost}
            isValid={!!selectedAccountDetails.accountId && caption.length > 0}
            userTimezone={userTimezone}
            setUserTimezone={setUserTimezone}
          />
        </div>
      </div>
    </div>
  );
};

export default TextPost;

// Caption Input
const CaptionInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => (
  <div className="mb-4">
    <label
      htmlFor="caption"
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
    >
      Main Caption
    </label>
    <textarea
      id="caption"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      maxLength={280}
      placeholder="Write something amazing..."
      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 resize-none text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
    />
    <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
      {value.length}/280
    </div>
  </div>
);

// Schedule Control
const ScheduleControls = ({
  scheduleEnabled,
  setScheduleEnabled,
  scheduledDate,
  setScheduledDate,
  caption,
  handlePost,
  isValid,
  userTimezone,
  setUserTimezone,
}: {
  scheduleEnabled: boolean;
  setScheduleEnabled: (v: boolean) => void;
  scheduledDate: Date;
  setScheduledDate: (d: Date) => void;
  caption: string;
  handlePost: () => void;
  isValid: boolean;
  userTimezone: string;
  setUserTimezone: (tz: string) => void;
}) => {
  const [timezones, setTimezones] = useState<string[]>([]);

  useEffect(() => {
    // Get list of common timezones
    const commonTimezones = Object.values(allTimezones)
      .flat()
      .map((tz) => tz.value);
    setTimezones(commonTimezones);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <label
          htmlFor="schedule"
          className="font-medium text-sm text-gray-700 dark:text-gray-300"
        >
          {scheduleEnabled ? "Schedule" : "Post Now"}
        </label>
        <input
          type="checkbox"
          id="schedule"
          checked={scheduleEnabled}
          onChange={(e) => setScheduleEnabled(e.target.checked)}
          className="w-5 h-5 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
        />
      </div>
      <div className="space-y-3">
        {scheduleEnabled && (
          <div>
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

            <DatePicker
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
        )}

        <button
          disabled={!isValid}
          onClick={() => handlePost()}
          className="w-full py-2 text-sm font-semibold rounded-md transition text-white bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 dark:disabled:bg-primary-800"
        >
          {scheduleEnabled ? "Schedule" : "Post Now"}
        </button>
        {!isValid && (
          <p className="text-xs text-center text-red-500 dark:text-red-400 mt-1">
            {!caption.length
              ? "Caption required"
              : "Select an account to post to"}
          </p>
        )}
      </div>
    </div>
  );
};
