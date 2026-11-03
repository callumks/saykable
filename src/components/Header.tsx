import Link from "next/link";
import { site } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="wordmark text-xl" aria-label={`${site.name} home`}>
          {site.name}
        </Link>
        <nav className="label flex items-center gap-5">
          <Link href="/" className="hover:underline underline-offset-4">Shop</Link>
          <Link href="/sold" className="hover:underline underline-offset-4">Sold</Link>
          <a
            href={`https://instagram.com/${site.contact.instagram}`}
            target="_blank"
            rel="noreferrer"
            className="hover:underline underline-offset-4"
          >
            Instagram
          </a>
        </nav>
      </div>
    </header>
  );
}
