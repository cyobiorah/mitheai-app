import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Search,
  Check,
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";

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

interface AccountSelectionProps {
  accounts: any[];
  selectedAccounts: string[];
  onSelectionChange: (accountIds: string[]) => void;
}

export default function AccountSelection({
  accounts,
  selectedAccounts,
  onSelectionChange,
}: AccountSelectionProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAccounts, setFilteredAccounts] = useState<any[]>(accounts);

  // When accounts change, update filtered accounts
  useEffect(() => {
    filterAccounts(activeTab, searchQuery);
  }, [accounts, activeTab, searchQuery]);

  // Filter accounts based on tab and search query
  const filterAccounts = (tab: string, query: string) => {
    let filtered = accounts;

    // Filter by platform
    if (tab !== "all") {
      filtered = filtered.filter(
        (account) => account.platform.toLowerCase() === tab.toLowerCase()
      );
    }

    // Filter by search query
    if (query.trim() !== "") {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (account) =>
          account.accountName?.toLowerCase().includes(lowerQuery) ||
          account.accountId.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredAccounts(filtered);
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    filterAccounts(tab, searchQuery);
  };

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterAccounts(activeTab, query);
  };

  // Toggle account selection
  const toggleAccount = (accountId: string) => {
    if (selectedAccounts.includes(accountId)) {
      onSelectionChange(selectedAccounts.filter((id) => id !== accountId));
    } else {
      onSelectionChange([...selectedAccounts, accountId]);
    }
  };

  // Helper function to get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "twitter":
        return <Twitter className="h-4 w-4" />;
      case "facebook":
        return <Facebook className="h-4 w-4" />;
      case "linkedin":
        return <Linkedin className="h-4 w-4" />;
      case "tiktok":
        return <TikTokIcon />;
      case "threads":
        return <ThreadsIcon />;
      default:
        return null;
    }
  };

  // Helper function to get platform color
  const getPlatformColor = (platform: string): string => {
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
      default:
        return "bg-gray-500";
    }
  };

  // Count accounts by platform
  const platformCounts = accounts.reduce((acc, account) => {
    const platform = account.platform.toLowerCase();
    acc[platform] = (acc[platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Helper to count selected accounts per platform
  const countSelectedByPlatform = () => {
    return accounts
      .filter((account) => selectedAccounts.includes(account._id))
      .reduce((acc, account) => {
        const platform = account.platform.toLowerCase();
        acc[platform] = (acc[platform] ?? 0) + 1;
        return acc;
      }, {} as Record<string, number>);
  };

  const selectedCounts = countSelectedByPlatform();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Social Accounts</CardTitle>
        <CardDescription>Choose which accounts to post to</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="w-full border-b mb-4">
            <TabsTrigger value="all" className="flex-1">
              All
              <Badge variant="secondary" className="ml-2">
                {accounts.length}
              </Badge>
            </TabsTrigger>
            {platformCounts.instagram && (
              <TabsTrigger value="instagram" className="flex-1">
                <div className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  <span className="hidden sm:inline">Instagram</span>
                  <Badge variant="secondary">{platformCounts.instagram}</Badge>
                </div>
              </TabsTrigger>
            )}
            {platformCounts.twitter && (
              <TabsTrigger value="twitter" className="flex-1">
                <div className="flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  <span className="hidden sm:inline">Twitter</span>
                  <Badge variant="secondary">{platformCounts.twitter}</Badge>
                </div>
              </TabsTrigger>
            )}
            {platformCounts.linkedin && (
              <TabsTrigger value="linkedin" className="flex-1">
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  <span className="hidden sm:inline">LinkedIn</span>
                  <Badge variant="secondary">{platformCounts.linkedin}</Badge>
                </div>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Account List */}
          {filteredAccounts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredAccounts.map((account) => (
                <div
                  key={account._id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedAccounts.includes(account._id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => toggleAccount(account._id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${getPlatformColor(
                        account.platform
                      )} flex items-center justify-center text-white overflow-hidden`}
                    >
                      {getPlatformIcon(account.platform)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        @{account.accountName}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {account.status}
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border ${
                        selectedAccounts.includes(account._id)
                          ? "bg-primary border-primary text-white"
                          : "border-muted-foreground"
                      } flex items-center justify-center`}
                    >
                      {selectedAccounts.includes(account._id) && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No accounts found</p>
            </div>
          )}
        </Tabs>

        {/* Selection Summary */}
        {selectedAccounts.length > 0 && (
          <div className="bg-muted/40 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">
              Selected Accounts ({selectedAccounts.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(selectedCounts).map(([platform, count]) => (
                <Badge
                  key={platform}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {getPlatformIcon(platform)}
                  <span>
                    {count as any} {platform}
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
