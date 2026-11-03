import type { Metadata } from "next";
import { getSoldItems } from "@/lib/catalog";
import { ItemGrid } from "@/components/ItemGrid";

export const revalidate = 300;
export const metadata: Metadata = { title: "Sold" };

export default async function SoldPage() {
  const items = await getSoldItems();
  return (
    <section className="pt-12">
      <h1 className="label mb-2">Sold archive</h1>
      <p className="text-muted max-w-xl mb-8">
        Pieces that have already found a home. Kept here for reference, and to show what we source.
      </p>
      <ItemGrid items={items} empty="Nothing in the archive yet." />
    </section>
  );
}
