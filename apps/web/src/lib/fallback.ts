import type { DestinationDTO, PackageDTO, ReviewDTO, VehicleDTO } from "@travel/types";

const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1800`;
const coorg = u("1634874634941-78abc0a00298");
const munnar = u("1740744519967-a323d7ec73ad");
const gokarna = u("1587923623987-c7e4083beb23");

export const FALLBACK = {
  destinations: [
    { id: "coorg", slug: "coorg", name: "Coorg", state: "Karnataka", tagline: "Coffee plantations, misty mornings, slow roads.", description: "Coffee plantations, misty mornings, slow roads.", heroImage: coorg },
    { id: "munnar", slug: "munnar", name: "Munnar", state: "Kerala", tagline: "Tea country above the clouds.", description: "Tea country above the clouds.", heroImage: munnar },
    { id: "gokarna", slug: "gokarna", name: "Gokarna", state: "Karnataka", tagline: "Quiet beaches, easy days.", description: "Quiet beaches, easy days.", heroImage: gokarna },
  ] as DestinationDTO[],
  packages: [
    { id: "1", slug: "coorg-3-days", title: "Coorg Coffee Estate Escape", destinationSlug: "coorg", destinationName: "Coorg", route: "Bengaluru → Coorg", category: "LEISURE", days: 3, nights: 2, pricePerPerson: 7999, summary: "Estate homestay, Abbey Falls and Dubare.", coverImage: coorg, featured: true },
    { id: "2", slug: "munnar-family-trip", title: "Munnar Family Trip", destinationSlug: "munnar", destinationName: "Munnar", route: "Bengaluru → Munnar", category: "LEISURE", days: 4, nights: 3, pricePerPerson: 11999, summary: "Tea estates, Eravikulam and Mattupetty.", coverImage: munnar, featured: true },
    { id: "3", slug: "gokarna-weekend", title: "Gokarna Weekend", destinationSlug: "gokarna", destinationName: "Gokarna", route: "Bengaluru → Gokarna", category: "LEISURE", days: 3, nights: 2, pricePerPerson: 8499, summary: "Om Beach, Kudle and the beach trek.", coverImage: gokarna, featured: true },
  ] as PackageDTO[],
  vehicles: [] as VehicleDTO[],
  reviews: [
    { id: "r1", rating: 5, body: "The Coorg trip was incredibly well organized. Everything from the homestay to the driver was smooth.", authorName: "Rahul", authorCity: "Bengaluru" },
  ] as ReviewDTO[],
};
