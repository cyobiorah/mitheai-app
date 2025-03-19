import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Autocomplete,
  Chip,
  SelectChangeEvent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
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

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title,
        description: content.description || "",
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
      const accounts = await getSocialAccounts();
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

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
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

  const handleMetadataChange =
    (field: keyof typeof formData.metadata) =>
    (_event: React.SyntheticEvent, newValue: string[]) => {
      setFormData((prev) => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [field]: newValue,
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
        savedContent = await updateContent(content.id, {
          ...formData,
          ...contentMetadata,
          updatedAt: new Date().toISOString(),
        });
      } else {
        savedContent = await createContent({
          ...formData,
          ...contentMetadata,
          status: "pending",
          createdBy: user.uid,
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
        contentToPost = await createContent({
          ...formData,
          ...contentMetadata,
          status: "pending",
          createdBy: user.uid,
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
      console.log("Posting to Twitter:", {
        accountId: selectedAccountId,
        content: contentToPost.content,
      });

      try {
        const result = await postContentToTwitter(
          selectedAccountId,
          contentToPost
        );
        console.log("Twitter post result:", result);

        // Update content with post status
        if (result && result.tweet) {
          await updateContentPostStatus(
            contentToPost.id,
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
            contentToPost.id,
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
            contentToPost.id,
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
            contentToPost.id,
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
            contentToPost.id,
            "twitter",
            null,
            "failed",
            postError.message || "Unknown error"
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
          createdBy: user.uid,
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

      // Track the manual posting attempt
      await trackManualPostAttempt(contentToPost.id, "twitter");

      // Create Twitter intent URL and open in new tab
      const twitterUrl = createTwitterIntentUrl(contentToPost.content);
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
        <Box display="flex" alignItems="center" justifyContent="center" py={2}>
          <CircularProgress size={24} />
          <Typography variant="body2" className="ml-2 dark:text-gray-300">
            Loading accounts...
          </Typography>
        </Box>
      );
    }

    if (socialAccounts.length === 0) {
      return (
        <Box py={2}>
          <Typography variant="body2" className="text-red-500">
            No social accounts connected. Please connect an account in settings.
          </Typography>
        </Box>
      );
    }

    return (
      <Box display="flex" flexWrap="wrap" gap={2} py={2}>
        {socialAccounts.map((account) => (
          <Box
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
            `}
            sx={{ 
              transition: 'all 0.2s ease-in-out',
              transform: selectedAccountId === account.id ? 'scale(1.05)' : 'scale(1)'
            }}
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
            <Typography
              variant="body2"
              className={`font-medium ${
                selectedAccountId === account.id
                  ? "text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              @{account.accountName}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: "dark:bg-gray-800",
      }}
    >
      <DialogTitle className="dark:text-white">
        {content ? "Edit Content" : "Create New Content"}
      </DialogTitle>
      <DialogContent>
        <Box component="form" noValidate className="space-y-4 mt-4">
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={handleTextChange}
            name="title"
            className="dark:text-white"
            InputLabelProps={{
              className: "dark:text-gray-300",
            }}
            InputProps={{
              className:
                "dark:text-white dark:bg-gray-700 dark:border-gray-600",
            }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleTextChange}
            name="description"
            className="dark:text-white"
            InputLabelProps={{
              className: "dark:text-gray-300",
            }}
            InputProps={{
              className:
                "dark:text-white dark:bg-gray-700 dark:border-gray-600",
            }}
          />
          <FormControl fullWidth>
            <InputLabel className="dark:text-gray-300">Type</InputLabel>
            <Select
              value={formData.type}
              onChange={handleSelectChange}
              name="type"
              className="dark:text-white dark:bg-gray-700"
            >
              <MenuItem
                value="article"
                className="dark:text-white dark:hover:bg-gray-600"
              >
                Article
              </MenuItem>
              <MenuItem
                value="social_post"
                className="dark:text-white dark:hover:bg-gray-600"
              >
                Social Post
              </MenuItem>
              <MenuItem
                value="video"
                className="dark:text-white dark:hover:bg-gray-600"
              >
                Video
              </MenuItem>
              <MenuItem
                value="image"
                className="dark:text-white dark:hover:bg-gray-600"
              >
                Image
              </MenuItem>
              <MenuItem
                value="document"
                className="dark:text-white dark:hover:bg-gray-600"
              >
                Document
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Content"
            multiline
            rows={6}
            value={formData.content}
            onChange={handleTextChange}
            name="content"
            className="dark:text-white"
            InputLabelProps={{
              className: "dark:text-gray-300",
            }}
            InputProps={{
              className:
                "dark:text-white dark:bg-gray-700 dark:border-gray-600",
            }}
          />
          <TextField
            fullWidth
            label="URL (optional)"
            value={formData.url}
            onChange={handleTextChange}
            name="url"
            className="dark:text-white"
            InputLabelProps={{
              className: "dark:text-gray-300",
            }}
            InputProps={{
              className:
                "dark:text-white dark:bg-gray-700 dark:border-gray-600",
            }}
          />
          <FormControl fullWidth>
            <InputLabel className="dark:text-gray-300">Language</InputLabel>
            <Select
              value={formData.metadata.language}
              onChange={handleSelectChange}
              name="metadata.language"
              className="dark:text-white dark:bg-gray-700"
            >
              <MenuItem
                value="en"
                className="dark:text-white dark:hover:bg-gray-600"
              >
                English
              </MenuItem>
              <MenuItem
                value="es"
                className="dark:text-white dark:hover:bg-gray-600"
              >
                Spanish
              </MenuItem>
              <MenuItem
                value="fr"
                className="dark:text-white dark:hover:bg-gray-600"
              >
                French
              </MenuItem>
            </Select>
          </FormControl>
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={formData.metadata.tags}
            onChange={handleMetadataChange("tags")}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  className="dark:bg-gray-700 dark:text-white"
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                className="dark:text-white"
                InputLabelProps={{
                  className: "dark:text-gray-300",
                }}
                InputProps={{
                  ...params.InputProps,
                  className:
                    "dark:text-white dark:bg-gray-700 dark:border-gray-600",
                }}
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions
        className="dark:bg-gray-800 dark:border-t dark:border-gray-700"
        sx={{
          display: "flex",
          flexDirection: formData.type === "social_post" ? "row" : "row",
          flexWrap: "wrap",
          padding: "16px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {formData.type === "social_post" && (
          <Box sx={{ marginRight: 2, maxWidth: "60%" }}>
            <Typography variant="subtitle2" className="mb-1 dark:text-gray-300">
              Post to Account
            </Typography>
            {renderSocialAccountBadges()}
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Button
            onClick={onClose}
            className="dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            className="dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            {content ? "Update" : "Create"}
          </Button>

          {/* Post buttons appear when content type is social_post */}
          {formData.type === "social_post" && (
            <>
              {/* Manual Post button - always available for social posts */}
              <Button
                variant="contained"
                color="info"
                onClick={handleManualPost}
                className="dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Manual Post
              </Button>

              {/* API Post button - only when account is selected */}
              {selectedAccountId && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handlePost}
                  disabled={isPosting}
                  startIcon={
                    isPosting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                  className="dark:bg-secondary-500 dark:hover:bg-secondary-600"
                >
                  {isPosting ? "Posting..." : "Post Now"}
                </Button>
              )}
            </>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}
