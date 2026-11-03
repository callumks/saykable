import type Stripe from "stripe";
import { stripe, stripeConfigured } from "./stripe";

export type ItemStatus = "available" | "reserved" | "sold";

export type Item = {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Minor units (cents). */
  price: number;
  currency: string;
  images: string[];
  status: ItemStatus;
  size: string;
  condition: string;
  brand: string;
  era: string;
  measurements: string;
};

export const RESERVATION_MINUTES = 30;

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Stable, readable slug: name plus the tail of the Stripe product id. */
export function slugFor(product: Pick<Stripe.Product, "id" | "name">): string {
  return `${slugify(product.name)}-${product.id.slice(-6).toLowerCase()}`;
}

export function statusOf(product: Stripe.Product, now = Date.now()): ItemStatus {
  if (!product.active || product.metadata.status === "sold") return "sold";
  const until = Number(product.metadata.reserved_until ?? 0) * 1000;
  if (until > now) return "reserved";
  return "available";
}

function fromStripe(product: Stripe.Product): Item | null {
  const price = product.default_price;
  if (!price || typeof price === "string" || price.unit_amount == null) return null;
  return {
    id: product.id,
    slug: product.metadata.slug || slugFor(product),
    name: product.name,
    description: product.description ?? "",
    price: price.unit_amount,
    currency: price.currency,
    images: product.images,
    status: statusOf(product),
    size: product.metadata.size ?? "",
    condition: product.metadata.condition ?? "",
    brand: product.metadata.brand ?? "",
    era: product.metadata.era ?? "",
    measurements: product.metadata.measurements ?? "",
  };
}

async function listStripe(active: boolean): Promise<Item[]> {
  const items: Item[] = [];
  for await (const product of stripe().products.list({
    active,
    limit: 100,
    expand: ["data.default_price"],
  })) {
    const item = fromStripe(product);
    if (item) items.push(item);
  }
  return items;
}

async function localCatalog(): Promise<Item[]> {
  const { localItems } = await import("@/data/items");
  return localItems;
}

/** Everything currently listed: available and reserved pieces, newest first. */
export async function getListedItems(): Promise<Item[]> {
  if (!stripeConfigured()) {
    return (await localCatalog()).filter((i) => i.status !== "sold");
  }
  return listStripe(true);
}

/** Sold archive. Products are archived (active=false) by the webhook when they sell. */
export async function getSoldItems(): Promise<Item[]> {
  if (!stripeConfigured()) {
    return (await localCatalog()).filter((i) => i.status === "sold");
  }
  return (await listStripe(false)).filter((i) => i.status === "sold");
}

export async function getItemBySlug(slug: string): Promise<Item | null> {
  const all = [...(await getListedItems()), ...(await getSoldItems())];
  return all.find((i) => i.slug === slug) ?? null;
}

export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: amount % 100 === 0 ? 0 : 2,
  }).format(amount / 100);
}
