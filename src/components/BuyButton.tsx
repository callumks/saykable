"use client";

import { useState } from "react";
import type { ItemStatus } from "@/lib/catalog";

export function BuyButton({ id, status, label }: { id: string; status: ItemStatus; label: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === "sold") {
    return <button disabled className="w-full h-12 border border-line text-muted label">Sold</button>;
  }
  if (status === "reserved") {
    return (
      <button disabled className="w-full h-12 border border-line text-muted label">
        Reserved — in someone&apos;s checkout
      </button>
    );
  }

  async function buy() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Something went wrong.");
      window.location.assign(data.url);
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        onClick={buy}
        disabled={busy}
        className="w-full h-12 bg-foreground text-background label hover:bg-accent hover:text-foreground transition-colors disabled:opacity-60"
      >
        {busy ? "Opening checkout…" : label}
      </button>
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
