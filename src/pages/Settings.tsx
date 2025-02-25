import React from "react";
import { SocialMediaConnections } from "../components/SocialMediaConnections";

const Settings: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
        Profile & Settings
      </h1>

      {/* User Profile Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
          User Profile
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-neutral-900 dark:text-white mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent placeholder-neutral-400 dark:placeholder-gray-400"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-neutral-900 dark:text-white mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent placeholder-neutral-400 dark:placeholder-gray-400"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-neutral-900 dark:text-white mb-2">
              Role
            </label>
            <select className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent">
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Integrations Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
          Integrations
        </h2>
        <div className="space-y-4">
          {/* Social Media Connections */}
          {/* <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#1DA1F2] rounded-lg flex items-center justify-center text-white">
                  Tw
                </div>
                <div className="ml-4">
                  <h3 className="text-neutral-900 dark:text-white font-medium">Twitter</h3>
                  <p className="text-neutral-600 dark:text-gray-400 text-sm">Connected as @username</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-neutral-100 dark:bg-gray-600 text-neutral-900 dark:text-white rounded-lg hover:bg-error-600 hover:text-white dark:hover:bg-error-500 transition-colors">
                Disconnect
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#4267B2] rounded-lg flex items-center justify-center text-white">
                  Fb
                </div>
                <div className="ml-4">
                  <h3 className="text-neutral-900 dark:text-white font-medium">Facebook</h3>
                  <p className="text-neutral-600 dark:text-gray-400 text-sm">Not connected</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors">
                Connect
              </button>
            </div>
          </div> */}

          <SocialMediaConnections />

          {/* Email Notifications */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-3">
              Email Notifications
            </h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox text-primary-600 dark:text-primary-400 h-5 w-5 rounded dark:bg-gray-700 dark:border-gray-600 focus:ring-primary-500 dark:focus:ring-primary-400"
                />
                <span className="ml-2 text-neutral-900 dark:text-white">
                  Content approvals
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox text-primary-600 dark:text-primary-400 h-5 w-5 rounded dark:bg-gray-700 dark:border-gray-600 focus:ring-primary-500 dark:focus:ring-primary-400"
                />
                <span className="ml-2 text-neutral-900 dark:text-white">
                  Team mentions
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox text-primary-600 dark:text-primary-400 h-5 w-5 rounded dark:bg-gray-700 dark:border-gray-600 focus:ring-primary-500 dark:focus:ring-primary-400"
                />
                <span className="ml-2 text-neutral-900 dark:text-white">
                  Analytics reports
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Team Management Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
          Team Management
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg text-neutral-900 dark:text-white">
              Team Members
            </h3>
            <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors">
              Add Member
            </button>
          </div>

          <div className="space-y-3">
            {/* Team Member Row */}
            <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent-600 dark:bg-accent-500 rounded-full flex items-center justify-center text-white">
                  JD
                </div>
                <div className="ml-4">
                  <h4 className="text-neutral-900 dark:text-white font-medium">
                    Jane Doe
                  </h4>
                  <p className="text-neutral-600 dark:text-gray-400 text-sm">
                    Editor
                  </p>
                </div>
              </div>
              <button className="text-error-600 dark:text-error-400 hover:text-error-700 dark:hover:text-error-300 transition-colors">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
          API Keys
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg text-neutral-900 dark:text-white">
                Active API Keys
              </h3>
              <p className="text-neutral-600 dark:text-gray-400 text-sm">
                Manage your API keys for external integrations
              </p>
            </div>
            <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors">
              Generate New Key
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-neutral-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-neutral-900 dark:text-white font-medium">
                    Production Key
                  </h4>
                  <p className="text-neutral-600 dark:text-gray-400 text-sm mt-1">
                    Created on Jan 1, 2024
                  </p>
                </div>
                <button className="text-error-600 dark:text-error-400 hover:text-error-700 dark:hover:text-error-300 transition-colors">
                  Revoke
                </button>
              </div>
              <div className="mt-3">
                <code className="px-3 py-1 bg-white dark:bg-gray-800 rounded border border-neutral-200 dark:border-gray-600 text-neutral-900 dark:text-white">
                  ••••••••••••••••
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Changes Button */}
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
