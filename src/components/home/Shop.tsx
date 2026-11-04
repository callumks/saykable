"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Item } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

/** Category tabs that stick under the header, then the available pieces. */
export function Shop({ items, soldCount }: { items: Item[]; soldCount: number }) {
  const cats = ["All", ...[...new Set(items.map((i) => i.category).filter(Boolean))].sort()];
  const [cat, setCat] = useState("All");
  const list = cat === "All" ? items : items.filter((i) => i.category === cat);

  return (
    <>
      <div className="sticky top-14 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-background/85 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3 border-t border-line text-[13px]">
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Category">
            {cats.map((c) => {
              const n = c === "All" ? items.length : items.filter((i) => i.category === c).length;
              const on = c === cat;
              return (
                <button
                  key={c}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setCat(c)}
                  className={`rounded-full px-3 py-1 transition-colors duration-200 ${
                    on ? "bg-foreground text-background" : "text-muted hover:text-foreground hover:bg-tile"
                  }`}
                >
                  {c}
                  <sup className="font-mono text-[10px] ml-1">{n}</sup>
                </button>
              );
            })}
          </div>
          <a href="#archive" className="hidden sm:inline text-muted hover:text-foreground">
            Archive {soldCount} ↓
          </a>
        </div>
      </div>

      {list.length ? (
        <ul className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-10">
          {list.map((it) => (
            <li key={it.id} className="min-w-0">
              <Card item={it} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 text-sm text-muted">Nothing listed right now. Check back soon.</p>
      )}
    </>
  );
}

function Card({ item }: { item: Item }) {
  const [a, b] = item.images;
  const reserved = item.status === "reserved";
  return (
    <Link href={`/item/${item.slug}`} className="group flex flex-col gap-2.5 min-w-0">
      <div className="relative aspect-[4/5] overflow-hidden rounded-photo bg-tile">
        {a ? (
          <Image src={a} alt={item.name} fill sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" className="object-cover" />
        ) : null}
        {b ? (
          <Image
            src={b}
            alt=""
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300 motion-reduce:transition-none"
          />
        ) : null}
        <span className="absolute left-2 top-2 rounded-full bg-background/90 px-2 py-0.5 font-mono text-[10px] sm:text-[11px]">{item.no}</span>
        {reserved ? (
          <span className="absolute right-2 top-2 rounded-full bg-foreground text-background px-2 py-0.5 font-mono text-[10px] sm:text-[11px]">
            Reserved
          </span>
        ) : null}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-4 text-[13px] sm:text-sm">
        <p className="font-medium leading-snug line-clamp-2 sm:line-clamp-none min-w-0">{item.name}</p>
        <p className="tabular-nums shrink-0">{formatPrice(item.price, item.currency)}</p>
      </div>
      <p className="-mt-1.5 font-mono text-[11px] sm:text-xs text-muted truncate">
        {[item.size, item.era].filter(Boolean).join("  ·  ")}
      </p>
    </Link>
  );
}
