import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { useToast } from "../../hooks/use-toast";
import { getSocialIcon } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import socialApi from "../../api/socialApi";
import { useAuth } from "../../store/hooks";

const socialAccountSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
});

type SocialAccountFormData = z.infer<typeof socialAccountSchema>;

export default function SocialAccounts() {
  const { user } = useAuth();
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get social accounts
  const { data: accounts = [], isLoading: isAccountsLoading } = useQuery({
    queryKey: [`/social-accounts/${user?._id}`],
  }) as { data: any[]; isLoading: boolean };

  // Delete social account mutation
  const { mutate: deleteAccount, isPending: isDeletingPending } = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/social-accounts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/social-accounts"] });
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

  const { mutate: connectTwitter, isPending: isConnectingTwitterPending } =
    useMutation({
      mutationFn: async ({ skipWelcome }: { skipWelcome: boolean }) => {
        const response = await socialApi.connectTwitter({ skipWelcome });
        window.location.href = response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/social-accounts"] });
        toast({
          title: "Twitter connected",
          description: "Your Twitter account has been connected successfully",
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
          title: "Threads connected",
          description: "Your Threads account has been connected successfully",
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
          title: "LinkedIn connected",
          description: "Your LinkedIn account has been connected successfully",
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

  function onSubmit(data: SocialAccountFormData) {
    if (data.platform === "twitter") {
      connectTwitter({ skipWelcome: true });
    }
    if (data.platform === "threads") {
      connectThreads();
    }
    if (data.platform === "linkedin") {
      connectLinkedIn();
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "expired":
        return "bg-amber-500";
      case "needs_reauth":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  }

  const isLoading =
    isConnectingTwitterPending ||
    isAccountsLoading ||
    isConnectingThreadsPending ||
    isConnectingLinkedInPending;

  useEffect(() => {
    const fetchData = async () => {
      // Check for OAuth callback success/error
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.get("success") === "true") {
        toast({
          title: "Social account connected",
          description: "Your social account has been connected successfully",
        });
        // Clear URL params without causing a reload
        window.history.replaceState({}, "", "/dashboard/accounts");
      } else if (searchParams.get("error")) {
        // Handle specific error types
        const errorType = searchParams.get("error");
        console.log("Error detected:", errorType);
        const message = searchParams.get("message");
        console.log("Error message:", message);
        toast({
          title: "Social account connection failed",
          description: message ?? "Failed to connect social account",
          variant: "destructive",
        });

        // Clear URL params without causing a reload
        window.history.replaceState({}, "", "/dashboard/accounts");
      }

      // Fetch accounts
      // await fetchAccounts();
    };

    fetchData();
  }, [location]);

  const handleAccountsView = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }
    if (accounts.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account: any) => (
            <Card key={account._id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <i
                      className={`${getSocialIcon(account.platform)} text-2xl`}
                    ></i>
                    <div>
                      <CardTitle className="text-base">
                        {account.accountName}
                      </CardTitle>
                      <CardDescription>{account.platform}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(account.status)}>
                    <span className="capitalize">{account.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground truncate">
                  ID: {account.accountId}
                </p>
                {account.expiresAt && (
                  <p className="text-sm text-muted-foreground">
                    Expires: {new Date(account.expiresAt).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                {account.status === "needs_reauth" ||
                account.status === "expired" ? (
                  <Button variant="outline" size="sm">
                    Reauthorize
                  </Button>
                ) : (
                  <span />
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteAccount(account.id)}
                  disabled={isDeletingPending}
                >
                  {isDeletingPending && (
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  )}
                  <Trash2 size={14} className="mr-1" />
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      );
    } else {
      return (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No accounts connected</CardTitle>
            <CardDescription>
              Connect your social media accounts to start posting content
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <Button onClick={() => setIsAddingAccount(true)}>
              <Plus size={16} className="mr-2" />
              Connect Account
            </Button>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Social Accounts</h2>
          <p className="text-muted-foreground">
            Manage your connected social media accounts
          </p>
        </div>
        <Button onClick={() => setIsAddingAccount(true)}>
          <Plus size={16} className="mr-2" />
          Connect Account
        </Button>
      </div>

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
                        <SelectItem value="instagram" disabled>
                          Instagram (coming soon)
                        </SelectItem>
                        <SelectItem value="facebook" disabled>
                          Facebook (coming soon)
                        </SelectItem>
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
                <Button type="submit" disabled={isConnectingTwitterPending}>
                  {isConnectingTwitterPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Connect Account
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
