import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaTwitter, FaFacebook } from "react-icons/fa";
import { auth } from "../config/firebase";
import { Alert, AlertTitle, Box, Collapse } from "@mui/material";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { Team } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface SocialAccount {
  platform: string;
  accountName: string;
  status: string;
  id: string; // Add this if not already present
  accountId: string;
  teamId?: string; // Add this for team assignment
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

interface TeamAssignmentProps {
  accountId: string;
  currentTeamId?: string;
  onAssign: (teamId: string) => Promise<void>;
}

const TeamAssignment: React.FC<TeamAssignmentProps> = ({
  accountId,
  currentTeamId,
  onAssign,
}) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch(
          `${API_URL}/teams/organization/${user?.organizationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="mt-2">
      <select
        className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700"
        value={currentTeamId || ""}
        onChange={(e) => onAssign(e.target.value)}
        disabled={loading}
      >
        <option value="">Select Team</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export const SocialMediaConnections: React.FC = () => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] =
    useState<ConnectionError | null>(null);
  const location = useLocation();
  const { user } = useAuth();

  console.log(useAuth());

  const handleTeamAssign = async (accountId: string, teamId: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(
        `${API_URL}/social-accounts/${accountId}/team`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            teamId,
            organizationId: user?.organizationId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to assign team");
      }

      // Refresh accounts list
      await fetchAccounts();
    } catch (error) {
      console.error("Error assigning team:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // Check for OAuth callback success/error
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.get("success") === "true") {
        // Show success toast or notification
        toast.success("Twitter account connected successfully!");
        // Clear URL params without causing a reload
        window.history.replaceState({}, "", "/settings");
      } else if (searchParams.get("error")) {
        // Handle specific error types
        const errorType: any = searchParams.get("error");
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
            code: errorType,
            message: "Failed to connect social account",
          });
        }

        // Clear URL params without causing a reload
        window.history.replaceState({}, "", "/settings");
      }

      // Fetch accounts (only once)
      await fetchAccounts();
    };

    fetchData();
  }, [location]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) {
        console.error("No ID token available");
        return;
      }

      const response = await fetch(`${API_URL}/social-accounts`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAccounts(Array.isArray(data) ? data : []); // Ensure accounts is always an array
    } catch (error) {
      console.error("Failed to fetch social accounts:", error);
      setAccounts([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleTwitterConnect = async (skipWelcome: boolean = false) => {
    try {
      setConnectionError(null);
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        console.error("No authentication token available");
        return;
      }

      const response = await fetch(
        `${API_URL}/social-accounts/twitter/direct-auth?skipWelcome=${skipWelcome}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to authenticate");
      }

      const authUrl = await response.text();
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error connecting to Twitter:", error);
    }
  };

  const handleFacebookConnect = async () => {
    try {
      setConnectionError(null);
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        console.error("No authentication token available");
        return;
      }

      const response = await fetch(
        `${API_URL}/social-accounts/facebook/direct-auth`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to authenticate");
      }

      const authUrl = await response.text();
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error connecting to Facebook:", error);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) {
        console.error("No authentication token available");
        return;
      }

      const response = await fetch(
        `${API_URL}/social-accounts/disconnect/${accountId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to disconnect account");
      }

      // Refresh the accounts list
      fetchAccounts();
    } catch (error) {
      console.error(`Error disconnecting account:`, error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Connection Error Alert */}
      <Collapse in={connectionError !== null}>
        <Box mb={2}>
          <Alert severity="error" onClose={() => setConnectionError(null)}>
            <AlertTitle>Connection Error</AlertTitle>
            {connectionError?.message}
            {(connectionError?.code === "account_already_connected" ||
              connectionError?.code === "duplicate_account") && (
              <p>
                This social account is already connected to another user in the
                system. Please use a different account or contact your
                administrator for assistance.
              </p>
            )}
          </Alert>
        </Box>
      </Collapse>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Twitter Connections */}
          {/* Show existing Twitter accounts */}
          {accounts
            .filter((account) => account.platform === "twitter")
            .map((account, index) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#1DA1F2] rounded-lg flex items-center justify-center text-white">
                    <FaTwitter size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-neutral-900 dark:text-white font-medium">
                      Twitter Account {index + 1}
                    </h3>
                    <p className="text-neutral-600 dark:text-gray-400 text-sm">
                      Connected as @{account.accountName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleDisconnect(account.accountId)}
                    className="px-4 py-2 bg-neutral-100 dark:bg-gray-600 text-neutral-900 dark:text-white rounded-lg hover:bg-error-600 hover:text-white dark:hover:bg-error-500 transition-colors"
                  >
                    Disconnect
                  </button>
                  {user?.organizationId && (
                    <TeamAssignment
                      accountId={account.id}
                      currentTeamId={account.teamId}
                      onAssign={(teamId) =>
                        handleTeamAssign(account.id, teamId)
                      }
                    />
                  )}
                </div>
              </div>
            ))}

          {/* Facebook Connections */}
          {/* Show existing Facebook accounts */}
          {accounts
            .filter((account) => account.platform === "facebook")
            .map((account, index) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#4267B2] rounded-lg flex items-center justify-center text-white">
                    <FaFacebook size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-neutral-900 dark:text-white font-medium">
                      Facebook Account {index + 1}
                    </h3>
                    <p className="text-neutral-600 dark:text-gray-400 text-sm">
                      Connected as {account.accountName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleDisconnect(account.accountId)}
                    className="px-4 py-2 bg-neutral-100 dark:bg-gray-600 text-neutral-900 dark:text-white rounded-lg hover:bg-error-600 hover:text-white dark:hover:bg-error-500 transition-colors"
                  >
                    Disconnect
                  </button>
                  {user?.organizationId && (
                    <TeamAssignment
                      accountId={account.id}
                      currentTeamId={account.teamId}
                      onAssign={(teamId) =>
                        handleTeamAssign(account.id, teamId)
                      }
                    />
                  )}
                </div>
              </div>
            ))}

          {/* Add Another Account Button */}
          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-[#1DA1F2] rounded-lg flex items-center justify-center text-white">
                <FaTwitter size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-neutral-900 dark:text-white font-medium">
                  Add Another Twitter Account
                </h3>
                <p className="text-neutral-600 dark:text-gray-400 text-sm">
                  Connect an additional Twitter account
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleTwitterConnect(false)}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                Connect with Welcome Tweet
              </button>
              <button
                onClick={() => handleTwitterConnect(true)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg transition-colors"
              >
                Connect Silently
              </button>
            </div>
          </div>

          {/* Add Facebook Account Button */}
          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-[#4267B2] rounded-lg flex items-center justify-center text-white">
                <FaFacebook size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-neutral-900 dark:text-white font-medium">
                  Add Facebook Account
                </h3>
                <p className="text-neutral-600 dark:text-gray-400 text-sm">
                  Connect your Facebook account
                </p>
              </div>
            </div>
            <div>
              <button
                onClick={() => handleFacebookConnect()}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                Connect Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
