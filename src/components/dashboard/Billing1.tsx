import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../../lib/queryClient";
import { useAuth } from "../../store/hooks";
import { useToast } from "../../hooks/use-toast";
import { Loader2 } from "lucide-react";

const Billing = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { mutate: createCheckoutSession, isPending: isCreatingPending } =
    useMutation({
      mutationFn: async () => {
        const response = await apiRequest(
          "POST",
          "/checkout/create-checkout-session",
          {
            userId: user?._id,
            email: user?.email,
          }
        );
        console.log({ response });
        window.location.href = response.url;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["/checkout/create-checkout-session"],
        });
      },
    });

  const {
    mutate: createBillingPortalUrl,
    isPending: isCreatingBillingPortalUrl,
  } = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/billing/billing-portal", {
        customerId: user?.stripeCustomerId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/billing/billing-portal"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create billing portal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const loading = isCreatingPending || isCreatingBillingPortalUrl;

  return (
    <div className="max-w-xl space-y-6">
      {loading && <Loader2 className="animate-spin" />}
      <div>
        <h2 className="text-2xl font-bold">Billing</h2>
        <p className="text-muted-foreground">
          Manage your billing and subscription
        </p>
      </div>

      {user?.stripeCustomerId ? (
        <button
          onClick={() => createBillingPortalUrl()}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
        >
          Manage Billing
        </button>
      ) : (
        <button
          onClick={() => createCheckoutSession()}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
        >
          Subscribe Now
        </button>
      )}
    </div>
  );
};

export default Billing;
