import type { Metadata } from "next";
import Link from "next/link";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Order confirmed" };

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function SuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;
  let email: string | null = null;
  let itemName: string | null = null;

  if (session_id && stripeConfigured()) {
    try {
      const session = await stripe().checkout.sessions.retrieve(session_id, {
        expand: ["line_items"],
      });
      email = session.customer_details?.email ?? null;
      itemName = session.line_items?.data[0]?.description ?? null;
    } catch {
      // Fall through to the generic message.
    }
  }

  return (
    <section className="pt-16 max-w-xl">
      <p className="label text-muted mb-3">Order confirmed</p>
      <h1 className="text-3xl leading-tight">
        {itemName ? `${itemName} is yours.` : "Thank you, it's yours."}
      </h1>
      <p className="mt-4 text-muted leading-relaxed">
        {email ? `A receipt is on its way to ${email}. ` : "A receipt is on its way to you. "}
        {site.shipping} You&apos;ll get tracking as soon as it leaves {site.location}.
      </p>
      <Link href="/" className="label inline-block mt-10 underline underline-offset-4">
        Back to the shop
      </Link>
    </section>
  );
}
