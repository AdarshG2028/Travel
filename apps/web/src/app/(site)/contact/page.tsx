import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { InquiryForm } from "@/components/ui/InquiryForm";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = { title: "Plan a custom trip", description: "Tell us where and when. We will plan and quote within a working day.", alternates: { canonical: "/contact" } };

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ trip?: string }> }) {
  const { trip } = await searchParams;
  const preset = trip ? trip.replace(/-/g, " ") : "";
  return (
    <>
      <PageHeader eyebrow="Plan a trip" title={["Tell us where,", "and when."]} intro="We reply within a working day, usually sooner on WhatsApp." />
      <Container className="grid gap-16 pb-28 lg:grid-cols-12">
        <div className="lg:col-span-8"><InquiryForm defaultDestination={preset} /></div>
        <aside className="space-y-4 text-ink-soft lg:col-span-4">
          <p className="font-display text-2xl text-charcoal">Prefer to chat?</p>
          <p><a className="underline underline-offset-4" href={whatsappLink()} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a></p>
          <p>Bengaluru, Karnataka<br />Open daily, 9am to 8pm</p>
        </aside>
      </Container>
    </>
  );
}
