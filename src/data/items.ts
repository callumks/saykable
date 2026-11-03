import type { Item } from "@/lib/catalog";
import depop from "./depop.json";

/**
 * The catalogue carried over from the Depop shop (depop.com/sayba_853), imported
 * November 2026. Photos are the original listing photos, saved under
 * public/items/depop/. Catalogue numbers run oldest to newest by upload order.
 *
 * Available pieces are shown from here only while Stripe is not configured; once
 * it is, list them with `npm run seed:stripe`. Sold pieces always show in the
 * archive, alongside anything that sells through Stripe.
 */
export const localItems = depop as Item[];
