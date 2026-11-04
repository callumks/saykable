import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-line scroll-mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 grid grid-cols-2 sm:flex sm:flex-wrap gap-8 sm:gap-x-[clamp(40px,8vw,120px)] text-sm">
        <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
          <p className="font-mono text-xs text-muted">Say hello</p>
          <a className="hover:underline underline-offset-4" href={`mailto:${site.contact.email}`}>
            {site.contact.email}
          </a>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="font-mono text-xs text-muted">Buying</p>
          <p>{site.shipping}</p>
          <p className="text-muted">Secure checkout by Stripe.</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="font-mono text-xs text-muted">Elsewhere</p>
          <a
            className="hover:underline underline-offset-4"
            href={`https://instagram.com/${site.contact.instagram}`}
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
          <Link className="hover:underline underline-offset-4" href="/studio">
            Studio
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-[clamp(48px,8vh,96px)]">
        <div className="flex justify-between gap-4 py-4 pb-6 border-t border-line font-mono text-xs text-muted">
          <span>
            {site.name}, archive and resale, {site.location}
          </span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
