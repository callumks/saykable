export const site = {
  name: "saykable",
  tagline: "Archive & technical clothing.",
  location: "New York City",
  shipping: "Ships worldwide, same or next day.",
  currency: "usd",
  // Track record carried over from the Depop shop. Set to null to hide the strip.
  proof: {
    sold: 45,
    reviews: 27,
    followers: "1.08K",
  } as { sold: number; reviews: number; followers: string } | null,
  contact: {
    email: "hello@example.com",
    instagram: "sayba",
  },
} as const;
