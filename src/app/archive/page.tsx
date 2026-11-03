import type { Metadata } from "next";
import { getSoldItems } from "@/lib/catalog";
import { ArchiveBrowser } from "@/components/ArchiveBrowser";
import { SectionHead } from "@/components/SectionHead";

export const revalidate = 300;
export const metadata: Metadata = { title: "Archive" };

export default async function ArchivePage() {
  const items = await getSoldItems();
  return (
    <section className="pt-10">
      <SectionHead as="h1" label="Archive" count={items.length} />
      <ArchiveBrowser items={items} />
    </section>
  );
}
