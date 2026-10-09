import type { DestinationDTO, PackageDTO, ReviewDTO, VehicleDTO } from "@travel/types";
import { FALLBACK } from "./fallback";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function get<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API}${path}`, { next: { revalidate: 300 }, signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(String(res.status));
    return (await res.json()) as T;
  } catch {
    return fallback; // keeps the site browsable if the API is down
  }
}

export const getDestinations = () => get<DestinationDTO[]>("/destinations", FALLBACK.destinations);
export const getPackages = () => get<PackageDTO[]>("/packages", FALLBACK.packages);
export const getVehicles = () => get<VehicleDTO[]>("/vehicles", FALLBACK.vehicles);
export const getReviews = () => get<ReviewDTO[]>("/reviews", FALLBACK.reviews);

export async function getPackage(slug: string): Promise<import("@travel/types").PackageDetailDTO | null> {
  try {
    const res = await fetch(`${API}/packages/${slug}`, { next: { revalidate: 300 }, signal: AbortSignal.timeout(4000) });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}
