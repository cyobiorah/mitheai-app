import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { toast } from "../../../hooks/use-toast";
import { Loader2, Save, Clock, Send } from "lucide-react";
import AccountSelection from "./AccountSelection";
import PlatformCaptions from "./PlatformCaption";
import MediaUpload from "./MediaUpload";
import SchedulingOptions from "./SchedulingOptions";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../store/hooks";
import {
  handleAccountSelection,
  handleCaptionChange,
  handleMediaChange,
  handleSchedulingChange,
} from "./methods";
import { MediaItem } from "./mediaUploadComponents";
import socialApi from "../../../api/socialApi";
import { getImageDimensions } from "../../posting/methods";

export default function PostFlow() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("accounts");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Post data state
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [globalCaption, setGlobalCaption] = useState("");
  const [platformCaptions, setPlatformCaptions] = useState<
    Record<string, string>
  >({});
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);

  // Get social accounts
  const { data: socialAccounts = [], isLoading: isFetchingAccounts } = useQuery(
    {
      queryKey: [`/social-accounts/${user?._id}`],
    }
  ) as { data: any[]; isLoading: boolean };

  const isLoading = isFetchingAccounts;

  // Check if we can proceed to the next step
  const canProceedToCaption = selectedAccounts.length > 0;
  const canProceedToMedia =
    canProceedToCaption && globalCaption.trim().length > 0;

  const tabItems = [
    {
      value: "accounts",
      label: "Accounts",
      disabled: false,
    },
    {
      value: "caption",
      label: "Caption",
      disabled: isSubmitting || !canProceedToCaption,
    },
    {
      value: "media",
      label: "Media",
      disabled: isSubmitting || !canProceedToMedia,
    },
    {
      value: "schedule",
      label: "Schedule",
      disabled: isSubmitting || !canProceedToMedia,
    },
  ];

  // Submit the post
  const handleSubmit = async () => {
    if (selectedAccounts.length === 0) {
      toast({
        title: "Error",
        description: "Select at least one account to post to",
        variant: "destructive",
      });
      return;
    }

    if (globalCaption.trim().length === 0) {
      toast({
        title: "Error",
        description: "Caption cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Generate platformData with selected accounts and platform-specific captions
    const platformData: Array<{
      platform: string;
      accounts: string[];
      caption: string;
    }> = [];

    // Get unique platforms from selected accounts
    const selectedAccountsData = socialAccounts.filter((account) =>
      selectedAccounts.includes(account._id)
    );
    const platforms = Array.from(
      new Set(selectedAccountsData.map((account) => account.platform))
    );

    // For each platform, add the selected accounts and captions
    platforms.forEach((platform) => {
      const platformAccountIds = selectedAccountsData
        .filter((account) => account.platform === platform)
        .map((account) => account._id);

      platformData.push({
        platform,
        accounts: platformAccountIds,
        caption: platformCaptions[platform] || globalCaption,
      });
    });

    // Type of post
    const mediaTypes = Array.from(new Set(media.map((item) => item.type)));

    let postType: "image" | "video" | "text" | "mixed";

    if (media.length === 0) {
      postType = "text";
    } else if (mediaTypes.length === 1) {
      postType = mediaTypes[0]; // 'image' or 'video'
    } else {
      postType = "mixed"; // handle this case if needed
    }

    if (postType === "mixed") {
      toast({
        title: "Unsupported media combination",
        description: "Please upload only images or only videos, not both.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Prepare media URLs (In a real app, these would be uploaded to a server)
    const mediaUrls = media.map((item) => item.url);

    try {
      // Simulate posting delay with success messages
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast({
        title: "Processing",
        description: "Preparing your content...",
      });

      if (media.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast({
          title: "Processing",
          description: "Warming up your hashtags...",
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (isScheduled && scheduledDate) {
        toast({
          title: "Processing",
          description: "Skedlii is lining up your post...",
        });
      } else {
        toast({
          title: "Processing",
          description: "Queueing your awesomeness...",
        });
      }

      if (isScheduled) {
        for (const { platform, accounts, caption } of platformData) {
          const platformAccounts = selectedAccountsData.filter(
            (acc) => acc.platform === platform && accounts.includes(acc._id)
          );

          for (const account of platformAccounts) {
            const postData = {
              content: caption,
              platforms: [
                {
                  platform,
                  accountId: account.accountId,
                  accountName: account.accountName,
                  accountType: account.accountType,
                },
              ],
              media: mediaUrls,
              scheduledFor: new Date(scheduledDate as Date),
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              mediaType: postType,
            };

            const formData = await handleFormData(postData, media);

            try {
              await socialApi.schedulePost(formData);
            } catch (error) {
              console.error("Failed to schedule post:", error);
            }
          }
        }
      } else {
        for (const { platform, accounts, caption } of platformData) {
          const platformAccounts = selectedAccountsData.filter(
            (acc) => acc.platform === platform && accounts.includes(acc._id)
          );

          for (const account of platformAccounts) {
            const postData = {
              caption,
              accountId: account.accountId,
              platformAccountId: account.platformAccountId,
              media: mediaUrls,
              accountName: account.accountName,
              accountType: account.accountType,
              platform: platform,
              platformId: account.platformId,
              mediaType: postType,
            };

            const formData = await handleFormData(postData, media);

            await socialApi.postToMultiPlatform(formData);
          }
        }
      }

      toast({
        title: "Success",
        description: isScheduled
          ? "Your post has been scheduled!"
          : "Your post has been published!",
      });

      // Navigate to dashboard
      navigate(`/dashboard/${isScheduled ? "schedule" : "posts"}`);
    } catch (error) {
      console.error("Failed to create post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormData = async (postData: any, media: any) => {
    const formData = new FormData();
    formData.append("postData", JSON.stringify(postData));

    for (const item of media) {
      const dimensions = await getImageDimensions(item.file);
      formData.append("media", item.file, item.id);
      formData.append(
        "dimensions[]",
        JSON.stringify({
          id: item.id,
          width: dimensions.width,
          height: dimensions.height,
        })
      );
    }

    return formData;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create Post</h1>
          <p className="text-muted-foreground">
            Compose and schedule your content across multiple platforms
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <Tabs
            defaultValue={activeTab}
            value={activeTab}
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList className="w-full mb-8">
              {tabItems.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  disabled={item.disabled}
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="accounts" className="space-y-6">
              <AccountSelection
                accounts={socialAccounts}
                selectedAccounts={selectedAccounts}
                onSelectionChange={(accountIds) =>
                  handleAccountSelection(accountIds, setSelectedAccounts)
                }
              />

              <div className="flex justify-end space-x-3">
                <Button
                  onClick={() => setActiveTab("caption")}
                  disabled={!canProceedToCaption}
                >
                  Continue to Caption
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="caption" className="space-y-6">
              <PlatformCaptions
                accounts={socialAccounts}
                selectedAccounts={selectedAccounts}
                globalCaption={globalCaption}
                platformCaptions={platformCaptions}
                onPlatformCaptionChange={(platform, caption) =>
                  handleCaptionChange(
                    platform,
                    caption,
                    setGlobalCaption,
                    setPlatformCaptions,
                    platformCaptions
                  )
                }
              />

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("accounts")}
                >
                  Back to Accounts
                </Button>
                <Button
                  onClick={() => setActiveTab("media")}
                  disabled={!canProceedToMedia}
                >
                  Continue to Media
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <MediaUpload
                media={media}
                onChange={(mediaItems: any) =>
                  handleMediaChange(mediaItems, setMedia)
                }
                accounts={socialAccounts}
                selectedAccounts={selectedAccounts}
              />

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("caption")}
                >
                  Back to Caption
                </Button>
                <Button onClick={() => setActiveTab("schedule")}>
                  Continue to Schedule
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <SchedulingOptions
                isScheduled={isScheduled}
                scheduledDate={scheduledDate}
                onSchedulingChange={(scheduled, date) =>
                  handleSchedulingChange(
                    scheduled,
                    date,
                    setIsScheduled,
                    setScheduledDate
                  )
                }
              />

              {/* Post preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Post Preview</CardTitle>
                  <CardDescription>
                    Here's how your post will look
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-2">
                      {socialAccounts
                        .filter((account) =>
                          selectedAccounts.includes(account._id)
                        )
                        .slice(0, 3)
                        .map((account) => (
                          <div
                            key={account._id}
                            className="w-8 h-8 rounded-full border-2 border-background bg-muted overflow-hidden"
                          >
                            {account.avatar ? (
                              <img
                                src={account.avatar}
                                alt={account.accountName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs font-bold uppercase">
                                {account.accountName.charAt(0)}
                              </div>
                            )}
                          </div>
                        ))}

                      {selectedAccounts.length > 3 && (
                        <div className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs">
                          +{selectedAccounts.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Posting to {selectedAccounts.length} account
                      {selectedAccounts.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm">{globalCaption}</p>

                    {media.length > 0 && (
                      <div className="aspect-video w-full max-w-md bg-muted/30 rounded-md overflow-hidden">
                        {media[0].type === "image" ? (
                          <img
                            src={media[0].url}
                            alt="Post preview"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <video
                            src={media[0].url}
                            className="w-full h-full object-contain"
                            controls
                            muted
                          />
                        )}
                      </div>
                    )}

                    {isScheduled && scheduledDate && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          Scheduled for{" "}
                          {new Date(scheduledDate).toLocaleDateString(
                            undefined,
                            {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("media")}
                  disabled={isSubmitting}
                >
                  Back to Media
                </Button>
                <div className="space-x-3">
                  <Button
                    variant={isScheduled ? "outline" : "default"}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="min-w-[120px]"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Post Now
                      </>
                    )}
                  </Button>

                  <Button
                    variant={isScheduled ? "default" : "outline"}
                    onClick={handleSubmit}
                    disabled={isSubmitting || !isScheduled || !scheduledDate}
                    className="min-w-[120px]"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Schedule
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
