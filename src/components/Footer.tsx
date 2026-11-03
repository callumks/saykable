import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-3 text-sm">
        <div>
          <p className="wordmark text-2xl mb-3">{site.name}</p>
          <p className="text-muted max-w-xs">
            {site.tagline} Based in {site.location}. {site.shipping}
          </p>
        </div>
        <div>
          <p className="label mb-3">Buying</p>
          <ul className="space-y-1 text-muted">
            <li>Every piece is one of one.</li>
            <li>Secure checkout by Stripe.</li>
            <li>Tracked shipping, worldwide.</li>
            <li>Questions or offers: DM or email.</li>
          </ul>
        </div>
        <div>
          <p className="label mb-3">Contact</p>
          <ul className="space-y-1">
            <li>
              <a className="hover:underline underline-offset-4" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
            </li>
            <li>
              <a
                className="hover:underline underline-offset-4"
                href={`https://instagram.com/${site.contact.instagram}`}
                target="_blank"
                rel="noreferrer"
              >
                @{site.contact.instagram}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 label text-muted">
        © {new Date().getFullYear()} {site.name}
      </div>
    </footer>
  );
}
