import Image from "next/image";
import Link from "next/link";
import { getListedItems, getSoldItems } from "@/lib/catalog";
import { ItemGrid } from "@/components/ItemGrid";
import { SectionHead } from "@/components/SectionHead";

export const revalidate = 60;

/** Worn shots, shot in-house against the white wall. The first one is the only one shown on phones. */
const hero = [
  { src: "/hero/sk-027-worn.jpg", no: "SK-027", alt: "Grey Arc’teryx shell, hood up, worn with a crossbody bag" },
  { src: "/hero/sk-026-worn.jpg", no: "SK-026", alt: "Two-tone green Arc’teryx shell, hood up" },
];

export default async function HomePage() {
  const [listed, sold] = await Promise.all([getListedItems(), getSoldItems()]);
  const byNo = new Map([...listed, ...sold].map((i) => [i.no, i]));

  return (
    <>
      <section className="mt-6 sm:mt-8" aria-label="Lookbook">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {hero.map((h, n) => {
            const item = byNo.get(h.no);
            return (
              <li key={h.src} className={n > 0 ? "hidden sm:block" : undefined}>
                <Link href={item ? `/item/${item.slug}` : "/archive"} className="group block">
                  <div className="relative aspect-square bg-tile overflow-hidden">
                    <Image
                      src={h.src}
                      alt={h.alt}
                      fill
                      priority
                      sizes="(min-width: 1280px) 612px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <p className="label text-muted mt-2 group-hover:text-foreground truncate">
                    {[h.no, item?.name, item?.status === "sold" ? "Sold" : null].filter(Boolean).join(" · ")}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="pt-16">
        <SectionHead label="Available now" count={listed.length} href="/shop" linkLabel="Shop" />
        <ItemGrid items={listed.slice(0, 8)} empty="Nothing listed right now. Check back soon." />
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
