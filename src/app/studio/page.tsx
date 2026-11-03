import type { Metadata } from "next";
import Image from "next/image";
import { getListedItems, getSoldItems } from "@/lib/catalog";
import { site } from "@/lib/site";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Studio",
  description: "Product photography for resellers and brands, shot the way every piece on saykable is shot.",
};

const set = [
  ["Cover", "The whole piece, centred on a grey backdrop, cropped to work as a tile on any marketplace."],
  ["Details", "Logos, hardware, labels, fabric and any flaws, so buyers don't have to ask."],
  ["Formats", "Delivered in 3:4 and 1:1 for Depop, Grailed, eBay, Vinted and your own site."],
] as const;

export default async function StudioPage() {
  const [listed, sold] = await Promise.all([getListedItems(), getSoldItems()]);
  const work = [...listed, ...sold].filter((i) => i.images[0]).slice(0, 8);
  const subject = encodeURIComponent("Studio enquiry");
  const price = site.studio.priceFrom != null ? `From $${site.studio.priceFrom} per piece` : "Pricing on request";

  return (
    <>
      <section className="pt-10 pb-12 grid gap-10 lg:grid-cols-[2fr_3fr] lg:items-end border-b border-line">
        <div>
          <h1 className="label mb-4">Studio</h1>
          <p className="text-3xl leading-tight max-w-md">Product photography for resellers and brands.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <dl className="label text-muted grid gap-1">
            <div><dt className="sr-only">Price</dt><dd className="text-foreground">{price}</dd></div>
            {site.studio.turnaround ? (
              <div><dt className="sr-only">Turnaround</dt><dd>{site.studio.turnaround}</dd></div>
            ) : null}
            <div><dt className="sr-only">Location</dt><dd>{site.location}</dd></div>
          </dl>
          <a
            href={`mailto:${site.contact.email}?subject=${subject}`}
            className="label inline-flex items-center justify-center h-12 px-6 bg-foreground text-background hover:bg-accent hover:text-foreground transition-colors"
          >
            Enquire
          </a>
        </div>
      </section>

      <section className="pt-10">
        <h2 className="label mb-6">Work</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6">
          {work.map((i) => (
            <li key={i.id}>
              <div className="relative aspect-[3/4] bg-tile overflow-hidden">
                <Image src={i.images[0]} alt={i.name} fill sizes="(min-width: 640px) 25vw, 50vw" className="object-cover" />
              </div>
              <p className="label text-muted mt-2">{i.no}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="pt-16">
        <h2 className="label mb-6">The set</h2>
        <dl className="border-t border-line">
          {set.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 py-4 border-b border-line text-sm">
              <dt className="label text-muted self-center">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <p className="text-sm text-muted mt-6 max-w-xl">
          Send pieces to us in {site.location}, or book a session. Email{" "}
          <a className="text-foreground underline underline-offset-4" href={`mailto:${site.contact.email}?subject=${subject}`}>
            {site.contact.email}
          </a>{" "}
          or DM{" "}
          <a className="text-foreground underline underline-offset-4" href={`https://instagram.com/${site.contact.instagram}`} target="_blank" rel="noreferrer">
            @{site.contact.instagram}
          </a>
          .
        </p>
      </section>
    </>
  );
}
