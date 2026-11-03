import { getListedItems } from "@/lib/catalog";
import { ItemGrid } from "@/components/ItemGrid";
import { site } from "@/lib/site";

export const revalidate = 60;

export default async function HomePage() {
  const items = await getListedItems();
  return (
    <>
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16 border-b border-line">
        <h1 className="wordmark text-[18vw] sm:text-[11rem] leading-none select-none">{site.name}</h1>
        <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <p className="text-lg sm:text-2xl max-w-xl leading-snug">
            {site.tagline} Sourced in {site.location}. {site.shipping}
          </p>
          {site.proof ? (
            <dl className="label text-muted flex gap-6">
              <div>
                <dt className="sr-only">Sold</dt>
                <dd><span className="text-foreground">{site.proof.sold}</span> sold</dd>
              </div>
              <div>
                <dt className="sr-only">Reviews</dt>
                <dd><span className="text-foreground">{site.proof.reviews}</span> five-star reviews</dd>
              </div>
              <div>
                <dt className="sr-only">Followers</dt>
                <dd><span className="text-foreground">{site.proof.followers}</span> followers</dd>
              </div>
            </dl>
          ) : null}
        </div>
      </section>

      <section className="pt-10">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="label">Available now</h2>
          <p className="label text-muted">{items.length} pieces</p>
        </div>
        <ItemGrid items={items} empty="Nothing listed right now. Check back soon." />
      </section>
    </>
  );
}
