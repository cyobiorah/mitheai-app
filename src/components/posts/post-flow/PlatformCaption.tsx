import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../ui/tabs";
import { Globe, Image, Info } from "lucide-react";
import { Label } from "../../ui/label";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import {
  FaXTwitter,
  FaInstagram,
  FaLinkedin,
  FaFacebook,
} from "react-icons/fa6";

// Custom TikTok icon
const TikTokIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.001.595.04.88.12V9.4a6.32 6.32 0 0 0-1-.05A6.35 6.35 0 0 0 6.79 20a6.34 6.34 0 0 0 6.59-6.34V7.87a8.16 8.16 0 0 0 6.21 1.48V6.69h-.01Z" />
  </svg>
);

// Custom Threads icon
const ThreadsIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01c-.017-2.319 1.128-4.041 3.13-4.712 1.07-.338 2.108-.314 3.134-.018 3.14.904 5.019 2.9 6.496 5.817.144.284.346.731.402.888.32-.887 1.069-2.863 1.926-4.243 1.186-2.614 2.674-4.126 4.43-4.5 1.343-.293 2.543.135 3.529 1.247 1.5 1.694 1.554 4.423.138 6.841-1.236 2.262-2.968 3.562-5.339 4.02-1.106.194-2.311.108-3.45-.248.772 2.582 1.94 4.569 4.086 6.075 1.075.758 2.3 1.242 3.648 1.444.638.106 1.254.66 1.33 1.304.088.77-.278 1.346-.928 1.736-.553.33-1.17.42-1.806.379-3.644-.207-6.519-1.765-8.851-4.641-1.055-1.367-1.744-2.897-2.266-4.532-.683-2.084-.927-4.199-.971-6.373h.025c-.051-1.303-.906-2.18-2.012-2.072-1.535.189-1.453 1.68-1.426 2.783.06 2.558.762 4.92 2.14 7.06 1.767 2.81 4.494 4.255 8.022 4.248 2.201.022 4.23-.558 6.139-1.646.774-.446 1.555-.358 2.079.241.584.665.638 1.474.145 2.191-1.324 1.757-3.173 2.65-5.273 3.118-1.51.29-3.012.346-4.54.157l.037-.013Z" />
  </svg>
);

interface PlatformCaptionsProps {
  accounts: any[];
  selectedAccounts: string[];
  globalCaption: string;
  platformCaptions: Record<string, string>;
  onPlatformCaptionChange: (platform: string, caption: string) => void;
}

