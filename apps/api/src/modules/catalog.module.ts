import { Controller, Get, Inject, Injectable, Module, NotFoundException, Param, Query } from "@nestjs/common";
import type { DestinationDTO, PackageDTO, VehicleDTO, ReviewDTO } from "@travel/types";
import { listQuerySchema, type ListQuery } from "@travel/validation";
import { PrismaService } from "../common/prisma.service";
import { ZodPipe } from "../common/zod.pipe";

@Injectable()
export class CatalogService {
  constructor(@Inject(PrismaService) private readonly db: PrismaService) {}

  async destinations(): Promise<DestinationDTO[]> {
    const rows = await this.db.destination.findMany({ where: { published: true }, orderBy: { name: "asc" } });
    return rows.map((d) => ({ id: d.id, slug: d.slug, name: d.name, state: d.state, tagline: d.tagline, description: d.description, heroImage: d.heroImage }));
  }

  private toPackage(p: any): PackageDTO {
    return {
      id: p.id, slug: p.slug, title: p.title, destinationSlug: p.destination.slug, destinationName: p.destination.name,
      route: p.route, category: p.category, days: p.days, nights: p.nights, pricePerPerson: p.pricePerPerson, summary: p.summary,
      coverImage: p.images[0]?.url ?? p.destination.heroImage, featured: p.featured,
    };
  }

  async packages(q: ListQuery): Promise<PackageDTO[]> {
    const rows = await this.db.package.findMany({
      where: { published: true, ...(q.destination ? { destination: { slug: q.destination } } : {}) },
      include: { destination: true, images: { orderBy: { position: "asc" }, take: 1 } },
      orderBy: [{ featured: "desc" }, { pricePerPerson: "asc" }],
      take: q.limit,
    });
    return rows.map((p) => this.toPackage(p));
  }

  async packageBySlug(slug: string) {
    const p = await this.db.package.findFirst({
      where: { slug, published: true },
      include: {
        destination: true,
        images: { orderBy: { position: "asc" } },
        itinerary: { orderBy: { day: "asc" } },
        dates: { where: { startDate: { gte: new Date() } }, orderBy: { startDate: "asc" } },
      },
    });
    if (!p) throw new NotFoundException("Package not found");
    return { ...this.toPackage(p), overview: p.overview, hotels: p.hotels, inclusions: p.inclusions, exclusions: p.exclusions,
      images: p.images, itinerary: p.itinerary, dates: p.dates };
  }

  async vehicles(): Promise<VehicleDTO[]> {
    const rows = await this.db.vehicle.findMany({ include: { type: true }, orderBy: { dailyPrice: "asc" } });
    return rows.map((v) => ({
      id: v.id, type: v.type.name, model: v.model, seats: v.seats, ac: v.ac, driverAvailable: v.driverIncluded,
      dailyPrice: v.dailyPrice, perKmPrice: v.perKmPrice, image: v.image, available: v.status === "AVAILABLE",
    }));
  }

  async reviews(): Promise<ReviewDTO[]> {
    const rows = await this.db.review.findMany({ where: { status: "APPROVED" }, orderBy: { createdAt: "desc" }, take: 12 });
    return rows.map((r) => ({ id: r.id, rating: r.rating, body: r.body, authorName: r.authorName, authorCity: r.authorCity }));
  }
}

@Controller()
export class CatalogController {
  constructor(@Inject(CatalogService) private readonly svc: CatalogService) {}

  @Get("destinations") destinations() { return this.svc.destinations(); }
  @Get("packages") packages(@Query(new ZodPipe(listQuerySchema)) q: ListQuery) { return this.svc.packages(q); }
  @Get("packages/:slug") pkg(@Param("slug") slug: string) { return this.svc.packageBySlug(slug); }
  @Get("vehicles") vehicles() { return this.svc.vehicles(); }
  @Get("reviews") reviews() { return this.svc.reviews(); }
  @Get("health") health() { return { ok: true }; }
}

@Module({ controllers: [CatalogController], providers: [CatalogService] })
export class CatalogModule {}
