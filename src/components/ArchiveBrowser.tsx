"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Item } from "@/lib/catalog";
import { Select, Tabs, countBy } from "./Chip";

/**
 * Photo-only lookbook of sold pieces: a dense, tight grid with no captions.
 * The catalogue number shows on hover or focus; names, prices and details live
 * on the item page.
 */
export function ArchiveBrowser({ items }: { items: Item[] }) {
  const [cat, setCat] = useState("All");
  const [brand, setBrand] = useState("All");

  const cats = useMemo(() => countBy(items, (i) => i.category), [items]);
  const brands = useMemo(
    () => [...new Set(items.map((i) => i.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [items],
  );
  const shown = useMemo(
    () => items.filter((i) => (cat === "All" || i.category === cat) && (brand === "All" || i.brand === brand)),
    [items, cat, brand],
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-x-8 gap-y-2 pb-3 border-b border-line">
        <Tabs label="Category" value={cat} onChange={setCat} options={cats} />
        <div className="sm:w-48 shrink-0">
          <Select
            label="Brand"
            value={brand}
            onChange={setBrand}
            options={[{ value: "All", label: "Brand: all" }, ...brands.map((b) => ({ value: b, label: b }))]}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 min-h-11 mb-2">
        <p className="label text-muted" aria-live="polite">
          <span className="tabular-nums">{shown.length}</span> sold
        </p>
        {brand !== "All" || cat !== "All" ? (
          <button
            type="button"
            onClick={() => {
              setCat("All");
              setBrand("All");
            }}
            className="label h-11 underline underline-offset-4"
          >
            Clear
          </button>
        ) : null}
      </div>

      {shown.length === 0 ? (
        <p className="text-muted py-16 text-center">Nothing in the archive yet.</p>
      ) : (
        <ul className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-1 sm:gap-2">
          {shown.map((i, n) => (
            <li key={i.id}>
              <Link
                href={`/item/${i.slug}`}
                className="group relative block aspect-[3/4] bg-tile overflow-hidden"
                aria-label={[i.no, i.name].filter(Boolean).join(" ")}
              >
                {i.images[0] ? (
                  <Image
                    src={i.images[0]}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 150px, (min-width: 1024px) 12vw, (min-width: 640px) 20vw, 33vw"
                    priority={n < 8}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                ) : null}
                {i.no ? (
                  <span className="label absolute top-1 left-1 bg-background px-1.5 py-0.5 tabular-nums opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                    {i.no}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
