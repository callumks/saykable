import type { Item } from "@/lib/catalog";
import { ItemCard } from "./ItemCard";

const layouts = {
  default: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  dense: "grid-cols-2 sm:grid-cols-4 lg:grid-cols-6",
};

export function ItemGrid({
  items,
  empty,
  layout = "default",
}: {
  items: Item[];
  empty: string;
  layout?: keyof typeof layouts;
}) {
  if (items.length === 0) {
    return <p className="text-muted py-16 text-center">{empty}</p>;
  }
  return (
    <div className={`grid ${layouts[layout]} gap-x-4 gap-y-8`}>
      {items.map((item, i) => (
        <ItemCard key={item.id} item={item} priority={i < 4} />
      ))}
    </div>
  );
}
