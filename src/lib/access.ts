export function hasValidSubscription(paymentStatus?: string): boolean {
  return paymentStatus === "trialing" || paymentStatus === "active";
}
