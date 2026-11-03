import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Stripe webhook. Register the endpoint for:
 *   checkout.session.completed  → mark the product sold (archive it)
 *   checkout.session.expired    → release the reservation hold
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await req.text(), signature, secret);
  } catch (err) {
    return NextResponse.json(
      { error: `Invalid signature: ${(err as Error).message}` },
      { status: 400 },
    );
  }

  const s = stripe();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const productId = session.metadata?.product_id;
      if (productId) {
        await s.products.update(productId, {
          active: false,
          metadata: {
            status: "sold",
            sold_at: String(Math.floor(Date.now() / 1000)),
            reserved_until: "",
            order_session: session.id,
          },
        });
      }
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;
      const productId = session.metadata?.product_id;
      if (productId) {
        await s.products.update(productId, { metadata: { reserved_until: "" } });
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
