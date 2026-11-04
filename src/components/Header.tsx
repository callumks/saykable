import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/#shop", label: "Shop" },
  { href: "/#archive", label: "Archive" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 bg-background/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="text-lg font-semibold tracking-[-0.04em]" aria-label={`${site.name} home`}>
          {site.name}
        </Link>
        <nav className="flex items-center gap-4 sm:gap-5 font-mono text-xs text-muted">
          {links.map((l) => (
            <Link key={l.label} href={l.href} className="hover:text-foreground transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
