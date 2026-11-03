"use client";

import { useMemo, useState } from "react";
import type { Item } from "@/lib/catalog";
import { ItemGrid } from "./ItemGrid";
import { Chip, Select } from "./Chip";

type Sort = "new" | "low" | "high";

function uniq(items: Item[], key: "category" | "size" | "brand"): string[] {
  return [...new Set(items.map((i) => i[key]).filter(Boolean))];
}

export function ShopBrowser({ items }: { items: Item[] }) {
  const [cat, setCat] = useState("All");
  const [size, setSize] = useState("All");
  const [brand, setBrand] = useState("All");
  const [sort, setSort] = useState<Sort>("new");
  const [availableOnly, setAvailableOnly] = useState(false);

  const cats = useMemo(() => ["All", ...uniq(items, "category")], [items]);
  const sizes = useMemo(() => uniq(items, "size"), [items]);
  const brands = useMemo(() => uniq(items, "brand").sort((a, b) => a.localeCompare(b)), [items]);

  const shown = useMemo(() => {
    const out = items.filter(
      (i) =>
        (cat === "All" || i.category === cat) &&
        (size === "All" || i.size === size) &&
        (brand === "All" || i.brand === brand) &&
        (!availableOnly || i.status === "available"),
    );
    if (sort === "low") out.sort((a, b) => a.price - b.price);
    if (sort === "high") out.sort((a, b) => b.price - a.price);
    return out;
  }, [items, cat, size, brand, sort, availableOnly]);

  const filtered = cat !== "All" || size !== "All" || brand !== "All" || availableOnly;
  const clear = () => {
    setCat("All");
    setSize("All");
    setBrand("All");
    setAvailableOnly(false);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4 border-y border-line">
        <div role="group" aria-label="Category" className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <Chip key={c} on={cat === c} onClick={() => setCat(c)}>
              {c}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            label="Size"
            value={size}
            onChange={setSize}
            options={[{ value: "All", label: "Size: all" }, ...sizes.map((s) => ({ value: s, label: s }))]}
          />
          <Select
            label="Brand"
            value={brand}
            onChange={setBrand}
            options={[{ value: "All", label: "Brand: all" }, ...brands.map((b) => ({ value: b, label: b }))]}
          />
          <Select
            label="Sort"
            value={sort}
            onChange={(v) => setSort(v as Sort)}
            options={[
              { value: "new", label: "Newest" },
              { value: "low", label: "Price, low to high" },
              { value: "high", label: "Price, high to low" },
            ]}
          />
          <label className="label inline-flex items-center gap-2 h-11 pl-2 cursor-pointer">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="size-4 accent-foreground"
            />
            Available only
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 min-h-11 mt-2 mb-4">
        <p className="label text-muted">
          Showing <span className="text-foreground">{shown.length}</span> of {items.length}
        </p>
        {filtered ? (
          <button type="button" onClick={clear} className="label h-11 underline underline-offset-4">
            Clear filters
          </button>
        ) : null}
      </div>

      <ItemGrid items={shown} empty="Nothing matches those filters." />
    </>
  );
}
