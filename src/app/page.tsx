import Image from "next/image";
import Link from "next/link";
import { getListedItems, getSoldItems } from "@/lib/catalog";
import { ItemGrid } from "@/components/ItemGrid";
import { SectionHead } from "@/components/SectionHead";

export const revalidate = 60;

export default async function HomePage() {
  const [listed, sold] = await Promise.all([getListedItems(), getSoldItems()]);
  const lead = listed[0] ?? sold[0];

  return (
    <>
      {lead?.images[0] ? (
        <Link href={`/item/${lead.slug}`} className="group block mt-6 sm:mt-8">
          <div className="relative aspect-[4/5] sm:aspect-[16/9] bg-tile overflow-hidden">
            <Image
              src={lead.images[0]}
              alt={lead.name}
              fill
              priority
              sizes="(min-width: 1280px) 1232px, 100vw"
              className="object-cover"
            />
          </div>
          <p className="label text-muted mt-2 group-hover:text-foreground">
            {lead.no} · {lead.name}
          </p>
        </Link>
      ) : null}

      <section className="pt-16">
        <SectionHead label="Available now" count={listed.length} href="/shop" linkLabel="Shop" />
        <ItemGrid items={listed.slice(1, 9)} empty="Nothing listed right now. Check back soon." />
      </section>

      <section className="pt-20">
        <SectionHead label="Archive" count={sold.length} href="/archive" linkLabel="All photos" />
        <ul className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {sold.slice(0, 12).map((i) => (
            <li key={i.id}>
              <Link href={`/item/${i.slug}`} className="block relative aspect-[3/4] bg-tile overflow-hidden" aria-label={i.name}>
                {i.images[0] ? (
                  <Image src={i.images[0]} alt="" fill sizes="(min-width: 640px) 16vw, 33vw" className="object-cover" />
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 py-6 border-y border-line flex flex-wrap items-center justify-between gap-4">
        <p className="label">Studio</p>
        <p className="text-sm text-muted flex-1 min-w-60">Every photo on this site is shot in-house. We shoot for other sellers and brands too.</p>
        <Link href="/studio" className="label hover:underline underline-offset-4">Studio →</Link>
      </section>
    </>
  );
}
