import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { durationLabel, formatINR } from "@travel/utils";
import { getPackage } from "@/lib/api";
import { site, whatsappLink } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { ClipReveal } from "@/lib/motion";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPackage((await params).slug);
  if (!p) return {};
  return {
    title: `${p.title}, ${durationLabel(p.days)}`,
    description: p.summary,
    alternates: { canonical: `/packages/${p.slug}` },
    openGraph: { title: p.title, description: p.summary, images: [p.coverImage] },
  };
}

export default async function PackagePage({ params }: Props) {
  const p = await getPackage((await params).slug);
  if (!p) notFound();
  const bookHref = `/contact?trip=${p.slug}`; // Replaced by the booking flow in Phase 4.
  const jsonLd = {
    "@context": "https://schema.org", "@type": "TouristTrip", name: p.title, description: p.summary, image: p.coverImage,
    touristType: "Leisure", provider: { "@type": "TravelAgency", name: site.name },
    offers: { "@type": "Offer", price: p.pricePerPerson, priceCurrency: "INR", url: `${site.url}/packages/${p.slug}` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader eyebrow={`${p.destinationName} · ${durationLabel(p.days)}`} title={[p.destinationName]} intro={p.summary} image={p.coverImage} imageAlt={p.title} />
      <Container className="grid gap-16 py-20 lg:grid-cols-12">
        <div className="space-y-20 lg:col-span-8">
          <section aria-labelledby="overview">
            <Eyebrow className="text-forest">Overview</Eyebrow>
            <h2 id="overview" className="mt-3 font-display text-4xl">{p.title}</h2>
            <p className="mt-5 max-w-2xl text-lg text-ink-soft">{p.overview}</p>
          </section>

          {p.images.length > 1 && (
            <section aria-label="Gallery" className="grid grid-cols-2 gap-3">
              {p.images.slice(0, p.images.length % 2 ? Math.min(p.images.length, 5) : Math.min(p.images.length, 5) - 1).map((img, i) => (
                <ClipReveal key={img.id} className={`relative ${i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-[4/3]"}`}>
                  <Image src={img.url} alt={img.alt} fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" />
                </ClipReveal>
              ))}
            </section>
          )}

          <section aria-labelledby="itinerary">
            <Eyebrow className="text-forest">Itinerary</Eyebrow>
            <h2 id="itinerary" className="mt-3 font-display text-4xl">Day by day</h2>
            <ol className="mt-8 divide-y divide-line border-y border-line">
              {p.itinerary.map((d) => (
                <li key={d.id} className="grid gap-2 py-6 md:grid-cols-[6rem_1fr]">
                  <span className="font-display text-3xl text-forest/50">Day {d.day}</span>
                  <div><h3 className="text-lg font-medium">{d.title}</h3><p className="mt-1 text-ink-soft">{d.description}</p></div>
                </li>
              ))}
            </ol>
          </section>

          <section className="grid gap-10 md:grid-cols-2" aria-label="Inclusions and exclusions">
            <div><h2 className="font-display text-3xl">Included</h2><ul className="mt-4 space-y-2 text-ink-soft">{p.inclusions.map((x) => <li key={x}>✓ {x}</li>)}</ul></div>
            <div><h2 className="font-display text-3xl">Not included</h2><ul className="mt-4 space-y-2 text-ink-soft">{p.exclusions.map((x) => <li key={x}>– {x}</li>)}</ul></div>
          </section>

          <section aria-labelledby="stay">
            <h2 id="stay" className="font-display text-3xl">Where you stay</h2>
            <ul className="mt-4 text-ink-soft">{p.hotels.map((h) => <li key={h}>{h}</li>)}</ul>
          </section>

          <section aria-labelledby="dates">
            <h2 id="dates" className="font-display text-3xl">Upcoming departures</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {p.dates.slice(0, 6).map((d) => (
                <li key={d.id} className="flex items-center justify-between border border-line px-4 py-3">
                  <time dateTime={d.startDate}>{new Date(d.startDate).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}</time>
                  <span className="text-sm text-ink-soft">{d.seatsLeft} seats left</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-28 border border-line bg-sand/40 p-7">
            <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">From</p>
            <p className="font-display text-5xl">{formatINR(p.pricePerPerson)}<span className="text-base text-ink-soft"> / person</span></p>
            <p className="mt-2 text-sm text-ink-soft">{durationLabel(p.days)} · ex-Bengaluru</p>
            <div className="mt-6 flex flex-col gap-3">
              <Button href={bookHref} className="justify-between">Book this trip</Button>
              <Button href={whatsappLink(`Hi, I have a question about ${p.title}.`)} variant="outline" className="justify-between" target="_blank" rel="noopener noreferrer">Ask us on WhatsApp</Button>
            </div>
            <p className="mt-5 text-xs text-ink-soft">Final price is confirmed by us at booking. <Link href="/cancellation-policy" className="underline">Cancellation policy</Link></p>
          </div>
        </aside>
      </Container>
    </>
  );
}
