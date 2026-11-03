import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/archive", label: "Archive" },
  { href: "/studio", label: "Studio" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="wordmark text-xl" aria-label={`${site.name} home`}>
          {site.name}
        </Link>
        <nav className="label flex items-center gap-5">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:underline underline-offset-4">
              {l.label}
            </Link>
          ))}
          <a
            href={`https://instagram.com/${site.contact.instagram}`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline hover:underline underline-offset-4"
          >
            Instagram
          </a>
        </nav>
      </div>
    </header>
  );
}
