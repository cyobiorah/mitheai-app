export function hasValidSubscription(paymentStatus?: string): boolean {
  // if (import.meta.env.VITE_APP_ENV === "production") return true;
  return paymentStatus === "trialing" || paymentStatus === "active";
}
