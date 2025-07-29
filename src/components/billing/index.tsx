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
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../../lib/queryClient";
import { Switch } from "../ui/switch";
import { InvoiceGrid } from "./InvoiceGrid";
import { InvoiceTableFallback } from "./InvoiceTableFallback";
import Subscriptions from "./Subscriptions";
import Plans from "./Plans";

const Billing = () => {
  const { user, fetchUserData } = useAuth();
  const { billing } = user;
  const { toast } = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("subscription");
  const [billingInterval, setBillingInterval] = useState("monthly");
  const [viewMode, setViewMode] = useState<"card" | "table">("table");

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
        billingInterval,
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
    displayPrice:
      billingInterval === "yearly" ? plan.priceYearly : plan.priceMonthly,
    displayPeriod: billingInterval,
  }));

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
    const priceId =
      billingInterval === "yearly" ? plan.priceYearlyId : plan.priceMonthlyId;

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

    // if (action === "upgrade") {
    //   console.log("upgrading");
    //   return;
    // }

    createCheckoutSession({ priceId, action });
  };

  console.log({ billing });

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
            <CardContent>
              <Subscriptions
                billing={billing || {}}
                showCancelDialog={showCancelDialog}
                setShowCancelDialog={setShowCancelDialog}
                cancelSubscription={cancelSubscription}
                setActiveTab={setActiveTab}
              />
            </CardContent>
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
                <span
                  className={billingInterval === "monthly" ? "font-bold" : ""}
                >
                  Monthly
                </span>
                <Switch
                  checked={billingInterval === "yearly"}
                  onCheckedChange={(value) =>
                    setBillingInterval(value ? "yearly" : "monthly")
                  }
                  aria-label="Toggle yearly billing"
                />
                <span
                  className={billingInterval === "yearly" ? "font-bold" : ""}
                >
                  Yearly
                </span>
              </div>
            </CardHeader>

            <CardContent>
              <Plans
                displayedPlans={displayedPlans}
                isYearly={billingInterval === "yearly"}
                billing={billing}
                handleUpgradeDowngrade={handleUpgradeDowngrade}
              />
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
                className="hidden lg:block rounded-lg absolute top-3 right-7"
              >
                Switch to {viewMode === "card" ? "Table" : "Card"} View
              </Button>
            </CardHeader>
            <CardContent>
              {viewMode === "card" ? (
                <InvoiceGrid invoices={invoices} />
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
