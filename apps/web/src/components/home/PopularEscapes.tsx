import Image from "next/image";
import Link from "next/link";
import type { PackageDTO } from "@travel/types";
import { durationLabel, formatINR } from "@travel/utils";
import { ClipReveal, MaskedLines } from "@/lib/motion";
import { Container } from "../ui/Container";
import { Eyebrow } from "../ui/Eyebrow";
import { Button } from "../ui/Button";

/** Numbered editorial list. Alternating image sides; hover zooms the image and nudges the arrow. */
export function PopularEscapes({ packages }: { packages: PackageDTO[] }) {
  return (
    <section className="bg-sand/50 py-28 md:py-40">
      <Container>
        <Eyebrow className="text-forest">Popular escapes</Eyebrow>
        <h2 className="mt-6 font-display text-[length:var(--text-headline)] leading-none tracking-tight">
          <MaskedLines lines={["Leave Friday.", "Be back Sunday."]} />
        </h2>
        <ol className="mt-20 space-y-24 md:space-y-32">
          {packages.filter((p) => p.category === "LEISURE").slice(0, 3).map((p, i) => (
            <li key={p.id}>
              <Link href={`/packages/${p.slug}`} className="group grid items-end gap-8 md:grid-cols-12">
                <ClipReveal className={`relative aspect-[4/5] md:col-span-6 md:aspect-[5/4] ${i % 2 ? "md:order-2 md:col-start-7" : ""}`}>
                  <Image src={p.coverImage} alt={`${p.destinationName}: ${p.title}`} fill sizes="(min-width:768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-105 group-hover:-translate-y-1" />
                </ClipReveal>
                <div className={`md:col-span-5 ${i % 2 ? "md:col-start-1 md:row-start-1" : "md:col-start-8"}`}>
                  <span className="font-display text-6xl text-forest/40">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 font-display text-5xl md:text-7xl">{p.destinationName}</h3>
                  <p className="mt-4 max-w-sm text-ink-soft">{p.summary}</p>
                  <p className="mt-6 text-sm uppercase tracking-[0.2em] text-ink-soft">{durationLabel(p.days)}</p>
                  <div className="mt-2 flex items-baseline justify-between border-b border-charcoal/30 pb-4">
                    <p className="font-display text-3xl">{formatINR(p.pricePerPerson)}<span className="text-sm text-ink-soft"> / person</span></p>
                    <span aria-hidden className="text-2xl transition-transform duration-300 group-hover:translate-x-2">→</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
        <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-charcoal/20 pt-10 md:flex-row md:items-center">
          <p className="max-w-md text-ink-soft">Chikmagalur, Goa, Alleppey, Tirupati, Rameswaram and more, all in one place.</p>
          <Button href="/packages">View all packages</Button>
        </div>
      </Container>
    </section>
  );
}
