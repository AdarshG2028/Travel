import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getDestinations } from "@/lib/api";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Coorg, Munnar, Gokarna, Hampi, Alleppey, Wayanad and more across South India.",
  alternates: { canonical: "/destinations" },
};

export default async function DestinationsPage() {
  const items = await getDestinations();
  return (
    <>
      <PageHeader eyebrow="Destinations" title={["Where to,", "this time?"]} intro="Hill stations, coast, heritage and backwaters, all within a night's travel of Bengaluru." />
      <section className="pb-28">
        <Container className="grid gap-6 md:grid-cols-2">
          {items.map((d, i) => (
            <Link key={d.id} href={`/destinations/${d.slug}`} className={`group relative block overflow-hidden ${i % 3 === 0 ? "md:col-span-2 aspect-[16/8]" : "aspect-[4/3]"}`}>
              <Image src={d.heroImage} alt={`${d.name}, ${d.state}`} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
              <div className="absolute bottom-6 left-6 text-ivory">
                <p className="text-xs uppercase tracking-[0.25em] text-ivory/75">{d.state}</p>
                <p className="font-display text-5xl">{d.name}</p>
                <p className="mt-1 text-ivory/85">{d.tagline}</p>
              </div>
            </Link>
          ))}
        </Container>
      </section>
    </>
  );
}
