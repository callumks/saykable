"use client";

export function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`label h-11 px-3.5 border whitespace-nowrap transition-colors ${
        on ? "bg-foreground text-background border-foreground" : "bg-background border-line hover:border-foreground"
      }`}
    >
      {children}
    </button>
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
    <label className="relative inline-flex">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="label h-11 pl-3 pr-8 border border-line bg-background appearance-none cursor-pointer hover:border-foreground"
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
