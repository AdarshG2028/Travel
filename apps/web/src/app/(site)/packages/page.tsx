import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import { getPackages } from "@/lib/api";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHeader } from "@/components/ui/PageHeader";
import { PackageCard } from "@/components/ui/PackageCard";

export const metadata: Metadata = {
  title: "Packages",
  description: "Bengaluru to Chikmagalur, Mangaluru, Goa, Munnar and Alleppey, plus pilgrimage trips to Tirupati, Madurai and Rameswaram. Priced in rupees.",
  alternates: { canonical: "/packages" },
};

const filters = [
  { key: "all", label: "All packages" },
  { key: "leisure", label: "Getaways" },
  { key: "religious", label: "Religious tourism" },
] as const;
const sorts = [
  { key: "popular", label: "Popular" },
  { key: "price", label: "Price: low to high" },
  { key: "short", label: "Shortest first" },
] as const;

type Props = { searchParams: Promise<{ category?: string; sort?: string }> };

export default async function PackagesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const category = filters.some((f) => f.key === sp.category) ? sp.category! : "all";
  const sort = sorts.some((s) => s.key === sp.sort) ? sp.sort! : "popular";

  let items = await getPackages();
  if (category !== "all") items = items.filter((p) => p.category === category.toUpperCase());
  if (sort === "price") items = [...items].sort((a, b) => a.pricePerPerson - b.pricePerPerson);
  if (sort === "short") items = [...items].sort((a, b) => a.days - b.days);

  const href = (c: string, s: string) => `/packages?${new URLSearchParams({ ...(c !== "all" && { category: c }), ...(s !== "popular" && { sort: s }) })}`;
  const chip = (active: boolean) =>
    clsx("inline-flex min-h-11 items-center rounded-full border px-5 text-sm transition-colors", active ? "border-charcoal bg-charcoal text-ivory" : "border-charcoal/25 hover:border-charcoal");

  return (
    <>
      <PageHeader eyebrow="Packages" title={["Choose your", "route."]} intro="Every package includes a private AC vehicle from Bengaluru, a driver who knows the road, and a stay we have visited ourselves." />
      <section className="pb-28" aria-label="All packages">
        <Container>
          <div className="flex flex-col gap-6 border-y border-line py-5 md:flex-row md:items-center md:justify-between">
            <nav aria-label="Filter by type" className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <Link key={f.key} href={href(f.key, sort)} scroll={false} aria-current={category === f.key ? "page" : undefined} className={chip(category === f.key)}>{f.label}</Link>
              ))}
            </nav>
            <nav aria-label="Sort" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-soft">
              <Eyebrow className="text-ink-soft">Sort</Eyebrow>
              {sorts.map((s) => (
                <Link key={s.key} href={href(category, s.key)} scroll={false} aria-current={sort === s.key ? "true" : undefined}
                  className={clsx("min-h-11 inline-flex items-center", sort === s.key ? "text-charcoal underline underline-offset-4" : "hover:text-charcoal")}>{s.label}</Link>
              ))}
            </nav>
          </div>
          <p className="mt-6 text-sm text-ink-soft" aria-live="polite">{items.length} {items.length === 1 ? "package" : "packages"}</p>
          <div className="mt-8 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => <PackageCard key={p.id} p={p} />)}
          </div>
          {!items.length && <p className="mt-10 text-ink-soft">Nothing here yet. <Link href="/contact" className="underline">Tell us what you have in mind.</Link></p>}
        </Container>
      </section>
    </>
  );
}
