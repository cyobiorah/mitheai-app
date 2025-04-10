import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaPinterest,
} from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";
import { SiBluesky } from "react-icons/si";
import toast from "react-hot-toast";
import { useAuth } from "../../store/hooks";
import socialApi from "../../api/socialApi";
import { useThemeStore } from "../../store/themeStore";

interface SocialAccount {
  platform: string;
  accountName: string;
  status: string;
  id: string;
  accountId: string;
  teamId?: string;
  displayName: string;
  username: string;
  _id?: string;
}

interface ConnectionError {
  code: string;
  message: string;
  details?: {
    connectedToUserId?: string;
    connectedToOrganization?: string;
    connectedToTeam?: string;
    connectionDate?: string;
  };
}

// Social platform configuration
const platforms = [
  {
    id: "twitter",
    name: "Twitter",
    icon: FaTwitter,
    color: "#1DA1F2",
    connectFn: (skipWelcome = false) =>
      socialApi.connectTwitter({ skipWelcome }),
    description:
      "Connect to share text, images, and videos with your audience.",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: FaFacebook,
    color: "#4267B2",
    connectFn: () => socialApi.connectFacebook(),
    description: "Share updates with your Facebook audience and pages.",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: FaLinkedin,
    color: "#0077B5",
    connectFn: () => socialApi.connectLinkedIn(),
    description:
      "Share professional content with your network and company pages.",
  },
  {
    id: "threads",
    name: "Threads",
    icon: FaThreads,
    color: "#000000",
    connectFn: () => socialApi.connectThreads(),
    description: "Connect to Meta's text-based conversation app.",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: FaInstagram,
    color: "#E1306C",
    connectFn: null,
    description: "Coming soon - share visual content with your followers.",
    disabled: true,
  },
  {
    id: "bluesky",
    name: "Bluesky",
    icon: SiBluesky,
    color: "#0085FF",
    connectFn: null,
    description: "Coming soon - connect to the decentralized social network.",
    disabled: true,
  },
  {
    id: "pinterest",
    name: "Pinterest",
    icon: FaPinterest,
    color: "#E60023",
    connectFn: null,
    description: "Coming soon - share visual content to boards.",
    disabled: true,
  },
  {
    id: "tictok",
    name: "TikTok",
    icon: FaTiktok,
    color: "#E60023",
    connectFn: null,
    description: "Coming soon - share visual content to boards.",
    disabled: true,
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: FaYoutube,
    color: "#E60023",
    connectFn: null,
    description: "Coming soon - share visual content to boards.",
    disabled: true,
  },
];

