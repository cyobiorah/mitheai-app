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
import socialApi from "../../api/socialApi";
import RenderConnectionError from "./RenderConnectionError";
import { SocialAccount } from "../../api/social";
import RenderStepContent from "./RenderStepContent";
import IsMobileView from "./IsMobileView";
import { useAuth } from "../../store/hooks";
import teamApi from "../../api/teamApi";

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
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount | null>(
    null
  );

  const { teams, user } = useAuth();

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
    // console.log({ accountId, platformName });
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

  const getConnectedAccountsForPlatform = (platformId: string) => {
    return accounts.filter(
      (account) => account.platform.toLowerCase() === platformId
    );
  };

  const getActiveStep = (index: number) => {
    if (index < activeStep) {
      return "bg-blue-600 border-blue-600 text-white";
    } else if (index === activeStep) {
      return "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500";
    } else {
      return "border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400";
    }
  };

  const handleAssignTeam = async (accountId: string, teamId: string) => {
    // console.log({ accountId, teamId });
    setShowModal(false);
    try {
      setLoading(true);
      await teamApi.assignTeam(
        accountId,
        teamId,
        user?.organizationId as string
      );
      toast.success("Team assigned successfully");
      fetchAccounts();
    } catch (error) {
      console.error("Failed to assign team:", error);
      toast.error("Failed to assign team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Account Setup
        </h1>

        <RenderConnectionError
          connectionError={connectionError}
          setConnectionError={setConnectionError}
        />

        <div className="mb-8">
          {isMobile ? (
            <IsMobileView
              steps={steps}
              activeStep={activeStep}
              getActiveStep={getActiveStep}
            />
          ) : (
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center border-2 ${getActiveStep(
                      index
                    )}`}
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
          <RenderStepContent
            activeStep={activeStep}
            getConnectedAccountsForPlatform={getConnectedAccountsForPlatform}
            handleConnect={handleConnect}
            handleDisconnect={handleDisconnect}
            loading={loading}
            accounts={accounts}
            setShowModal={setShowModal}
            showModal={showModal}
            teams={teams}
            selectedAccount={selectedAccount}
            setSelectedAccount={setSelectedAccount}
            handleAssignTeam={(accountId: string, teamId: string) =>
              handleAssignTeam(accountId, teamId)
            }
          />
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
