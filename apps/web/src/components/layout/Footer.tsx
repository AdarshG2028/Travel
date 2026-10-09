import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { Container } from "../ui/Container";

const cols = [
  { title: "Destinations", links: [["Coorg", "/destinations/coorg"], ["Munnar", "/destinations/munnar"], ["Gokarna", "/destinations/gokarna"], ["Hampi", "/destinations/hampi"]] },
  { title: "Packages", links: [["All packages", "/packages"], ["Coorg, 3 days", "/packages/coorg-3-days"], ["Munnar family trip", "/packages/munnar-family-trip"], ["Religious tourism", "/packages?category=religious"], ["Plan a custom trip", "/contact"]] },
  { title: "Vehicles", links: [["Cars and SUVs", "/vehicles"], ["Tempo Travellers", "/vehicles"], ["Buses", "/vehicles"]] },
];

export function Footer() {
  return (
    <footer className="bg-forest-deep py-20 text-ivory">
      <Container>
        <div className="grid gap-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p className="font-display text-3xl">{site.name}</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/70">
              A Bengaluru travel company for weekends in the Western Ghats, coast and heritage towns of South India, with our own vehicles and drivers.
            </p>
            <p className="mt-6 text-sm text-ivory/70">
              <a href={whatsappLink()} className="underline underline-offset-4">WhatsApp</a> · <a href="https://instagram.com" className="underline underline-offset-4">Instagram</a>
            </p>
          </div>
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="text-xs uppercase tracking-[0.28em] text-ivory/50">{c.title}</p>
              <ul className="mt-5 space-y-3 text-sm">
                {c.links.map(([label, href]) => (
                  <li key={label}><Link href={href} className="text-ivory/80 transition-colors hover:text-ivory">{label}</Link></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap gap-x-8 gap-y-2 border-t border-ivory/15 pt-6 text-xs text-ivory/50">
          <span>© {new Date().getFullYear()} {site.name}, Bengaluru</span>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/cancellation-policy">Cancellation policy</Link>
        </div>
      </Container>
    </footer>
  );
}
