import type Stripe from "stripe";
import { stripe, stripeConfigured } from "./stripe";

export type ItemStatus = "available" | "reserved" | "sold";

export type Item = {
  id: string;
  /** Catalogue number, e.g. SK-068. */
  no: string;
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
  category: string;
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
  const m = product.metadata;
  return {
    id: product.id,
    no: m.no ?? "",
    slug: m.slug || slugFor(product),
    name: product.name,
    description: product.description ?? "",
    price: price.unit_amount,
    currency: price.currency,
    images: product.images,
    status: statusOf(product),
    size: m.size ?? "",
    condition: m.condition ?? "",
    brand: m.brand ?? "",
    category: m.category ?? "",
    era: m.era ?? "",
    measurements: m.measurements ?? "",
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

/** Newest first: by catalogue number, then as listed. */
function byNewest(items: Item[]): Item[] {
  return [...items].sort((a, b) => (b.no || "").localeCompare(a.no || ""));
}

/** Everything currently listed: available and reserved pieces, newest first. */
export async function getListedItems(): Promise<Item[]> {
  if (!stripeConfigured()) {
    return byNewest((await localCatalog()).filter((i) => i.status !== "sold"));
  }
  return byNewest(await listStripe(true));
}

/**
 * Sold archive: the Depop history plus anything archived by the webhook after
 * selling through Stripe. A Stripe piece carrying the same catalogue number
 * replaces its Depop record.
 */
export async function getSoldItems(): Promise<Item[]> {
  const history = (await localCatalog()).filter((i) => i.status === "sold");
  if (!stripeConfigured()) return byNewest(history);
  const sold = (await listStripe(false)).filter((i) => i.status === "sold");
  const taken = new Set(sold.map((i) => i.no).filter(Boolean));
  return byNewest([...sold, ...history.filter((i) => !taken.has(i.no))]);
}

export async function getItemBySlug(slug: string): Promise<Item | null> {
  const all = [...(await getListedItems()), ...(await getSoldItems())];
  return all.find((i) => i.slug === slug) ?? null;
}

export { formatPrice } from "./format";
