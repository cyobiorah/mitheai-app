import { useEffect, useState } from "react";
import { useAuth } from "../../store/hooks";
import { useToast } from "../../hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Badge } from "../ui/badge";
import {
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  ArrowRightCircle,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../../lib/queryClient";
import { Switch } from "../ui/switch";
import { formatDate } from "../../lib/utils";

const Billing = () => {
  const { user, fetchUserData } = useAuth();
  const { toast } = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("subscription");
  const [isYearly, setIsYearly] = useState(false);

  const tabItems = [
    { value: "subscription", label: "Subscription" },
    { value: "plans", label: "Plans" },
    { value: "invoices", label: "Invoices" },
  ];

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const subscribed = searchParams.get("subscribed");
    const error = searchParams.get("error");

    const needsFetch = subscribed === "true" || error;

    if (needsFetch) {
      fetchUserData();
    }

    if (subscribed === "true") {
      toast({
        title: "Subscription created",
        description: "Your subscription has been created successfully",
      });
    } else if (error) {
      toast({
        title: "Subscription creation failed",
        description:
          searchParams.get("message") ?? "Failed to create subscription",
        variant: "destructive",
      });
    }

    window.history.replaceState({}, "", "/dashboard/billing");
  }, []);

  const { mutate: createCheckoutSession, isPending: isCreatingPending } =
    useMutation({
      mutationFn: async ({ planId }: { planId: string }) => {
        const response = await apiRequest(
          "POST",
          "/checkout/create-checkout-session",
          {
            userId: user?._id,
            email: user?.email,
            planId,
            ...(user?.stripeCustomerId && {
              stripeCustomerId: user?.stripeCustomerId,
            }),
          }
        );
        window.location.href = response.url;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["/checkout/create-checkout-session"],
        });
      },
    });

  const { data: plans = [], isLoading: isPlansLoading } = useQuery({
    queryKey: [`/plans`],
  }) as { data: any[]; isLoading: boolean };

  const { data: invoices = [], isLoading: isInvoicesLoading } = useQuery({
    queryKey: [`/invoices/user/${user?._id}`],
  }) as { data: any[]; isLoading: boolean };

  const loading = isCreatingPending || isPlansLoading || isInvoicesLoading;

  const displayedPlans = plans.map((plan) => ({
    ...plan,
    displayPrice: isYearly ? plan.priceYearly : plan.priceMonthly,
    displayPeriod: isYearly ? "yearly" : "monthly",
  }));

  const getStatusBadge = () => {
    switch (user?.subscriptionStatus) {
      case "paid":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Active
          </Badge>
        );
      case "trialing":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <ArrowRightCircle className="h-3 w-3 mr-1" /> Trial
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <PauseCircle className="h-3 w-3 mr-1" /> Cancelled
          </Badge>
        );
      case "inactive":
      default:
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600">
            <AlertCircle className="h-3 w-3 mr-1" /> Inactive
          </Badge>
        );
    }
  };

  const handleUpgradeDowngrade = (plan: any) => {
    let planId: string;
    if (isYearly) {
      planId = plan.priceYearlyId;
    } else {
      planId = plan.priceMonthlyId;
    }
    createCheckoutSession({ planId });
  };

  const handleCancelSubscription = () => {
    // In a real app, this would call the API to cancel the subscription
    setShowCancelDialog(false);
    toast({
      title: "Subscription cancelled",
      description: "Your subscription will end at the current billing period.",
    });
  };

  const renderSubscriptionInfo = () => {
    if (!user?.stripeCustomerId) {
      return (
        <div className="space-y-4">
          <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-medium mb-2">No Active Subscription</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You're currently on the Free plan. Upgrade to unlock premium
              features.
            </p>
            <Button onClick={() => setActiveTab("plans")}>Upgrade Now</Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="flex flex-wrap justify-between gap-y-4">
            <div>
              <h3 className="text-lg font-medium mb-1">
                {/* {user?.subscriptionTier ?? "Free"} Plan */}
                {user?.paymentDescription}
              </h3>
              <div className="flex items-center gap-2 mb-1">
                {getStatusBadge()}
              </div>
              {user?.renewalDate && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Next billing date: {formatDate(user?.renewalDate, "PPP pp")}
                </p>
              )}
            </div>
            <div className="text-right">
              {/* <p className="text-2xl font-bold mb-1">
                {user?.subscriptionTier === "free"
                  ? "$0"
                  : user?.subscriptionTier === "basic"
                  ? "$29"
                  : user?.subscriptionTier === "pro"
                  ? "$99"
                  : user?.subscriptionTier === "business"
                  ? "$299"
                  : "$0"}
              </p> */}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                per month
              </p>
            </div>
          </div>

          {user?.subscriptionStatus === "paid" && (
            <div className="mt-6 flex flex-wrap gap-2">
              <AlertDialog
                open={showCancelDialog}
                onOpenChange={setShowCancelDialog}
              >
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <PauseCircle className="h-4 w-4 mr-2" />
                    Cancel Subscription
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Your subscription will remain active until the end of your
                      current billing period, after which your account will
                      revert to the Basic plan with limited features.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancelSubscription}>
                      Cancel Subscription
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderInvoiceHistory = () => {
    if (invoices.length === 0 && !loading) {
      return (
        <div className="text-center p-6">
          <p className="text-gray-500 dark:text-gray-400">
            No invoices to display
          </p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="py-3 px-4 text-left">Invoice</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices?.map((invoice: any) => (
              <tr key={invoice._id} className="border-b dark:border-gray-700">
                <td className="py-3 px-4">{invoice._id}</td>
                <td className="py-3 px-4">
                  {formatDate(invoice.createdAt, "PPP")}
                </td>
                <td className="py-3 px-4">${invoice.amountPaid}</td>
                <td className="py-3 px-4">
                  <Badge variant="outline">{invoice.status}</Badge>
                </td>
                <td className="py-3 px-4 text-right">
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const getPlanActionText = (planId: string) => {
    if (user?.productId === planId) {
      return "Current Plan";
    }

    const tiers = ["free", "basic", "pro", "business"];
    const currentIndex = tiers.indexOf(user?.subscriptionTier ?? "free");
    const targetIndex = tiers.indexOf(planId);

    if (targetIndex > currentIndex) return "Upgrade";
    if (targetIndex < currentIndex) return "Change Plan";

    return "Current Plan";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Billing & Subscription</h2>
        <p className="text-muted-foreground">
          Manage your subscription and payment details
        </p>
      </div>

      <Tabs
        defaultValue={activeTab}
        className="space-y-4"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList>
          {tabItems.map((item) => (
            <TabsTrigger key={item.value} value={item.value}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>
                View and manage your current subscription
              </CardDescription>
            </CardHeader>
            <CardContent>{renderSubscriptionInfo()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <CardTitle>Available Plans</CardTitle>
              <CardDescription>
                Choose the plan that works best for you
              </CardDescription>
              <div className="flex items-center gap-2">
                <span className={!isYearly ? "font-bold" : ""}>Monthly</span>
                <Switch
                  checked={isYearly}
                  onCheckedChange={setIsYearly}
                  aria-label="Toggle yearly billing"
                />
                <span className={isYearly ? "font-bold" : ""}>Yearly</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {displayedPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`border rounded-lg p-6 space-y-4 relative ${
                      plan.isPopular ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary px-3 py-1 rounded-full text-white text-xs font-medium">
                        Most Popular
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="font-bold text-lg capitalize">
                          {plan.name}
                        </h3>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold">
                          ${plan.displayPrice}
                        </span>
                        <span className="ml-1 text-gray-500 dark:text-gray-400">
                          {plan.displayPeriod}
                        </span>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature: string) => (
                        <li
                          key={feature}
                          className="flex items-center space-x-2"
                        >
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={plan.disabled ? "outline" : "default"}
                      disabled={plan.disabled}
                      onClick={() => {
                        if (plan.id === "free") return;
                        handleUpgradeDowngrade(plan);
                      }}
                    >
                      {getPlanActionText(plan.productId)}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>
                View and download your past invoices
              </CardDescription>
            </CardHeader>
            <CardContent>{renderInvoiceHistory()}</CardContent>
            {user?.subscriptionStatus !== "inactive" &&
              user?.invoices?.length && (
                <CardFooter>
                  <Button variant="outline" className="ml-auto">
                    Download All Invoices
                  </Button>
                </CardFooter>
              )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Billing;
