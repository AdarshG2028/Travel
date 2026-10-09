import "server-only";
import { unstable_cache } from "next/cache";
import type { DestinationDTO, PackageDTO, PackageDetailDTO, ReviewDTO, VehicleDTO } from "@travel/types";
import { db } from "./db";
import { FALLBACK } from "./fallback";

/**
 * Cache a query for 5 minutes and serve a static fallback if the database is unreachable.
 * The query throws inside the cache, so a failure is never cached; only the fallback return happens outside it.
 */
function query<T>(key: string, fn: () => Promise<T>, fallback: T): () => Promise<T> {
  const cached = unstable_cache(fn, [key], { revalidate: 300, tags: [key] });
  return async () => {
    try {
      return await cached();
    } catch (e) {
      console.error("data query failed:", key, e instanceof Error ? e.message.trim().split("\n").pop() : e);
      return fallback;
    }
  };
}

type PackageRow = {
  id: string; slug: string; title: string; route: string; category: "LEISURE" | "RELIGIOUS"; days: number; nights: number;
  pricePerPerson: number; summary: string; featured: boolean;
  destination: { slug: string; name: string; heroImage: string }; images: { url: string }[];
};

const toPackage = (p: PackageRow): PackageDTO => ({
  id: p.id, slug: p.slug, title: p.title, route: p.route, category: p.category,
  destinationSlug: p.destination.slug, destinationName: p.destination.name,
  days: p.days, nights: p.nights, pricePerPerson: p.pricePerPerson, summary: p.summary,
  coverImage: p.images[0]?.url ?? p.destination.heroImage, featured: p.featured,
});

export const getDestinations = query<DestinationDTO[]>("destinations", async () => {
  const rows = await db.destination.findMany({ where: { published: true }, orderBy: { name: "asc" } });
  return rows.map((d) => ({ id: d.id, slug: d.slug, name: d.name, state: d.state, tagline: d.tagline, description: d.description, heroImage: d.heroImage }));
}, FALLBACK.destinations);

export const getPackages = query<PackageDTO[]>("packages", async () => {
  const rows = await db.package.findMany({
    where: { published: true },
    include: { destination: true, images: { orderBy: { position: "asc" }, take: 1 } },
    orderBy: [{ featured: "desc" }, { pricePerPerson: "asc" }],
  });
  return rows.map(toPackage);
}, FALLBACK.packages);

export const getVehicles = query<VehicleDTO[]>("vehicles", async () => {
  const rows = await db.vehicle.findMany({ include: { type: true }, orderBy: { dailyPrice: "asc" } });
  return rows.map((v) => ({
    id: v.id, type: v.type.name, model: v.model, seats: v.seats, ac: v.ac, driverAvailable: v.driverIncluded,
    dailyPrice: v.dailyPrice, perKmPrice: v.perKmPrice, image: v.image, available: v.status === "AVAILABLE",
  }));
}, FALLBACK.vehicles);

export const getReviews = query<ReviewDTO[]>("reviews", async () => {
  const rows = await db.review.findMany({ where: { status: "APPROVED" }, orderBy: { createdAt: "desc" }, take: 12 });
  return rows.map((r) => ({ id: r.id, rating: r.rating, body: r.body, authorName: r.authorName, authorCity: r.authorCity }));
}, FALLBACK.reviews);

export function getPackage(slug: string): Promise<PackageDetailDTO | null> {
  return query<PackageDetailDTO | null>(`package-${slug}`, async () => {
    const p = await db.package.findFirst({
      where: { slug, published: true },
      include: {
        destination: true,
        images: { orderBy: { position: "asc" } },
        itinerary: { orderBy: { day: "asc" } },
        dates: { where: { startDate: { gte: new Date() } }, orderBy: { startDate: "asc" } },
      },
    });
    if (!p) return null;
    return {
      ...toPackage(p), overview: p.overview, hotels: p.hotels, inclusions: p.inclusions, exclusions: p.exclusions,
      images: p.images.map((i) => ({ id: i.id, url: i.url, alt: i.alt })),
      itinerary: p.itinerary.map((i) => ({ id: i.id, day: i.day, title: i.title, description: i.description })),
      dates: p.dates.map((d) => ({ id: d.id, startDate: d.startDate.toISOString(), seatsLeft: d.seatsLeft })),
    };
  }, null)();
}
