import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Item } from "@/lib/catalog";

export function ItemCard({ item, priority = false }: { item: Item; priority?: boolean }) {
  const sold = item.status === "sold";
  return (
    <Link href={`/item/${item.slug}`} className="group block">
      <div className="relative aspect-[3/4] bg-tile overflow-hidden">
        {item.images[0] ? (
          <Image
            src={item.images[0]}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            priority={priority}
            className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${sold ? "opacity-60" : ""}`}
          />
        ) : null}
        {item.status !== "available" ? (
          <span className="label absolute top-2 left-2 bg-background px-2 py-1">
            {item.status}
          </span>
        ) : null}
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <p className="text-sm leading-tight truncate">{item.name}</p>
        <p className={`text-sm tabular-nums shrink-0 ${sold ? "line-through text-muted" : ""}`}>
          {formatPrice(item.price, item.currency)}
        </p>
      </div>
      <p className="label text-muted mt-1">{[item.brand, item.size].filter(Boolean).join(" · ")}</p>
    </Link>
  );
}
