import React, { useEffect, useState } from "react";
import { useAuth } from "../../store/hooks";
import { createContent, updateContent } from "../../api/content";
import { ContentItem } from "../../types";
import {
  getSocialAccounts,
  postContentToTwitter,
  updateContentPostStatus,
  SocialAccount,
  createTwitterIntentUrl,
  trackManualPostAttempt,
} from "../../api/social";
import { toast } from "react-hot-toast";
import { FaTwitter } from "react-icons/fa";
import socialApi from "../../api/socialApi";

interface ContentDialogProps {
  open: boolean;
  onClose: () => void;
  content: ContentItem | null;
  onSave: () => void;
}

interface FormData {
  title: string;
  description: string;
  type: "article" | "social_post" | "video" | "image" | "document";
  content: string;
  url?: string;
  metadata: {
    source: string;
    language: string;
    tags: string[];
    customFields: Record<string, any>;
  };
  analysis: {
    sentiment?: number;
    keywords?: string[];
    categories?: string[];
    entities?: Array<{
      name: string;
      type: string;
      sentiment?: number;
    }>;
    customAnalytics?: Record<string, any>;
  };
}

export default function ContentDialog({
  open,
  onClose,
  content,
  onSave,
}: ContentDialogProps) {
  const { teams, user } = useAuth();
  const currentTeam = teams[0];

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    type: "article",
    content: "",
    url: "",
    metadata: {
      source: "",
      language: "en",
      tags: [],
      customFields: {},
    },
    analysis: {
      sentiment: undefined,
      keywords: [],
      categories: [],
      entities: [],
      customAnalytics: {},
    },
  });

  // New state for social accounts and posting
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [isLoadingAccounts, setIsLoadingAccounts] = useState<boolean>(false);
  const [isPosting, setIsPosting] = useState<boolean>(false);

  // State for tag input
  const [tagInput, setTagInput] = useState<string>("");

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title,
        description: content.description ?? "",
        type: content.type,
        content: content.content,
        url: content.url,
        metadata: {
          source: content.metadata.source,
          language: content.metadata.language,
          tags: content.metadata.tags,
          customFields: content.metadata.customFields,
        },
        analysis: {
          sentiment: content.analysis.sentiment,
          keywords: content.analysis.keywords || [],
          categories: content.analysis.categories || [],
          entities: content.analysis.entities || [],
          customAnalytics: content.analysis.customAnalytics || {},
        },
      });
    }
  }, [content]);

  // Fetch social accounts when dialog opens and content type is social_post
  useEffect(() => {
    if (open && formData.type === "social_post") {
      fetchSocialAccounts();
    }
  }, [open, formData.type]);

  const fetchSocialAccounts = async () => {
    try {
      setIsLoadingAccounts(true);
      const accounts = await socialApi.getAccounts();
      setSocialAccounts(accounts);
      setIsLoadingAccounts(false);
    } catch (error) {
      console.error("Error fetching social accounts:", error);
      setIsLoadingAccounts(false);
      toast.error("Failed to load social accounts");
    }
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    // If changing to/from social_post type, reset selected account
    if (
      name === "type" &&
      ((value === "social_post" && formData.type !== "social_post") ||
        (value !== "social_post" && formData.type === "social_post"))
    ) {
      setSelectedAccountId("");

      if (value === "social_post") {
        // Fetch social accounts when switching to social post type
        fetchSocialAccounts();
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialAccountSelect = (accountId: string) => {
    setSelectedAccountId((prevId) => (prevId === accountId ? "" : accountId));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.metadata.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          metadata: {
            ...prev.metadata,
            tags: [...prev.metadata.tags, tagInput.trim()],
          },
        }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        tags: prev.metadata.tags.filter((tag) => tag !== tagToRemove),
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Handle both individual and organization account types
      const isOrgUser = user.userType === "organization";
      const contentMetadata = {
        ...(isOrgUser && currentTeam
          ? {
              teamId: currentTeam.id,
              organizationId: currentTeam.organizationId,
            }
          : {
              // For individual users, don't set team or org IDs
              teamId: undefined,
              organizationId: undefined,
            }),
      };

      let savedContent;

      if (content) {
        savedContent = await updateContent(content._id, {
          ...formData,
          ...contentMetadata,
          updatedAt: new Date().toISOString(),
        });
      } else {
        savedContent = await createContent({
          ...formData,
          ...contentMetadata,
          status: "pending",
          createdBy: user._id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("Failed to save content");
    }
  };

  const handlePost = async () => {
    if (!selectedAccountId || !user) {
      toast.error("Missing required information for posting");
      return;
    }

    try {
      setIsPosting(true);

      // Save the content first if it's new
      let contentToPost = content;

      // Handle both individual and organization account types
      const isOrgUser = user.userType === "organization";
      const contentMetadata = {
        ...(isOrgUser && currentTeam
          ? {
              teamId: currentTeam._id,
              organizationId: currentTeam.organizationId,
            }
          : {
              // For individual users, don't set team or org IDs
              teamId: undefined,
              organizationId: undefined,
            }),
      };

      if (!contentToPost) {
        contentToPost = await createContent({
          ...formData,
          ...contentMetadata,
          status: "pending",
          createdBy: user._id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else if (
        contentToPost &&
        (contentToPost.title !== formData.title ||
          contentToPost.content !== formData.content ||
          contentToPost.description !== formData.description)
      ) {
        // Update content if it has changed
        contentToPost = await updateContent(contentToPost.id, {
          ...formData,
          ...contentMetadata,
          updatedAt: new Date().toISOString(),
        });
      }

      // Post to Twitter

      try {
        const result = await postContentToTwitter(
          selectedAccountId,
          contentToPost
        );

        // Update content with post status
        if (result && result.tweet) {
          await updateContentPostStatus(
            contentToPost?._id,
            "twitter",
            result.tweet.id,
            "posted"
          );

          setIsPosting(false);
          toast.success("Content posted to Twitter successfully!");
          onSave();
          onClose();
        } else {
          throw new Error("Invalid response from Twitter API");
        }
      } catch (postError: any) {
        console.error("Error posting to Twitter:", postError);

        // Handle authentication errors specially
        if (
          postError.message.includes("authentication expired") ||
          postError.message.includes("reconnect your account")
        ) {
          // Set content status to failed
          await updateContentPostStatus(
            contentToPost?._id,
            "twitter",
            null,
            "failed",
            "Authentication expired"
          );

          // Show a more helpful error to the user
          toast.error(
            <div>
              <p>Twitter authentication has expired.</p>
              <p>Please reconnect your account in the settings page.</p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-2"
                onClick={() => (window.location.href = "/settings")}
              >
                Go to Settings
              </button>
            </div>,
            { duration: 8000 }
          );
        }
        // Handle permission errors specially
        else if (
          postError.message.includes("doesn't have permission") ||
          postError.message.includes("Developer Portal")
        ) {
          await updateContentPostStatus(
            contentToPost?._id,
            "twitter",
            null,
            "failed",
            "Twitter permission denied"
          );

          toast.error(
            <div>
              <p>Twitter API permission error:</p>
              <p>{postError.message}</p>
              <p className="text-sm mt-2">This typically means:</p>
              <ul className="list-disc ml-5 text-sm">
                <li>Your Twitter app doesn't have elevated access</li>
                <li>Your app is missing the 'tweet.write' scope</li>
                <li>Your Twitter account may be restricted</li>
              </ul>
              <div className="mt-3">
                <a
                  href="https://developer.twitter.com/en/portal/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                >
                  Twitter Developer Portal
                </a>
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() => (window.location.href = "/settings")}
                >
                  Go to Settings
                </button>
              </div>
            </div>,
            { duration: 12000 }
          );
        }
        // For duplicate content errors
        else if (postError.message.includes("duplicate content")) {
          await updateContentPostStatus(
            contentToPost?._id,
            "twitter",
            null,
            "failed",
            "Duplicate content"
          );

          toast.error(
            <div>
              <p>Twitter rejected your post:</p>
              <p>{postError.message}</p>
              <p className="text-sm mt-2">
                Try posting with different content.
              </p>
            </div>,
            { duration: 5000 }
          );
        } else {
          // For other errors, show the error message and set status to failed
          await updateContentPostStatus(
            contentToPost?._id,
            "twitter",
            null,
            "failed",
            postError.message ?? "Unknown error"
          );

          toast.error(
            `Failed to post to Twitter: ${postError.message || "Unknown error"}`
          );
        }

        setIsPosting(false);
      }
    } catch (error) {
      console.error("Error preparing content for posting:", error);
      setIsPosting(false);
      toast.error(
        "Failed to prepare content for posting: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  const handleManualPost = async () => {
    if (!user) {
      toast.error("You must be logged in to post");
      return;
    }

    try {
      // Save the content first if it's new or has changes
      let contentToPost = content;

      // Handle both individual and organization account types
      const isOrgUser = user.userType === "organization";
      const contentMetadata = {
        ...(isOrgUser && currentTeam
          ? {
              teamId: currentTeam.id,
              organizationId: currentTeam.organizationId,
            }
          : {
              // For individual users, don't set team or org IDs
              teamId: undefined,
              organizationId: undefined,
            }),
      };

      if (!contentToPost) {
        // Create new content
        contentToPost = await createContent({
          ...formData,
          ...contentMetadata,
          status: "pending",
          createdBy: user._id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else if (
        contentToPost &&
        (contentToPost.title !== formData.title ||
          contentToPost.content !== formData.content ||
          contentToPost.description !== formData.description)
      ) {
        // Update content if it has changed
        contentToPost = await updateContent(contentToPost._id, {
          ...formData,
          ...contentMetadata,
          updatedAt: new Date().toISOString(),
        });
      }

      // Track the manual posting attempt
      await trackManualPostAttempt(contentToPost?._id, "twitter");

      // Create Twitter intent URL and open in new tab
      const twitterUrl = createTwitterIntentUrl(contentToPost?.content);
      window.open(twitterUrl, "_blank");

      toast.success(
        <div>
          <p>Twitter compose window opened in a new tab.</p>
          <p className="text-sm">Please review and submit your tweet there.</p>
        </div>,
        { duration: 5000 }
      );

      // Close the dialog after a short delay
      setTimeout(() => {
        onSave();
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error preparing content for manual posting:", error);
      toast.error(
        "Failed to prepare content for manual posting: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  // Function to render social account badges
  const renderSocialAccountBadges = () => {
    if (isLoadingAccounts) {
      return (
        <div className="flex items-center justify-center py-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <p className="ml-2 text-sm dark:text-gray-300">Loading accounts...</p>
        </div>
      );
    }

    if (socialAccounts.length === 0) {
      return (
        <div className="py-2">
          <p className="text-sm text-red-500">
            No social accounts connected. Please connect an account in settings.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-2 py-2">
        {socialAccounts.map((account) => (
          <div
            key={account.id}
            onClick={() => handleSocialAccountSelect(account.id)}
            className={`
              flex items-center px-4 py-2 rounded-full cursor-pointer border-2 transition-all
              ${
                selectedAccountId === account.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md"
                  : "border-gray-300 bg-gray-50 dark:bg-gray-700"
              }
              hover:shadow-lg hover:opacity-100 dark:border-gray-600
              transform transition-transform duration-200 ease-in-out
              ${selectedAccountId === account.id ? "scale-105" : "scale-100"}
            `}
          >
            {account.platform === "twitter" && (
              <FaTwitter
                className={`text-xl mr-2 ${
                  selectedAccountId === account.id
                    ? "text-blue-500"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              />
            )}
            <p
              className={`text-sm font-medium ${
                selectedAccountId === account.id
                  ? "text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              @{account.accountName}
            </p>
          </div>
        ))}
      </div>
    );
  };

  // If dialog is not open, don't render anything
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              {content ? "Edit Content" : "Create New Content"}
            </h3>
          </div>

          {/* Content */}
          <div className="px-6 py-4 overflow-visible">
            <form className="space-y-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleTextChange}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleTextChange}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>

              {/* Type */}
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleSelectChange}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                >
                  <option
                    value="article"
                    className="dark:text-white dark:bg-gray-700"
                  >
                    Article
                  </option>
                  <option
                    value="social_post"
                    className="dark:text-white dark:bg-gray-700"
                  >
                    Social Post
                  </option>
                  <option
                    value="video"
                    className="dark:text-white dark:bg-gray-700"
                  >
                    Video
                  </option>
                  <option
                    value="image"
                    className="dark:text-white dark:bg-gray-700"
                  >
                    Image
                  </option>
                  <option
                    value="document"
                    className="dark:text-white dark:bg-gray-700"
                  >
                    Document
                  </option>
                </select>
              </div>

              {/* Content */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={6}
                  value={formData.content}
                  onChange={handleTextChange}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>

              {/* URL */}
              <div>
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  URL (optional)
                </label>
                <input
                  type="text"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleTextChange}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>

              {/* Language */}
              <div>
                <label
                  htmlFor="metadata.language"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Language
                </label>
                <select
                  id="metadata.language"
                  name="metadata.language"
                  value={formData.metadata.language}
                  onChange={handleSelectChange}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                >
                  <option
                    value="en"
                    className="dark:text-white dark:bg-gray-700"
                  >
                    English
                  </option>
                  <option
                    value="es"
                    className="dark:text-white dark:bg-gray-700"
                  >
                    Spanish
                  </option>
                  <option
                    value="fr"
                    className="dark:text-white dark:bg-gray-700"
                  >
                    French
                  </option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Tags
                </label>
                <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md dark:border-gray-600">
                  {formData.metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
                      >
                        <span className="sr-only">Remove tag</span>
                        &times;
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Add tag and press Enter"
                    className="flex-grow min-w-[120px] border-0 p-0 focus:ring-0 text-sm dark:bg-transparent dark:text-white"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between">
            {formData.type === "social_post" && (
              <div className="mr-2 max-w-[60%]">
                <h4 className="text-sm font-medium mb-1 dark:text-gray-300">
                  Post to Account
                </h4>
                {renderSocialAccountBadges()}
              </div>
            )}

            <div className="flex flex-wrap gap-2 items-center">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancel
              </button>

              <button
                type="submit"
                onClick={handleSubmit}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {content ? "Update" : "Create"}
              </button>

              {/* Post buttons appear when content type is social_post */}
              {formData.type === "social_post" && (
                <>
                  {/* Manual Post button - always available for social posts */}
                  <button
                    type="button"
                    onClick={handleManualPost}
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-cyan-600 border border-transparent rounded-md shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    Manual Post
                  </button>

                  {/* API Post button - only when account is selected */}
                  {selectedAccountId && (
                    <button
                      type="button"
                      onClick={handlePost}
                      disabled={isPosting}
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:bg-purple-500 dark:hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPosting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          Posting...
                        </>
                      ) : (
                        "Post Now"
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
