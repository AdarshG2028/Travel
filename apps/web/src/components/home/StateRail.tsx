import Image from "next/image";
import Link from "next/link";
import type { DestinationDTO } from "@travel/types";
import { HorizontalRail } from "@/lib/motion";
import { Eyebrow } from "../ui/Eyebrow";

/** Horizontal browse by destination: pinned scroll on desktop, swipe on mobile. */
export function StateRail({ items }: { items: DestinationDTO[] }) {
  return (
    <section className="bg-ivory py-20 lg:py-0">
      <HorizontalRail className="lg:flex lg:h-screen lg:flex-col lg:justify-center">
        <div className="flex w-[80vw] shrink-0 flex-col justify-center lg:w-[28vw]">
          <Eyebrow className="text-forest">The map, state by state</Eyebrow>
          <h2 className="mt-5 font-display text-[length:var(--text-headline)] leading-none">Pick a direction.</h2>
          <p className="mt-5 max-w-xs text-ink-soft">Karnataka for roads and ruins, Kerala for water and hills, Tamil Nadu for the Nilgiris.</p>
        </div>
        {items.map((d) => (
          <Link key={d.id} href={`/destinations/${d.slug}`} className="group relative aspect-[3/4] w-[72vw] shrink-0 overflow-hidden lg:h-[68vh] lg:w-auto">
            <Image src={d.heroImage} alt={`${d.name}, ${d.state}`} fill sizes="(min-width:1024px) 40vh, 72vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-5 left-5 text-ivory">
              <p className="text-xs uppercase tracking-[0.25em] text-ivory/70">{d.state}</p>
              <p className="font-display text-4xl">{d.name}</p>
            </div>
          </Link>
        ))}
      </HorizontalRail>
    </section>
  );
}
