import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDestinations, getPackages } from "@/lib/api";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { PackageCard } from "@/components/ui/PackageCard";
import { Button } from "@/components/ui/Button";

type Props = { params: Promise<{ slug: string }> };

async function find(slug: string) {
  return (await getDestinations()).find((d) => d.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = await find((await params).slug);
  if (!d) return {};
  return { title: `${d.name} trips from Bengaluru`, description: d.description, alternates: { canonical: `/destinations/${d.slug}` }, openGraph: { images: [d.heroImage] } };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const d = await find(slug);
  if (!d) notFound();
  const packages = (await getPackages()).filter((p) => p.destinationSlug === slug);
  return (
    <>
      <PageHeader eyebrow={d.state} title={[d.name]} intro={d.tagline} image={d.heroImage} imageAlt={`${d.name}, ${d.state}`} />
      <Container className="py-20">
        <p className="max-w-2xl font-display text-3xl leading-snug">{d.description}</p>
        <h2 className="mt-24 font-display text-4xl">Trips to {d.name}</h2>
        {packages.length ? (
          <div className="mt-10 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">{packages.map((p) => <PackageCard key={p.id} p={p} />)}</div>
        ) : (
          <div className="mt-6"><p className="text-ink-soft">No fixed departures yet. We can plan this one for you.</p><div className="mt-6"><Button href={`/contact?trip=${slug}`}>Plan a custom trip</Button></div></div>
        )}
      </Container>
    </>
  );
}
