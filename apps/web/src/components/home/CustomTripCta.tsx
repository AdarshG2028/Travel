import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { Eyebrow } from "../ui/Eyebrow";
import { whatsappLink } from "@/lib/site";

export function CustomTripCta() {
  return (
    <section className="bg-sand py-24 md:py-32">
      <Container className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
        <div>
          <Eyebrow className="text-forest">Something else in mind?</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-display text-[length:var(--text-headline)] leading-none">Tell us where, and when.</h2>
          <p className="mt-5 max-w-md text-ink-soft">Family reunion in Kodaikanal, a corporate offsite in Kabini, a college trip to Hampi. We will plan it and quote it within a day.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/contact">Plan a custom trip</Button>
          <Button href={whatsappLink("Hi, I want help planning a trip.")} variant="outline" target="_blank" rel="noopener noreferrer">Ask on WhatsApp</Button>
        </div>
      </Container>
    </section>
  );
}
