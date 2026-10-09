export type TripCategory = "LEISURE" | "RELIGIOUS";
export type BookingType = "PACKAGE_BOOKING" | "VEHICLE_BOOKING";
export type BookingStatus = "PENDING" | "PAYMENT_PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface DestinationDTO {
  id: string; slug: string; name: string; state: string; tagline: string; description: string; heroImage: string;
}
export interface PackageDTO {
  id: string; slug: string; title: string; destinationSlug: string; destinationName: string;
  route: string; category: TripCategory; days: number; nights: number; pricePerPerson: number; summary: string; coverImage: string; featured: boolean;
}
export interface VehicleDTO {
  id: string; type: string; model: string; seats: number; ac: boolean; driverAvailable: boolean;
  dailyPrice: number; perKmPrice: number | null; image: string; available: boolean;
}
export interface ReviewDTO { id: string; rating: number; body: string; authorName: string; authorCity: string }

export interface PackageDetailDTO extends PackageDTO {
  overview: string;
  hotels: string[];
  inclusions: string[];
  exclusions: string[];
  images: { id: string; url: string; alt: string }[];
  itinerary: { id: string; day: number; title: string; description: string }[];
  dates: { id: string; startDate: string; seatsLeft: number }[];
}
