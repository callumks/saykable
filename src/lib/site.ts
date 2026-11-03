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
    email: "saykable@gmail.com",
    instagram: "saykable",
  },
  depop: "https://www.depop.com/sayba_853/",
  studio: {
    /** Starting price per piece in USD, e.g. 25. null shows "Pricing on request". */
    priceFrom: null as number | null,
    /** e.g. "3–5 working days". null hides the line. */
    turnaround: null as string | null,
  },
} as const;
