import { NextResponse } from "next/server";
import { RESERVATION_MINUTES, slugFor, statusOf } from "@/lib/catalog";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { allowedCountries, shippingOptions } from "@/lib/shipping";

export const runtime = "nodejs";

/**
 * POST { id: string } → { url: string }
 *
 * Every piece is one-of-one, so before opening Checkout we soft-reserve the
 * product for RESERVATION_MINUTES via metadata. A second buyer in that window
 * gets a 409. The webhook clears the hold if the session expires, or archives
 * the product if it pays.
 */
export async function POST(req: Request) {
  if (!stripeConfigured()) {
    return NextResponse.json(
      { error: "Checkout is not configured yet. Set STRIPE_SECRET_KEY." },
      { status: 503 },
    );
  }

  let id: unknown;
  try {
    ({ id } = await req.json());
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (typeof id !== "string" || !id.startsWith("prod_")) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const s = stripe();
  const product = await s.products.retrieve(id, { expand: ["default_price"] });
  const price = product.default_price;
  if (!price || typeof price === "string") {
    return NextResponse.json({ error: "This piece has no price set." }, { status: 400 });
  }

  const status = statusOf(product);
  if (status === "sold") {
    return NextResponse.json({ error: "Sorry, this piece has sold." }, { status: 409 });
  }
  if (status === "reserved") {
    return NextResponse.json(
      { error: "Someone is checking out with this piece right now. Try again in a few minutes." },
      { status: 409 },
    );
  }

  const expiresAt = Math.floor(Date.now() / 1000) + RESERVATION_MINUTES * 60;
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  const slug = product.metadata.slug || slugFor(product);

  // Hold first, then open the session. If session creation fails the hold
  // simply lapses after RESERVATION_MINUTES.
  await s.products.update(product.id, {
    metadata: { reserved_until: String(expiresAt) },
  });

  const session = await s.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: price.id, quantity: 1 }],
    expires_at: expiresAt,
    shipping_address_collection: { allowed_countries: allowedCountries },
    shipping_options: shippingOptions,
    phone_number_collection: { enabled: true },
    metadata: { product_id: product.id },
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/item/${slug}`,
  });

  return NextResponse.json({ url: session.url });
}
