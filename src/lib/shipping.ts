import type Stripe from "stripe";

// Flat shipping rates, in cents. Edit freely; Stripe creates the rate objects on the fly.
export const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [
  {
    shipping_rate_data: {
      type: "fixed_amount",
      display_name: "US tracked (2–5 days)",
      fixed_amount: { amount: 1200, currency: "usd" },
      delivery_estimate: {
        minimum: { unit: "business_day", value: 2 },
        maximum: { unit: "business_day", value: 5 },
      },
    },
  },
  {
    shipping_rate_data: {
      type: "fixed_amount",
      display_name: "International tracked (5–14 days)",
      fixed_amount: { amount: 3500, currency: "usd" },
      delivery_estimate: {
        minimum: { unit: "business_day", value: 5 },
        maximum: { unit: "business_day", value: 14 },
      },
    },
  },
];

// Countries Checkout will accept a shipping address for. Extend as needed;
// Stripe accepts any ISO 3166-1 alpha-2 code except a handful of sanctioned ones.
export const allowedCountries: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] =
  [
    "US", "CA", "MX", "GB", "IE", "FR", "DE", "NL", "BE", "ES", "PT", "IT", "CH", "AT",
    "SE", "NO", "DK", "FI", "PL", "CZ", "GR", "AU", "NZ", "JP", "KR", "SG", "HK", "TW",
    "TH", "MY", "PH", "ID", "IN", "AE", "IL", "BR", "AR", "CL", "CO", "ZA",
  ];
