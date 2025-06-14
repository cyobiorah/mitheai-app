import { MediaItem } from "./mediaUploadComponents";

export interface AccountSelectionProps {
  accounts: any[];
  selectedAccounts: string[];
  onSelectionChange: (accountIds: string[]) => void;
}

export const handleAccountSelection = (
  accountIds: string[],
  setSelectedAccounts: React.Dispatch<React.SetStateAction<string[]>>
) => {
  setSelectedAccounts(accountIds);
};
// Count accounts by platform
export const platformCounts = (accounts: any[]) => {
  return accounts.reduce((acc, account) => {
    const platform = account.platform.toLowerCase();
    acc[platform] = (acc[platform] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

export const handleCaptionChange = (
  platform: string,
  caption: string,
  setGlobalCaption: React.Dispatch<React.SetStateAction<string>>,
  setPlatformCaptions: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >,
  platformCaptions: Record<string, string>
) => {
  if (platform === "global") {
    setGlobalCaption(caption);
  } else {
    setPlatformCaptions({
      ...platformCaptions,
      [platform]: caption,
    });
  }
};

export const handleMediaChange = (
  mediaItems: MediaItem[],
  setMedia: React.Dispatch<React.SetStateAction<MediaItem[]>>
) => {
  setMedia(mediaItems);
};

export const handleSchedulingChange = (
  scheduled: boolean,
  date: Date | null,
  setIsScheduled: React.Dispatch<React.SetStateAction<boolean>>,
  setScheduledDate: React.Dispatch<React.SetStateAction<Date | null>>
) => {
  setIsScheduled(scheduled);
  setScheduledDate(date);
};

// Helper function to get platform color
export const getPlatformColor = (platform: string): string => {
  switch (platform.toLowerCase()) {
    case "instagram":
      return "bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400";
    case "twitter":
      return "bg-[#1DA1F2]";
    case "facebook":
      return "bg-[#1877F2]";
    case "linkedin":
      return "bg-[#0A66C2]";
    case "tiktok":
      return "bg-[#010101]";
    case "threads":
      return "bg-black dark:bg-white dark:text-black";
    case "youtube":
      return "bg-[#FF0000]";
    default:
      return "bg-gray-500";
  }
};

// Helper to count selected accounts per platform
export const countSelectedByPlatform = (
  accounts: any[],
  selectedAccounts: string[]
) => {
  return accounts
    .filter((account) => selectedAccounts.includes(account._id))
    .reduce((acc, account) => {
      const platform = account.platform.toLowerCase();
      acc[platform] = (acc[platform] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
};
