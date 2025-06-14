import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { useToast } from "../../hooks/use-toast";
import { formatDate, getSocialIcon } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import socialApi from "../../api/socialApi";
import { useAuth } from "../../store/hooks";
import { Skeleton } from "../ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import DeleteDialog from "../dialog/DeleteDialog";

const socialAccountSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
});

type SocialAccountFormData = z.infer<typeof socialAccountSchema>;

export default function SocialAccounts() {
  const { user } = useAuth();
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({
    id: "",
    isOpen: false,
    platform: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get social accounts
  const { data: accounts = [], isLoading: isAccountsLoading } = useQuery({
    queryKey: [`/social-accounts/${user?._id}`],
  }) as { data: any[]; isLoading: boolean };

  // Delete social account mutation
  const { mutate: deleteAccount, isPending: isDeletingPending } = useMutation({
    mutationFn: async () => {
      const { id, platform } = deleteConfig;

      if (platform === "tiktok") {
        return await apiRequest(
          "DELETE",
          `/social-accounts/tiktok/revoke/${id}`
        );
      } else {
        return await apiRequest("DELETE", `/social-accounts/disconnect/${id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/social-accounts/${user?._id}`],
      });
      setDeleteConfig({ id: "", isOpen: false, platform: "" });
      toast({
        title: "Account removed",
        description: "The social account has been disconnected",
      });
    },
    onError: () => {
      toast({
        title: "Removal failed",
        description: "Failed to remove the account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<SocialAccountFormData>({
    resolver: zodResolver(socialAccountSchema),
    defaultValues: {
      platform: "",
    },
  });

  const {
    mutate: refreshTiktokAccessToken,
    isPending: isRefreshingTiktokPending,
  } = useMutation({
    mutationFn: async (accountId: string) => {
      return await apiRequest(
        "GET",
        `/social-accounts/tiktok/refresh/${accountId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/social-accounts/${user?._id}`],
      });
    },
    onError: () => {
      toast({
        title: "Refresh failed",
        description: "Failed to refresh the access token. Please try again.",
        variant: "destructive",
      });
    },
  });

  const {
    mutate: refreshTwitterAccessToken,
    isPending: isRefreshingTwitterPending,
  } = useMutation({
    mutationFn: async (accountId: string) => {
      return await apiRequest(
        "GET",
        `/social-accounts/twitter/refresh/${accountId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/social-accounts/${user?._id}`],
      });
    },
    onError: () => {
      toast({
        title: "Refresh failed",
        description: "Failed to refresh the access token. Please try again.",
        variant: "destructive",
      });
    },
  });

  const {
    mutate: refreshYoutubeAccessToken,
    isPending: isRefreshingYoutubePending,
  } = useMutation({
    mutationFn: async (accountId: string) => {
      return await apiRequest(
        "GET",
        `/social-accounts/youtube/refresh/${accountId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/social-accounts/${user?._id}`],
      });
    },
    onError: () => {
      toast({
        title: "Refresh failed",
        description: "Failed to refresh the access token. Please try again.",
        variant: "destructive",
      });
    },
  });

  const { mutate: connectTwitter, isPending: isConnectingTwitterPending } =
    useMutation({
      mutationFn: async ({ skipWelcome }: { skipWelcome: boolean }) => {
        const response = await socialApi.connectTwitter({ skipWelcome });
        window.location.href = response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/social-accounts"] });
        toast({
          title: "Twitter connected in progress",
          description: "Your Twitter account is being connected",
        });
        setIsAddingAccount(false);
        form.reset();
      },
      onError: (error) => {
        console.error({ error });
        toast({
          title: "Connection failed",
          description:
            "Failed to connect Twitter. It may already be connected or token is invalid.",
          variant: "destructive",
        });
      },
    });

  const { mutate: connectThreads, isPending: isConnectingThreadsPending } =
    useMutation({
      mutationFn: async () => {
        const response = await socialApi.connectThreads();
        window.location.href = response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/social-accounts"] });
        toast({
          title: "Threads connected in progress",
          description: "Your Threads account is being connected",
        });
        setIsAddingAccount(false);
        form.reset();
      },
      onError: (error) => {
        console.error({ error });
        toast({
          title: "Connection failed",
          description:
            "Failed to connect Threads. It may already be connected or token is invalid.",
          variant: "destructive",
        });
      },
    });

  const { mutate: connectLinkedIn, isPending: isConnectingLinkedInPending } =
    useMutation({
      mutationFn: async () => {
        const response = await socialApi.connectLinkedIn();
        window.location.href = response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/social-accounts"] });
        toast({
          title: "LinkedIn connected in progress",
          description: "Your LinkedIn account is being connected",
        });
        setIsAddingAccount(false);
        form.reset();
      },
      onError: (error) => {
        console.error({ error });
        toast({
          title: "Connection failed",
          description:
            "Failed to connect LinkedIn. It may already be connected or token is invalid.",
          variant: "destructive",
        });
      },
    });

  const { mutate: connectInstagram, isPending: isConnectingInstagramPending } =
    useMutation({
      mutationFn: async () => {
        const response = await socialApi.connectInstagram();
        window.location.href = response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/social-accounts"] });
        toast({
          title: "Instagram connection in progress",
          description: "Your Instagram account is being connected",
        });
        // setIsAddingAccount(false);
        form.reset();
      },
      onError: (error) => {
        console.error({ error });
        toast({
          title: "Connection failed",
          description:
            "Failed to connect Instagram. It may already be connected or token is invalid.",
          variant: "destructive",
        });
      },
      onSettled: () => {
        setIsAddingAccount(false);
      },
    });

  const { mutate: connectFacebook, isPending: isConnectingFacebookPending } =
    useMutation({
      mutationFn: async () => {
        const response = await socialApi.connectFacebook();
        window.location.href = response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/social-accounts"] });
        toast({
          title: "Facebook connection in progress",
          description: "Your Facebook account is being connected",
        });
        // setIsAddingAccount(false);
        form.reset();
      },
      onError: (error) => {
        console.error({ error });
        toast({
          title: "Connection failed",
          description:
            "Failed to connect Facebook. It may already be connected or token is invalid.",
          variant: "destructive",
        });
      },
      onSettled: () => {
        setIsAddingAccount(false);
      },
    });

  const { mutate: connectTikTok, isPending: isConnectingTikTokPending } =
    useMutation({
      mutationFn: async () => {
        const response = await socialApi.connectTikTok();
        window.location.href = response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/social-accounts"] });
        toast({
          title: "TikTok connection in progress",
          description: "Your TikTok account is being connected",
        });
        // setIsAddingAccount(false);
        form.reset();
      },
      onError: (error) => {
        console.error({ error });
        toast({
          title: "Connection failed",
          description:
            "Failed to connect TikTok. It may already be connected or token is invalid.",
          variant: "destructive",
        });
      },
      onSettled: () => {
        setIsAddingAccount(false);
      },
    });

  const { mutate: connectYoutube, isPending: isConnectingYoutubePending } =
    useMutation({
      mutationFn: async () => {
        const response = await socialApi.connectYoutube();
        window.location.href = response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/social-accounts"] });
        toast({
          title: "Youtube connection in progress",
          description: "Your Youtube account is being connected",
        });
        // setIsAddingAccount(false);
        form.reset();
      },
      onError: (error) => {
        console.error({ error });
        toast({
          title: "Connection failed",
          description:
            "Failed to connect Youtube. It may already be connected or token is invalid.",
          variant: "destructive",
        });
      },
      onSettled: () => {
        setIsAddingAccount(false);
      },
    });

  function onSubmit(data: SocialAccountFormData) {
    switch (data.platform) {
      case "twitter":
        connectTwitter({ skipWelcome: true });
        break;
      case "threads":
        connectThreads();
        break;
      case "linkedin":
        connectLinkedIn();
        break;
      case "instagram":
        connectInstagram();
        break;
      case "facebook":
        connectFacebook();
        break;
      case "tiktok":
        connectTikTok();
        break;
      case "youtube":
        connectYoutube();
        break;
      default:
        toast({
          title: "Connection failed",
          description: "Failed to connect social account",
          variant: "destructive",
        });
        break;
    }
  }

  const isLoading =
    isConnectingTwitterPending ||
    isAccountsLoading ||
    isConnectingThreadsPending ||
    isConnectingLinkedInPending ||
    isConnectingInstagramPending ||
    isConnectingFacebookPending ||
    isConnectingTikTokPending ||
    isConnectingYoutubePending ||
    isRefreshingTwitterPending ||
    isRefreshingYoutubePending ||
    isRefreshingTiktokPending;

  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams(window.location.search);

      // Legacy: ?success=true
      if (searchParams.get("success") === "true") {
        toast({
          title: "Social account connected",
          description: "Your social account has been connected successfully",
        });
        window.history.replaceState({}, "", "/dashboard/accounts");
        return;
      }

      // Legacy: ?error=someType
      if (searchParams.get("error")) {
        const errorType = searchParams.get("error");
        const message = searchParams.get("message");
        console.log("OAuth error:", errorType, message);
        toast({
          title: "Social account connection failed",
          description: message ?? "Failed to connect social account",
          variant: "destructive",
        });
        window.history.replaceState({}, "", "/dashboard/accounts");
        return;
      }

      // Instagram Graph-style: ?status=failed&message=...
      if (searchParams.get("status") === "failed") {
        const decodedMessage = decodeURIComponent(
          searchParams.get("message") ?? ""
        );
        toast({
          title: "Social account connection failed",
          description: decodedMessage ?? "Something went wrong",
          variant: "destructive",
        });
        window.history.replaceState({}, "", "/dashboard/accounts");
      }
    };

    fetchData();
  }, [location]);

  const handleAccountsView = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <SocialAccountSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (accounts.length > 0) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {accounts.length} connected account
              {accounts.length !== 1 ? "s" : ""}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: [`/social-accounts/${user?._id}`],
                })
              }
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account: any) => (
              <Card
                key={account._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {account.metadata?.profileImageUrl ||
                      account.metadata?.picture ||
                      account.metadata?.profile?.threads_profile_picture_url ? (
                        <img
                          src={
                            account.metadata.profileImageUrl ??
                            account.metadata.picture ??
                            account.metadata.profile.threads_profile_picture_url
                          }
                          alt={`${account.accountName} profile`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className={`p-2 rounded-lg ${getClassName(
                            account.platform
                          )}`}
                        >
                          <i
                            className={`${getSocialIcon(
                              account.platform
                            )} text-xl ${getTextColor(account.platform)}`}
                          />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-base font-medium">
                          {account.accountName ?? "Unknown Account"}
                        </CardTitle>
                        <CardDescription className="capitalize">
                          {account.platform}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={
                        account.status === "active" ? "default" : "destructive"
                      }
                      className="flex items-center gap-1"
                    >
                      {account.status === "active" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      <span className="capitalize">
                        {account.status.replace("_", " ")}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                      ID: {account.accountId?.substring(0, 8)}...
                    </span>
                  </div>
                  {account.tokenExpiry && (
                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        Expires: {formatDate(account.tokenExpiry, "PPP pp")}
                      </span>
                    </div>
                  )}
                  {(account.connectedAt || account.createdAt) && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        Connected:{" "}
                        {formatDate(
                          account.connectedAt ?? account.createdAt ?? ""
                        )}
                      </span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2 pt-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {account.status === "expired" && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isLoading}
                            onClick={() => {
                              // Handle reauthorization
                              if (account.platform === "twitter") {
                                refreshTwitterAccessToken(account._id);
                              } else if (account.platform === "threads") {
                                connectThreads();
                              } else if (account.platform === "linkedin") {
                                connectLinkedIn();
                              } else if (account.platform === "instagram") {
                                connectInstagram();
                              } else if (account.platform === "tiktok") {
                                refreshTiktokAccessToken(account.accountId);
                              } else if (account.platform === "youtube") {
                                refreshYoutubeAccessToken(account._id);
                              }
                            }}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reauthorize
                          </Button>
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        {account.status !== "active" &&
                          "This account needs reauthorization"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            setDeleteConfig({
                              id: account._id,
                              isOpen: true,
                              platform: account.platform,
                            })
                          }
                          disabled={isDeletingPending}
                        >
                          {isDeletingPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Disconnect account</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {accounts.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-4 h-[60vh]">
          <div className="rounded-full bg-primary/10 p-4">
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">No accounts connected</h3>
          <p className="text-muted-foreground text-center max-w-md">
            You haven't created any accounts yet. Connect your first account to
            get started.
          </p>
          <Button onClick={() => setIsAddingAccount(true)}>
            <Plus size={16} className="mr-2" />
            Connect Account
          </Button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Social Accounts
            </h2>
            <p className="text-muted-foreground">
              Manage your connected social media accounts and their permissions
            </p>
          </div>
          <Button
            onClick={() => setIsAddingAccount(true)}
            className="w-full sm:w-auto"
          >
            <Plus size={16} className="mr-2" />
            Connect Account
          </Button>
        </div>
      )}

      {handleAccountsView()}

      <Dialog open={isAddingAccount} onOpenChange={setIsAddingAccount}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Social Account</DialogTitle>
            <DialogDescription>
              Enter the details to connect your social media account
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="threads">Threads</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsAddingAccount(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Connect Account
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        config={deleteConfig}
        setConfig={setDeleteConfig}
        handleDelete={() => deleteAccount()}
        message="Are you sure you want to delete this account?"
        title="Delete Account"
        loading={isDeletingPending}
      />
    </div>
  );
}

const SocialAccountSkeleton = () => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-5 w-16" />
      </div>
    </CardHeader>
    <CardContent className="space-y-2">
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </CardContent>
    <CardFooter className="flex justify-end gap-2 pt-2">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-8 w-20" />
    </CardFooter>
  </Card>
);

export function getClassName(platform: string) {
  switch (platform) {
    case "twitter":
      return "bg-blue-50 dark:bg-blue-900/20";
    case "instagram":
      return "bg-pink-50 dark:bg-pink-900/20";
    case "linkedin":
      return "bg-blue-50 dark:bg-blue-900/20";
    case "facebook":
      return "bg-blue-50 dark:bg-blue-900/20";
    case "threads":
      return "bg-black dark:bg-white dark:text-black";
    default:
      return "bg-gray-50 dark:bg-gray-800";
  }
}

export function getTextColor(platform: string) {
  switch (platform) {
    case "twitter":
      return "text-blue-500";
    case "instagram":
      return "text-pink-500";
    case "linkedin":
      return "text-blue-600";
    case "threads":
      return "text-black dark:text-white";
    default:
      return "text-gray-500";
  }
}
