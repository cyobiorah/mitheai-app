import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaTwitter } from "react-icons/fa";
import { auth } from "../config/firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface SocialAccount {
  platform: string;
  accountName: string;
  status: string;
}

export const SocialMediaConnections: React.FC = () => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      // Check for OAuth callback success/error
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.get("success") === "true") {
        // Show success toast or notification
        console.log("Twitter account connected successfully!");
      } else if (searchParams.get("error") === "true") {
        // Show error toast or notification
        console.error("Failed to connect Twitter account");
      }

      // Fetch accounts (only once)
      await fetchAccounts();

      // Clear URL params after handling
      if (searchParams.has("success") || searchParams.has("error")) {
        navigate("/settings", { replace: true });
      }
    };

    fetchData();
  }, [location, navigate]);

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

  const handleTwitterConnect = async () => {
    try {
      // Get the current user's ID token
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        console.error("No authentication token available");
        return;
      }

      // First authenticate with our backend
      const response = await fetch(
        `${API_URL}/social-accounts/twitter/direct-auth`,
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

      // If authentication successful, follow the redirect URL from the response
      const authUrl = await response.text();
      console.log("Redirecting to:", authUrl); // Debug log
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error connecting to Twitter:", error);
    }
  };

  const handleDisconnect = async (platform: string) => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) {
        console.error("No authentication token available");
        return;
      }

      const response = await fetch(`${API_URL}/social-accounts/${platform}/disconnect`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to disconnect account");
      }

      // Refresh the accounts list
      fetchAccounts();
    } catch (error) {
      console.error(`Error disconnecting ${platform}:`, error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Twitter Connection */}
      <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-[#1DA1F2] rounded-lg flex items-center justify-center text-white">
            <FaTwitter size={24} />
          </div>
          <div className="ml-4">
            <h3 className="text-neutral-900 dark:text-white font-medium">
              Twitter
            </h3>
            {accounts.find((a) => a.platform === "twitter") ? (
              <p className="text-neutral-600 dark:text-gray-400 text-sm">
                Connected as @
                {accounts.find((a) => a.platform === "twitter")?.accountName}
              </p>
            ) : (
              <p className="text-neutral-600 dark:text-gray-400 text-sm">
                Not connected
              </p>
            )}
          </div>
        </div>
        {accounts.find((a) => a.platform === "twitter") ? (
          <button
            onClick={() => handleDisconnect("twitter")}
            className="px-4 py-2 bg-neutral-100 dark:bg-gray-600 text-neutral-900 dark:text-white rounded-lg hover:bg-error-600 hover:text-white dark:hover:bg-error-500 transition-colors"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={handleTwitterConnect}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
};
