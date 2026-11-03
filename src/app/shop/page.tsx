import type { Metadata } from "next";
import { getListedItems } from "@/lib/catalog";
import { ShopBrowser } from "@/components/ShopBrowser";
import { SectionHead } from "@/components/SectionHead";

export const revalidate = 60;
export const metadata: Metadata = { title: "Shop" };

export default async function ShopPage() {
  const items = await getListedItems();
  return (
    <section className="pt-10">
      <SectionHead as="h1" label="Shop" count={items.length} />
      <ShopBrowser items={items} />
    </section>
  );
}
