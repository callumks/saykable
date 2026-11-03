// List the available Depop pieces as Stripe products, so checkout works for them.
//
//   STRIPE_SECRET_KEY=sk_... NEXT_PUBLIC_SITE_URL=https://yourdomain npm run seed:stripe
//
// Images must be publicly reachable, so run this after the site is deployed.
// Safe to re-run: a piece whose catalogue number is already in Stripe is skipped.
import { readFileSync } from "node:fs";
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
const site = process.env.NEXT_PUBLIC_SITE_URL;
if (!key || !site) {
  console.error("Set STRIPE_SECRET_KEY and NEXT_PUBLIC_SITE_URL.");
  process.exit(1);
}
const stripe = new Stripe(key);
const items = JSON.parse(readFileSync(new URL("../src/data/depop.json", import.meta.url), "utf8"));

for (const item of items.filter((i) => i.status === "available")) {
  const found = await stripe.products.search({ query: `metadata['no']:'${item.no}'` });
  if (found.data.length) {
    console.log(`skip   ${item.no} ${item.name}`);
    continue;
  }
  await stripe.products.create({
    name: item.name,
    description: item.description || undefined,
    images: item.images.slice(0, 8).map((p) => new URL(p, site).toString()),
    default_price_data: { currency: item.currency, unit_amount: item.price },
    metadata: {
      no: item.no,
      slug: item.slug,
      brand: item.brand,
      size: item.size,
      condition: item.condition,
      category: item.category,
      era: item.era,
    },
  });
  console.log(`listed ${item.no} ${item.name}`);
}
