# saykable

Storefront for an archive and technical clothing shop, previously run on Depop. Every piece is one of one.

Next.js (App Router) · Tailwind · Stripe Checkout. Stripe's product catalogue is the inventory, so there is no database and no admin panel to build: list pieces in the Stripe dashboard, and the site and checkout read from there.

## Run it

```bash
cp .env.example .env.local   # add your Stripe keys, or leave blank for placeholder mode
npm install
npm run dev
```

With no `STRIPE_SECRET_KEY` the site shows the placeholder catalogue in `src/data/items.ts` and the buy button returns a "not configured" message.

## Listing a piece

In Stripe → Product catalogue → Add product:

| Field | Use |
| --- | --- |
| Name | Shown as the title. Slug is derived from it. |
| Description | Shown on the item page. |
| Images | Up to 8. First one is the tile. Shoot on the same grey backdrop. |
| Price | One-time, USD. |
| Metadata | Optional keys: `brand`, `size`, `condition`, `era`, `measurements`, `slug`. |

Archive the product in Stripe to take it down manually. The webhook archives it automatically when it sells.

## How a sale works

1. Buyer hits **Buy now**. `POST /api/checkout` checks the product is still available, writes `reserved_until` (now + 30 min) to its metadata, then opens a Stripe Checkout Session that expires at the same time.
2. While that hold exists the item shows as **Reserved** and a second buyer gets a 409.
3. Stripe calls `POST /api/webhook`:
   - `checkout.session.completed` → product set `active: false`, `status: sold`. It moves to `/sold`.
   - `checkout.session.expired` → `reserved_until` cleared. It's available again.

Shipping is collected by Checkout with flat rates defined in `src/lib/shipping.ts`. Tax is not configured; enable Stripe Tax in the dashboard if needed.

## Webhook setup

Local:

```bash
stripe listen --forward-to localhost:3000/api/webhook
# paste the printed whsec_... into STRIPE_WEBHOOK_SECRET
```

Production: Stripe → Developers → Webhooks → add `https://yourdomain/api/webhook` with the two `checkout.session.*` events above, and set the signing secret in the host's environment.

## Deploy

Any Node host works (Vercel, Railway, Fly). Set the three env vars from `.env.example`. Pages revalidate every 30–60 s, so a new listing appears within a minute without a redeploy.

## Editing the brand

`src/lib/site.ts` holds the name, tagline, location, contact details and the proof strip. `src/app/globals.css` holds the colours; the mint accent is taken from the shop logo.
