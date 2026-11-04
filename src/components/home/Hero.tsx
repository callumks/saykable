"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Item } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export type HeroShot = { src: string; alt: string; item: Item | null };

/**
 * Worn shots side by side. Hovering one widens it and quietens the other.
 * Phones show only the first shot, full width.
 */
export function Hero({ shots }: { shots: HeroShot[] }) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <ul className="flex gap-3 h-[min(72svh,880px)] min-h-[420px]" onMouseLeave={() => setHover(null)}>
      {shots.map((s, n) => {
        const on = hover === n;
        const dim = hover !== null && !on;
        const item = s.item;
        return (
          <li
            key={s.src}
            className={`${n > 0 ? "hidden sm:flex" : "flex"} flex-col min-w-0 rise-in`}
            style={{
              flex: on ? "1.45 1 0%" : "1 1 0%",
              transition: "flex 1.1s var(--ease)",
              animationDelay: `${0.08 + n * 0.08}s`,
            }}
            onMouseEnter={() => setHover(n)}
          >
            <Link href={item ? `/item/${item.slug}` : "/#archive"} className="group flex flex-col flex-1 min-h-0">
              <div className="relative flex-1 min-h-0 overflow-hidden rounded-photo bg-tile blur-in">
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  priority
                  sizes="(min-width: 640px) 60vw, 100vw"
                  className="object-cover object-[center_30%]"
                  style={{
                    transform: on ? "scale(1)" : "scale(1.04)",
                    filter: dim ? "saturate(.5) brightness(.94)" : "none",
                    transition: "transform 1.4s var(--ease), filter .8s ease",
                  }}
                />
              </div>
              {item ? (
                <p className="mt-2 flex items-baseline gap-3 text-[13px] min-w-0">
                  <span className="font-mono text-[11px] text-muted shrink-0">{item.no}</span>
                  <span className="truncate">{item.name}</span>
                  <span className="ml-auto tabular-nums shrink-0">
                    {item.status === "sold" ? "Sold" : formatPrice(item.price, item.currency)}
                  </span>
                </p>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