export default function PlatformCaptions({
  accounts,
  selectedAccounts,
  globalCaption,
  platformCaptions,
  onPlatformCaptionChange,
}: Readonly<PlatformCaptionsProps>) {
  const [activeTab, setActiveTab] = useState("global");

  // Get platforms from selected accounts
  const getSelectedPlatforms = (): string[] => {
    const selectedAccountsData = accounts.filter((account) =>
      selectedAccounts.includes(account._id)
    );

    // Extract unique platforms
    const platforms = Array.from(
      new Set(
        selectedAccountsData.map((account) => account.platform.toLowerCase())
      )
    );

    return platforms;
  };

  const selectedPlatforms = getSelectedPlatforms();

  // Get character count for each platform
  const getCharacterLimits = (platform: string): number => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return 280;
      case "instagram":
        return 2200;
      case "facebook":
        return 63206;
      case "linkedin":
        return 3000;
      case "tiktok":
        return 2200;
      case "threads":
        return 500;
      default:
        return 2000;
    }
  };

  // Get platform-specific caption
  const getPlatformCaption = (platform: string): string => {
    return platformCaptions[platform] || globalCaption;
  };

  // Calculate character count
  const getCharacterCount = (platform: string): number => {
    return getPlatformCaption(platform).length;
  };

  // Format platform name
  const formatPlatformName = (platform: string): string => {
    if (platform === "global") return "Global";
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  // Get platform color
  const getPlatformColor = (platform: string): string => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return "text-[#E1306C]";
      case "twitter":
        return "text-[#1DA1F2]";
      case "facebook":
        return "text-[#1877F2]";
      case "linkedin":
        return "text-[#0A66C2]";
      case "tiktok":
        return "text-[#000000] dark:text-white";
      case "threads":
        return "text-[#000000] dark:text-white";
      default:
        return "text-primary";
    }
  };

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <FaInstagram className="h-4 w-4" />;
      case "twitter":
        return <FaXTwitter className="h-4 w-4" />;
      case "facebook":
        return <FaFacebook className="h-4 w-4" />;
      case "linkedin":
        return <FaLinkedin className="h-4 w-4" />;
      case "tiktok":
        return <TikTokIcon />;
      case "threads":
        return <ThreadsIcon />;
      case "global":
        return <Globe className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  // Change tab and load appropriate caption
  const handleTabChange = (platform: string) => {
    setActiveTab(platform);
  };

  // Handle caption change
  const handleCaptionChange = (platform: string, caption: string) => {
    onPlatformCaptionChange(platform, caption);
  };

  // Compose a suggested caption based on platform
  const suggestCaption = (platform: string) => {
    const baseCaption = globalCaption;

    // Add platform-specific modifications
    switch (platform.toLowerCase()) {
      case "twitter":
        // For Twitter, shorter caption and add hashtags
        return baseCaption.length > 220
          ? `${baseCaption.substring(0, 217)}...`
          : baseCaption;

      case "instagram":
        // For Instagram, add more hashtags
        const hashtagMatch = baseCaption.match(/#[a-z0-9_]+/gi);
        if (!hashtagMatch || hashtagMatch.length < 3) {
          // Add more hashtags if there are few
          return `${baseCaption}\n\n#skedlii #socialmedia #contentcreator`;
        }
        return baseCaption;

      case "linkedin":
        // For LinkedIn, more professional tone
        return baseCaption.replace(/#([a-z0-9_]+)/gi, "#$1");

      default:
        return baseCaption;
    }
  };

  // Get accounts for platform
  const getAccountsForPlatform = (platform: string): any[] => {
    return accounts.filter(
      (account) =>
        account.platform.toLowerCase() === platform.toLowerCase() &&
        selectedAccounts.includes(account._id)
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content</CardTitle>
        <CardDescription>
          Write your post content for each platform
        </CardDescription>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <CardContent className="pb-0">
          <TabsList className="w-full justify-start mb-4 overflow-x-auto">
            <TabsTrigger value="global" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Global</span>
            </TabsTrigger>

            {selectedPlatforms.map((platform) => (
              <TabsTrigger
                key={platform}
                value={platform}
                className="flex items-center gap-2"
              >
                {getPlatformIcon(platform)}
                <span>{formatPlatformName(platform)}</span>
                {platformCaptions[platform] && (
                  <Badge
                    variant="outline"
                    className="h-4 w-4 p-0 flex items-center justify-center"
                  >
                    ✓
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="global" className="mt-0">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="global-caption" className="text-base">
                  Global Caption
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs hover:text-primary"
                    onClick={() => handleCaptionChange("global", "")}
                    disabled={!globalCaption}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              <Textarea
                id="global-caption"
                value={globalCaption}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleCaptionChange("global", e.target.value)
                }
                placeholder="Write your caption here. This will be used for all platforms unless you customize per platform."
                className="min-h-[200px] resize-y"
              />

              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Will be used for all platforms</span>
                <span>{globalCaption.length} characters</span>
              </div>
            </div>
          </TabsContent>

          {selectedPlatforms.map((platform) => (
            <TabsContent key={platform} value={platform} className="mt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor={`${platform}-caption`}
                      className="text-base flex items-center gap-2"
                    >
                      {getPlatformIcon(platform)}
                      <span>{formatPlatformName(platform)} Caption</span>
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                          >
                            <Info className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Character limit: {getCharacterLimits(platform)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() =>
                        handleCaptionChange(platform, suggestCaption(platform))
                      }
                    >
                      Suggest
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => handleCaptionChange(platform, "")}
                      disabled={!platformCaptions[platform]}
                    >
                      Reset to Global
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Textarea
                    id={`${platform}-caption`}
                    value={getPlatformCaption(platform)}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleCaptionChange(platform, e.target.value)
                    }
                    placeholder={`Write a custom caption for ${formatPlatformName(
                      platform
                    )}...`}
                    className="min-h-[200px] resize-y"
                  />

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex flex-wrap gap-2">
                      {getAccountsForPlatform(platform).map((account) => (
                        <Badge
                          key={account._id}
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          {getPlatformIcon(platform)}
                          <span>{account.accountName}</span>
                        </Badge>
                      ))}
                    </div>

                    <span
                      className={`text-sm ${
                        getCharacterCount(platform) >
                        getCharacterLimits(platform)
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {getCharacterCount(platform)} /{" "}
                      {getCharacterLimits(platform)}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </CardContent>
      </Tabs>
      <CardFooter className="flex justify-between pt-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Image className="h-4 w-4" />
          <span>Add media in the next step</span>
        </div>
        {selectedPlatforms.length > 0 && (
          <div className="flex flex-wrap justify-end gap-2">
            {selectedPlatforms.map((platform) => (
              <Button
                key={platform}
                variant="ghost"
                size="sm"
                className={`h-7 gap-1 ${
                  platformCaptions[platform] ? getPlatformColor(platform) : ""
                }`}
                onClick={() => handleTabChange(platform)}
              >
                {getPlatformIcon(platform)}
                <span className="text-xs">
                  {platformCaptions[platform] ? "Customized" : "Default"}
                </span>
              </Button>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
