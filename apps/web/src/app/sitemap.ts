import type { MetadataRoute } from "next";
import { getDestinations, getPackages } from "@/lib/api";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, packages] = await Promise.all([getDestinations(), getPackages()]);
  const url = (p: string) => `${site.url}${p}`;
  return [
    ...["", "/destinations", "/packages", "/vehicles", "/about", "/contact"].map((p) => ({ url: url(p), changeFrequency: "weekly" as const })),
    ...destinations.map((d) => ({ url: url(`/destinations/${d.slug}`), changeFrequency: "weekly" as const })),
    ...packages.map((p) => ({ url: url(`/packages/${p.slug}`), changeFrequency: "weekly" as const })),
  ];
}