const AccountSetup: React.FC = () => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] =
    useState<ConnectionError | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useThemeStore();

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Steps for the account setup process
  const steps = ["Connect Accounts", "Verify Connections", "Start Posting"];

  useEffect(() => {
    const fetchData = async () => {
      // Check for OAuth callback success/error
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.get("success") === "true") {
        toast.success(`Social account connected successfully!`);
        // Clear URL params without causing a reload
        window.history.replaceState({}, "", "/account-setup");

        // Move to next step if at least one account is connected
        if (activeStep === 0) {
          setActiveStep(1);
        }
      } else if (searchParams.get("error")) {
        // Handle specific error types
        const errorType = searchParams.get("error");
        console.log("Error detected:", errorType);

        if (errorType === "account_already_connected") {
          const errorDetailsParam = searchParams.get("details");
          console.log("Error details:", errorDetailsParam);
          let errorDetails = null;

          if (errorDetailsParam) {
            try {
              errorDetails = JSON.parse(decodeURIComponent(errorDetailsParam));
              setConnectionError(errorDetails);
            } catch (e) {
              console.error("Failed to parse error details:", e);
              setConnectionError({
                code: "account_already_connected",
                message:
                  "This social account is already connected to another user.",
              });
            }
          } else {
            setConnectionError({
              code: "account_already_connected",
              message:
                "This social account is already connected to another user.",
            });
          }
        } else {
          // Generic error handling
          console.error("Failed to connect social account:", errorType);
          setConnectionError({
            code: errorType as string,
            message: "Failed to connect social account",
          });
        }

        // Clear URL params without causing a reload
        window.history.replaceState({}, "", "/account-setup");
      }

      // Fetch accounts
      await fetchAccounts();
    };

    fetchData();
  }, [location]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const accounts = await socialApi.getAccounts();
      setAccounts(accounts);
    } catch (error) {
      console.error("Failed to fetch social accounts:", error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platformId: string) => {
    const platform = platforms.find((p) => p.id === platformId);
    if (!platform?.connectFn) return;

    try {
      const response = await platform.connectFn();
      window.location.href = response;
    } catch (error) {
      console.error(`Failed to connect to ${platform.name}:`, error);
      toast.error(`Failed to connect to ${platform.name}`);
    }
  };

  const handleDisconnect = async (accountId: string, platformName: string) => {
    try {
      await socialApi.disconnectSocialAccount({ accountId });
      toast.success(`${platformName} account disconnected successfully`);
      await fetchAccounts();
    } catch (error) {
      console.error("Failed to disconnect account:", error);
      toast.error("Failed to disconnect account");
    } finally {
      fetchAccounts();
    }
  };

  const handleNextStep = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handleBackStep = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const getConnectedAccountForPlatform = (platformId: string) => {
    return accounts.find(
      (account) => account.platform.toLowerCase() === platformId
    );
  };

  // Render connection error alert if present
  const renderConnectionError = () => {
    if (!connectionError) return null;

    return (
      <div
        className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-lg p-4 relative"
        role="alert"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-red-600 dark:text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium">Connection Error</h3>
            <div className="mt-1 text-sm">
              {connectionError.message}
              {connectionError.details?.connectedToUserId && (
                <p className="mt-1">
                  This account is already connected to another user or
                  organization.
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-300 rounded-lg focus:ring-2 focus:ring-red-400 dark:focus:ring-red-700 p-1.5 hover:bg-red-200 dark:hover:bg-red-800 inline-flex items-center justify-center h-8 w-8"
            onClick={() => setConnectionError(null)}
          >
            <span className="sr-only">Dismiss</span>
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    );
  };

  // Render content based on current step
  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Connect Accounts
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Connect your social media accounts to start posting
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {platforms.map((platform) => {
                const connectedAccount = getConnectedAccountForPlatform(
                  platform.id
                );
                const isConnected = !!connectedAccount;

                return (
                  <div key={platform.id} className="col-span-1">
                    <div
                      className={`h-full flex flex-col rounded-lg shadow ${
                        isConnected ? "shadow-md" : ""
                      } overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${
                        isConnected ? `border-t-4` : ""
                      }`}
                      style={{
                        borderTopColor: isConnected
                          ? platform.color
                          : "transparent",
                      }}
                    >
                      <div className="flex-grow p-4">
                        <div className="flex items-center mb-2">
                          <platform.icon size={24} color={platform.color} />
                          <h3 className="text-lg font-medium ml-2 text-gray-900 dark:text-white">
                            {platform.name}
                          </h3>
                          {isConnected && (
                            <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                              Connected
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {platform.description}
                        </p>
                        {isConnected && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              Connected as:{" "}
                              <strong className="text-gray-900 dark:text-white">
                                {connectedAccount.displayName ||
                                  connectedAccount.username}
                              </strong>
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                        {isConnected ? (
                          <button
                            className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                            onClick={() =>
                              handleDisconnect(
                                connectedAccount.id,
                                platform.name
                              )
                            }
                          >
                            Disconnect
                          </button>
                        ) : (
                          <button
                            className={`text-sm font-medium px-3 py-1 rounded border ${
                              platform.disabled
                                ? "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                : `hover:bg-opacity-10`
                            }`}
                            onClick={() => handleConnect(platform.id)}
                            disabled={platform.disabled || loading}
                            style={{
                              borderColor: platform.disabled
                                ? undefined
                                : platform.color,
                              color: platform.disabled
                                ? undefined
                                : platform.color,
                            }}
                          >
                            {loading ? (
                              <svg
                                className="animate-spin h-5 w-5 text-current"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            ) : (
                              "Connect"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 1: // Verify Connections
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Verify Your Connected Accounts
            </h2>
            {accounts.length === 0 ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400 dark:text-yellow-300"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                      No accounts connected
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-200">
                      <p>
                        Please go back and connect at least one social media
                        account to continue.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="text-base mb-6 text-gray-700 dark:text-gray-300">
                  You've successfully connected the following accounts:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {accounts.map((account) => {
                    const platform = platforms.find(
                      (p) => p.id === account.platform.toLowerCase()
                    );
                    const PlatformIcon = platform?.icon || FaTwitter;

                    return (
                      <div key={account.id} className="col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center border border-gray-200 dark:border-gray-700">
                          <PlatformIcon size={24} color={platform?.color} />
                          <div className="ml-3">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {account.displayName || account.username}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {platform?.name || account.platform}
                            </p>
                          </div>
                          <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                            Verified
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        );

      case 2: // Start Posting
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Ready to Start Posting!
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                🎉 Congratulations!
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Your accounts are set up and ready to use. You can now start
                creating and scheduling posts across your social media
                platforms.
              </p>
              <a
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Account Setup
        </h1>

        {renderConnectionError()}

        <div className="mb-8">
          {isMobile ? (
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center border-2 ${
                      index < activeStep
                        ? "bg-blue-600 border-blue-600 text-white"
                        : index === activeStep
                        ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500"
                        : "border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {index < activeStep ? (
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <div className="ml-4 flex flex-col">
                    <span
                      className={`text-sm font-medium ${
                        index <= activeStep
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {step}
                    </span>
                    {index < steps.length - 1 && (
                      <div className="h-full w-0.5 bg-gray-300 dark:bg-gray-600 ml-5 mt-1"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center border-2 ${
                      index < activeStep
                        ? "bg-blue-600 border-blue-600 text-white"
                        : index === activeStep
                        ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500"
                        : "border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {index < activeStep ? (
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <span
                      className={`text-sm font-medium ${
                        index <= activeStep
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {/* {index < steps.length - 1 && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full">
                      <div
                        className={`h-0.5 ${
                          index < activeStep
                            ? "bg-blue-600 dark:bg-blue-500"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      ></div>
                    </div>
                  )} */}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6"></div>

        {loading && activeStep === 0 ? (
          <div className="flex justify-center items-center py-12">
            <svg
              className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : (
          renderStepContent()
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeStep === 0
                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
            }`}
            onClick={handleBackStep}
            disabled={activeStep === 0}
          >
            Back
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeStep === steps.length - 1 ||
              (activeStep === 0 && accounts.length === 0)
                ? "bg-blue-400 dark:bg-blue-800 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
            }`}
            onClick={handleNextStep}
            disabled={
              activeStep === steps.length - 1 ||
              (activeStep === 0 && accounts.length === 0)
            }
          >
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSetup;
