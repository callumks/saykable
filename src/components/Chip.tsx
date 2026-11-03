"use client";

/**
 * One line of category tabs with counts. Scrolls sideways on phones instead of
 * wrapping, so the grid starts near the top of the screen.
 */
export function Tabs({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; count: number }[];
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.value)}
            className={`label h-11 shrink-0 whitespace-nowrap underline-offset-[6px] decoration-1 ${
              on ? "text-foreground underline" : "text-muted hover:text-foreground"
            }`}
          >
            {o.value} <span className="tabular-nums text-muted">{o.count}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="relative flex min-w-0">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="label w-full h-11 pl-3 pr-8 border border-line bg-background appearance-none cursor-pointer truncate hover:border-foreground"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
      >
        <path d="M1.5 3.5 5 7l3.5-3.5" />
      </svg>
    </label>
  );
}

/** Category options with counts, in order of first appearance, "All" first. */
export function countBy<T>(items: T[], key: (i: T) => string): { value: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const i of items) {
    const k = key(i);
    if (k) counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [
    { value: "All", count: items.length },
    ...[...counts].sort((a, b) => b[1] - a[1]).map(([value, count]) => ({ value, count })),
  ];
}
