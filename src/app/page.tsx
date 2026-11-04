import Image from "next/image";
import Link from "next/link";
import { getListedItems, getSoldItems } from "@/lib/catalog";
import { Hero, type HeroShot } from "@/components/home/Hero";
import { Shop } from "@/components/home/Shop";
import { site } from "@/lib/site";

export const revalidate = 60;

/** Worn shots, shot in-house against the white wall. Phones show the first one only. */
const worn = [
  { src: "/hero/sk-027-worn.jpg", no: "SK-027", alt: "Grey Arc’teryx shell, hood up, worn with a crossbody bag" },
  { src: "/hero/sk-026-worn.jpg", no: "SK-026", alt: "Two-tone green Arc’teryx shell, hood up" },
];

export default async function HomePage() {
  const [listed, sold] = await Promise.all([getListedItems(), getSoldItems()]);
  const byNo = new Map([...listed, ...sold].map((i) => [i.no, i]));
  const shots: HeroShot[] = worn.map((w) => ({ src: w.src, alt: w.alt, item: byNo.get(w.no) ?? null }));

  return (
    <>
      <section className="pt-2 sm:pt-4" aria-label="Lookbook">
        <Hero shots={shots} />
        <div className="h-16 sm:h-[72px] flex items-center justify-between gap-4 font-mono text-xs text-muted">
          <span>{site.tagline.replace(/\.$/, "")}</span>
          <a href="#shop" className="text-foreground hover:underline underline-offset-4">
            Shop {listed.length} pieces ↓
          </a>
        </div>
      </section>

      <section id="shop" className="scroll-mt-14 pb-24 sm:pb-36" aria-label="Shop">
        <Shop items={listed} soldCount={sold.length} />
      </section>

      <section id="archive" className="scroll-mt-14 border-t border-line pt-7 pb-24 sm:pb-36" aria-label="Archive">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-7">
          <h2 className="text-[clamp(28px,3vw,44px)] font-medium leading-none tracking-[-0.04em]">Archive</h2>
          <span className="font-mono text-xs text-muted">{sold.length} pieces, all sold</span>
        </div>
        <ul className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-9 gap-x-2 gap-y-4 sm:gap-y-5">
          {sold.map((i) => (
            <li key={i.id} className="min-w-0">
              <Link href={`/item/${i.slug}`} className="group flex flex-col gap-1.5" aria-label={`${i.no}, ${i.name}, sold`}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[10px] bg-tile">
                  {i.images[0] ? (
                    <Image
                      src={i.images[0]}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 11vw, (min-width: 640px) 16vw, 25vw"
                      className="object-cover grayscale opacity-70 transition-[filter,opacity,transform] duration-700 ease-[var(--ease)] group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.04] group-focus-visible:grayscale-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
                    />
                  ) : null}
                </div>
                <span className="font-mono text-[10px] sm:text-[11px] text-muted group-hover:text-foreground truncate">{i.no}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
