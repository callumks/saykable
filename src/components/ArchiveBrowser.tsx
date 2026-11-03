"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Item } from "@/lib/catalog";
import { Chip } from "./Chip";

/** Photo-only archive. Names, prices and details live on the item page. */
export function ArchiveBrowser({ items }: { items: Item[] }) {
  const [cat, setCat] = useState("All");
  const cats = useMemo(() => ["All", ...new Set(items.map((i) => i.category).filter(Boolean))], [items]);
  const shown = useMemo(() => items.filter((i) => cat === "All" || i.category === cat), [items, cat]);

  return (
    <>
      <div role="group" aria-label="Category" className="flex flex-wrap gap-2 py-4 border-y border-line">
        {cats.map((c) => (
          <Chip key={c} on={cat === c} onClick={() => setCat(c)}>
            {c}
          </Chip>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="text-muted py-16 text-center">Nothing in the archive yet.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
          {shown.map((i, n) => (
            <li key={i.id}>
              <Link href={`/item/${i.slug}`} className="group block" aria-label={`${i.no} ${i.name}`}>
                <div className="relative aspect-[3/4] bg-tile overflow-hidden">
                  {i.images[0] ? (
                    <Image
                      src={i.images[0]}
                      alt={i.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      priority={n < 4}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  ) : null}
                </div>
                <p className="label text-muted mt-2 group-hover:text-foreground tabular-nums">{i.no}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
