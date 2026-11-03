import Link from "next/link";

export function SectionHead({
  label,
  count,
  href,
  linkLabel,
  as: Tag = "h2",
}: {
  label: string;
  count?: number;
  href?: string;
  linkLabel?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 mb-6">
      <Tag className="label">
        {label}
        {count != null ? <span className="text-muted"> · {count}</span> : null}
      </Tag>
      {href ? (
        <Link href={href} className="label text-muted hover:text-foreground hover:underline underline-offset-4">
          {linkLabel} →
        </Link>
      ) : null}
    </div>
  );
}
