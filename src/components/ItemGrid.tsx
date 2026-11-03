import type { Item } from "@/lib/catalog";
import { ItemCard } from "./ItemCard";

export function ItemGrid({ items, empty }: { items: Item[]; empty: string }) {
  if (items.length === 0) {
    return <p className="text-muted py-16 text-center">{empty}</p>;
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
      {items.map((item, i) => (
        <ItemCard key={item.id} item={item} priority={i < 4} />
      ))}
    </div>
  );
}
