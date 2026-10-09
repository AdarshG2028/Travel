import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "About", description: "A Bengaluru travel company with its own vehicles, drivers and a short list of places we know well.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About us" title={["Bengaluru-built,", "road-tested."]} />
      <Container className="grid gap-12 pb-28 md:grid-cols-2">
        <p className="font-display text-3xl leading-snug">We started with a single Innova and a habit of driving to Coorg every other weekend.</p>
        <div className="space-y-5 text-lg text-ink-soft">
          <p>Today we run weekend trips and vehicle rentals across Karnataka, Kerala and Tamil Nadu. We keep the list of places short on purpose: every stay and route is one we have used ourselves.</p>
          <p>Our drivers are employees, not freelancers. If something changes on the road, a person we know is making the call.</p>
          <div className="pt-4"><Button href="/contact">Plan a trip with us</Button></div>
        </div>
      </Container>
    </>
  );
}
