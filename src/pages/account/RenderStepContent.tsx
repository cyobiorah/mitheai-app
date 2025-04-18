import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaTiktok,
  FaPinterest,
} from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";
import { SiBluesky } from "react-icons/si";
import { SocialAccount } from "../../api/social";
import socialApi from "../../api/socialApi";
import AssignTeamModal from "./AssignTeamModal";
import { Team } from "../../types";

const RenderStepContent = ({
  activeStep,
  getConnectedAccountsForPlatform,
  handleConnect,
  handleDisconnect,
  loading,
  accounts,
  setShowModal,
  showModal,
  teams,
  selectedAccount,
  setSelectedAccount,
  handleAssignTeam,
}: {
  activeStep: number;
  getConnectedAccountsForPlatform: (platformId: string) => SocialAccount[];
  handleConnect: (platformId: string) => void;
  handleDisconnect: (accountId: string, platformName: string) => void;
  loading: boolean;
  accounts: SocialAccount[];
  setShowModal: (value: boolean) => void;
  showModal: boolean;
  teams: Team[];
  selectedAccount: SocialAccount | null;
  setSelectedAccount: (account: SocialAccount | null) => void;
  handleAssignTeam: (accountId: string, teamId: string) => void;
}) => {
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

  switch (activeStep) {
    case 0: // Connect Accounts
      return (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Connect your social media accounts to start posting
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => {
              const connectedAccounts = getConnectedAccountsForPlatform(
                platform.id
              );
              const isConnected = !!connectedAccounts.length;
              const hasMultipleAccounts = connectedAccounts.length > 0;

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

                      {/* Display all connected accounts */}
                      {hasMultipleAccounts && (
                        <div className="mt-3 space-y-2">
                          {connectedAccounts.map((account) => (
                            <div
                              key={account._id}
                              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
                            >
                              <div className="flex items-center">
                                <platform.icon
                                  size={16}
                                  color={platform.color}
                                  className="mr-2"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {account.displayName ||
                                    account.username ||
                                    account.accountName}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {!account.teamId && (
                                  <button
                                    onClick={() => {
                                      setShowModal(true);
                                      setSelectedAccount(account);
                                    }}
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                  >
                                    Assign Team
                                  </button>
                                )}
                                {account.teamId && (
                                  <button
                                    onClick={() => {
                                      setShowModal(true);
                                      setSelectedAccount(account);
                                    }}
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                  >
                                    Reassign Team
                                  </button>
                                )}
                                <button
                                  onClick={() =>
                                    handleDisconnect(account._id.toString(), platform.name)
                                  }
                                  className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                >
                                  Disconnect
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between">
                      {isConnected ? (
                        <div className="flex items-center space-x-2">
                          {/* Always show Connect button for platforms that support multiple accounts */}
                          <button
                            className={`text-sm font-medium px-3 py-1 rounded border ${
                              platform.disabled || loading
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
                              "Connect Another"
                            )}
                          </button>
                        </div>
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

                      {/* Show team assignment buttons only for single account display */}
                      {isConnected &&
                        !hasMultipleAccounts &&
                        !connectedAccounts[0]?.teamId && (
                          <button
                            onClick={() => {
                              setShowModal(true);
                              setSelectedAccount(connectedAccounts[0]);
                            }}
                            className="text-sm text-green-600 dark:text-green-400 font-medium px-3 py-1 rounded dark:border-gray-600 hover:bg-opacity-10"
                          >
                            Assign Team
                          </button>
                        )}
                      {isConnected &&
                        !hasMultipleAccounts &&
                        connectedAccounts[0]?.teamId && (
                          <button
                            onClick={() => {
                              setShowModal(true);
                              setSelectedAccount(connectedAccounts[0]);
                            }}
                            className="text-sm text-green-600 dark:text-green-400 font-medium px-3 py-1 rounded dark:border-gray-600 hover:bg-opacity-10"
                          >
                            Reassign Team
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {showModal && (
            <AssignTeamModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              onConfirm={(accountId: string, teamId: string) =>
                handleAssignTeam(accountId, teamId)
              }
              teams={teams.map((team) => ({ id: team._id, name: team.name }))}
              selectedAccount={selectedAccount}
            />
          )}
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
                    <div key={account._id} className="col-span-1">
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center border border-gray-200 dark:border-gray-700">
                        <PlatformIcon size={24} color={platform?.color} />
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {account.displayName ?? account.username}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {platform?.name ?? account.platform}
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
              creating and scheduling posts across your social media platforms.
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

export default RenderStepContent;
