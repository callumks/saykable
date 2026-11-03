import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getItemBySlug } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { BuyButton } from "@/components/BuyButton";
import { site } from "@/lib/site";

export const revalidate = 30;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) return { title: "Not found" };
  return {
    title: `${item.no} ${item.name}`.trim(),
    description: item.description || `${item.name} — ${formatPrice(item.price, item.currency)}`,
    openGraph: { images: item.images.slice(0, 1) },
  };
}

export default async function ItemPage({ params }: Props) {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) notFound();
  const sold = item.status === "sold";

  const facts: [string, string][] = [
    ["No.", item.no],
    ["Brand", item.brand],
    ["Size", item.size],
    ["Condition", item.condition],
    ["Era", item.era],
    ["Category", item.category],
    ["Measurements", item.measurements],
  ];

  return (
    <article className="pt-8 grid gap-10 lg:grid-cols-[3fr_2fr]">
      <div className="grid gap-3 sm:grid-cols-2">
        {item.images.length === 0 ? <div className="aspect-[3/4] bg-tile" /> : null}
        {item.images.map((src, i) => (
          <div key={src} className={`relative aspect-[3/4] bg-tile ${i === 0 ? "sm:col-span-2" : ""}`}>
            <Image
              src={src}
              alt={`${item.name}, photo ${i + 1}`}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              priority={i === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="lg:sticky lg:top-20 self-start">
        <Link href={sold ? "/archive" : "/shop"} className="label text-muted hover:underline underline-offset-4">
          ← {sold ? "Archive" : "Shop"}
        </Link>
        <p className="label text-muted mt-6">{item.no}</p>
        <h1 className="text-3xl mt-1 leading-tight">{item.name}</h1>
        <p className={`text-xl mt-2 tabular-nums ${sold ? "line-through text-muted" : ""}`}>
          {formatPrice(item.price, item.currency)}
        </p>

        <div className="mt-8">
          <BuyButton id={item.id} status={item.status} label="Buy now" />
          <p className="label text-muted mt-3">
            {sold
              ? "Sold · ask about similar pieces by DM or email"
              : `One of one · shipping calculated at checkout · ${site.shipping.toLowerCase()}`}
          </p>
        </div>

        {item.description ? <p className="mt-8 text-base leading-relaxed">{item.description}</p> : null}

        <dl className="mt-8 border-t border-line">
          {facts
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 py-3 border-b border-line text-sm">
                <dt className="label text-muted self-center">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
        </dl>
      </div>
    </article>
  );
}
