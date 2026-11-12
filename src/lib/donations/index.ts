/**
 * Strategy pattern for online giving. Implement a PaystackProvider or FlutterwaveProvider
 * (NGN) behind this interface once the organisation has a merchant account.
 */
export interface DonationRequest {
  amount: number; // in the smallest currency unit (kobo for NGN)
  currency: "NGN" | "USD";
  email: string;
  name?: string;
}

export interface DonationProvider {
  readonly id: string;
  readonly enabled: boolean;
  createCheckout(request: DonationRequest): Promise<{ checkoutUrl: string }>;
}

class NotConfiguredProvider implements DonationProvider {
  readonly id = "none";
  readonly enabled = false;
  async createCheckout(): Promise<{ checkoutUrl: string }> {
    throw new Error("Online donations are not configured yet.");
  }
}

export const donations: DonationProvider = new NotConfiguredProvider();
