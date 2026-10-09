import { getDestinations, getPackages, getReviews } from "@/lib/api";
import { site } from "@/lib/site";
import { Hero } from "@/components/home/Hero";
import { DestinationStory } from "@/components/home/DestinationStory";
import { Statement } from "@/components/home/Statement";
import { PopularEscapes } from "@/components/home/PopularEscapes";
import { StateRail } from "@/components/home/StateRail";
import { Vehicles } from "@/components/home/Vehicles";
import { Reviews } from "@/components/home/Reviews";
import { CustomTripCta } from "@/components/home/CustomTripCta";

export default async function HomePage() {
  const [destinations, packages, reviews] = await Promise.all([getDestinations(), getPackages(), getReviews()]);
  const story = ["coorg", "munnar", "gokarna"].map((s) => destinations.find((d) => d.slug === s)).filter((d) => !!d);
  const jsonLd = {
    "@context": "https://schema.org", "@type": "TravelAgency", name: site.name, url: site.url,
    areaServed: "South India", address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressRegion: "Karnataka", addressCountry: "IN" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero image={destinations.find((d) => d.slug === "coorg")?.heroImage ?? destinations[0].heroImage} />
      <Statement />
      <DestinationStory items={story} />
      <PopularEscapes packages={packages} />
      <StateRail items={destinations} />
      <Vehicles />
      <Reviews reviews={reviews} />
      <CustomTripCta />
    </>
  );
}
