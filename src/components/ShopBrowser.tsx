"use client";

import { useMemo, useState } from "react";
import type { Item } from "@/lib/catalog";
import { ItemGrid } from "./ItemGrid";
import { Select, Tabs, countBy } from "./Chip";

type Sort = "new" | "low" | "high";

const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

/** Letter sizes in order, then anything else (Women's L, 32, One size) alphabetically. */
function bySize(a: string, b: string): number {
  const ia = SIZE_ORDER.indexOf(a.toUpperCase());
  const ib = SIZE_ORDER.indexOf(b.toUpperCase());
  if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  return a.localeCompare(b, undefined, { numeric: true });
}

export function ShopBrowser({ items }: { items: Item[] }) {
  const [cat, setCat] = useState("All");
  const [size, setSize] = useState("All");
  const [brand, setBrand] = useState("All");
  const [sort, setSort] = useState<Sort>("new");
  const [availableOnly, setAvailableOnly] = useState(false);

  const cats = useMemo(() => countBy(items, (i) => i.category), [items]);
  const sizes = useMemo(() => [...new Set(items.map((i) => i.size).filter(Boolean))].sort(bySize), [items]);
  const brands = useMemo(
    () => [...new Set(items.map((i) => i.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [items],
  );
  const reserved = items.some((i) => i.status === "reserved");

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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-x-8 gap-y-2 pb-3 border-b border-line">
        <Tabs label="Category" value={cat} onChange={setCat} options={cats} />
        <div className="grid grid-cols-3 gap-2 lg:w-[30rem] shrink-0">
          <Select
            label="Size"
            value={size}
            onChange={setSize}
            options={[{ value: "All", label: "Size" }, ...sizes.map((s) => ({ value: s, label: s }))]}
          />
          <Select
            label="Brand"
            value={brand}
            onChange={setBrand}
            options={[{ value: "All", label: "Brand" }, ...brands.map((b) => ({ value: b, label: b }))]}
          />
          <Select
            label="Sort"
            value={sort}
            onChange={(v) => setSort(v as Sort)}
            options={[
              { value: "new", label: "Newest" },
              { value: "low", label: "Price ↑" },
              { value: "high", label: "Price ↓" },
            ]}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 min-h-11 mb-4">
        <p className="label text-muted" aria-live="polite">
          {filtered ? (
            <>
              <span className="text-foreground tabular-nums">{shown.length}</span> of {items.length}
            </>
          ) : (
            <>
              <span className="tabular-nums">{items.length}</span> pieces
            </>
          )}
        </p>
        <div className="flex items-center gap-5">
          {reserved ? (
            <label className="label inline-flex items-center gap-2 h-11 cursor-pointer">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="size-3.5 accent-foreground"
              />
              Hide reserved
            </label>
          ) : null}
          {filtered ? (
            <button type="button" onClick={clear} className="label h-11 underline underline-offset-4">
              Clear
            </button>
          ) : null}
        </div>
      </div>

      <ItemGrid items={shown} empty="Nothing matches those filters." />
    </>
  );
}
