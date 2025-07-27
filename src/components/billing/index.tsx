import { useEffect, useState } from "react";
import { useAuth } from "../../store/hooks";
import { useToast } from "../../hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
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
import { InvoiceTable } from "./Invoice";
import { InvoiceTableFallback } from "./InvoiceTableFallback";

const Billing = () => {
  const { user, fetchUserData } = useAuth();
  const { billing } = user;
  const { toast } = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("subscription");
  const [isYearly, setIsYearly] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const tabItems = [
    { value: "subscription", label: "Subscription" },
    { value: "plans", label: "Plans" },
    { value: "invoices", label: "Invoices" },
  ];

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const subscribed = searchParams.get("subscribed");
    const canceled = searchParams.get("canceled");
    const error = searchParams.get("error");

    const needsFetch = subscribed === "true" || canceled === "true" || error;

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

  const { mutate: createCheckoutSession } = useMutation({
    mutationFn: async ({
      priceId,
      action,
    }: {
      priceId: string;
      action: string;
    }) => {
      let billingData: any = {
        userId: user?._id,
        email: user?.email,
        priceId,
        action,
        usedTrial: false,
      };

      if (billing?.stripeCustomerId) {
        billingData = {
          ...billingData,
          stripeCustomerId: billing?.stripeCustomerId,
        };
      }

      if (billing?.hasUsedTrial || billing?.lastInvoiceStatus === "paid") {
        billingData = {
          ...billingData,
          usedTrial: true,
        };
      }

      const response = await apiRequest(
        "POST",
        "/checkout/create-checkout-session",
        billingData
      );
      window.location.href = response.url;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/checkout/create-checkout-session"],
      });
    },
  });

  const { mutate: cancelSubscription } = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/billing/cancel-subscription", {
        customerId: billing?.stripeCustomerId,
        subscriptionId: billing?.subscriptionId,
      });
    },
    onSuccess: (data) => {
      console.log({ data });
      fetchUserData();
      toast({
        title: "Subscription Cancelled",
        // description:
        //   "Your subscription will remain active until the end of the billing period.",
        description: data.message,
      });
    },
    onError: () => {
      toast({
        title: "Failed to cancel subscription",
        description: "Something went wrong, please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setShowCancelDialog(false);
    },
  });

  const { data: plans = [] } = useQuery({
    queryKey: [`/plans`],
  }) as { data: any[] };

  const { data: invoices = [] } = useQuery({
    queryKey: [`/invoices/user/${user?._id}`],
  }) as { data: any[] };

  const displayedPlans = plans.map((plan) => ({
    ...plan,
    displayPrice: isYearly ? plan.priceYearly : plan.priceMonthly,
    displayPeriod: isYearly ? "yearly" : "monthly",
  }));

  const getStatusBadge = () => {
    switch (billing?.paymentStatus) {
      case "paid":
      case "active":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Active
          </Badge>
        );
      case "trialing":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <ArrowRightCircle className="h-3 w-3 mr-1" /> Trial Active
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

  function determineSubscriptionAction({
    billing,
    currentPlan,
    targetPlan,
  }: {
    billing: any;
    currentPlan: number;
    targetPlan: number;
  }) {
    console.log({ billing, currentPlan, targetPlan });
    let action;

    // If no existing billing, it's always a new subscription
    if (!billing) {
      action = "new_subscription";
      return action;
    }

    // Compare plans to determine action type
    if (targetPlan > currentPlan) {
      action = "upgrade";
    } else if (targetPlan < currentPlan) {
      action = "downgrade";
    } else {
      // Same plan level - treat as new subscription
      action = "new_subscription";
    }

    return action;
  }

  const handleUpgradeDowngrade = (plan: any) => {
    const priceId = isYearly ? plan.priceYearlyId : plan.priceMonthlyId;

    let action: string = "";
    const planId = plan.id;
    const tiers = ["test", "creator", "pro", "enterprise"];

    const currentPlan = tiers.indexOf(billing?.planId);
    const targetPlan = tiers.indexOf(planId);

    action = determineSubscriptionAction({
      billing,
      currentPlan,
      targetPlan,
    });

    console.log({ action });

    createCheckoutSession({ priceId, action });
  };

  const getPlanActionText = (planId: string) => {
    if (!billing?.planId) {
      return "Choose Plan";
    }

    if (billing.planId === planId) return "Current Plan";

    const tiers = ["test", "creator", "pro", "enterprise"];
    const currentIndex = tiers.indexOf(billing.planId);
    const targetIndex = tiers.indexOf(planId);

    if (targetIndex > currentIndex) return "Upgrade";
    if (targetIndex < currentIndex) return "Downgrade";

    return "Current Plan";
  };

  const renderSubscriptionInfo = () => {
    if (!billing?.stripeCustomerId || !billing?.renewalDate) {
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
                {billing?.paymentDescription}
              </h3>
              <div className="flex items-center gap-2 mb-1">
                {getStatusBadge()}
              </div>
              {billing?.renewalDate && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Next billing date:{" "}
                  {formatDate(billing?.renewalDate, "PPP pp")}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                per {billing?.billingInterval}
              </p>
            </div>
          </div>

          {billing?.subscriptionStatus === "active" && (
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
                    <AlertDialogAction onClick={() => cancelSubscription()}>
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
              <div className="flex items-center gap-2 mt-4">
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
                {displayedPlans.map((plan) => {
                  const displayPrice = isYearly
                    ? plan.priceYearly
                    : plan.priceMonthly;
                  const displayPeriod = isYearly ? "yearly" : "monthly";
                  const isCurrentPlan = billing?.productId === plan.productId;

                  return (
                    <div
                      key={plan.id}
                      className={`border rounded-lg p-6 space-y-4 ${
                        plan.isPopular
                          ? "border-primary-500 shadow-lg"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <h3 className="font-bold text-lg capitalize">
                          {plan.name}
                        </h3>
                        {plan.badge && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300">
                            {plan.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold">
                          ${displayPrice}
                        </span>
                        <span className="ml-1 text-gray-500 dark:text-gray-400">
                          {displayPeriod}
                        </span>
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
                        variant={isCurrentPlan ? "secondary" : "default"}
                        onClick={() => handleUpgradeDowngrade(plan)}
                        disabled={isCurrentPlan}
                      >
                        {getPlanActionText(plan.id)}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader className="relative">
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>
                View and download your past invoices
              </CardDescription>
              <Button
                onClick={() =>
                  setViewMode(viewMode === "card" ? "table" : "card")
                }
                variant="default"
                size="sm"
                className="rounded-lg absolute top-3 right-7"
              >
                Switch to {viewMode === "card" ? "Table" : "Card"} View
              </Button>
            </CardHeader>
            <CardContent>
              {viewMode === "card" ? (
                <InvoiceTable invoices={invoices} />
              ) : (
                <InvoiceTableFallback invoices={invoices} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Billing;
