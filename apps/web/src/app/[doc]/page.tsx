import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

const docs: Record<string, { title: string; body: string[] }> = {
  terms: { title: "Terms of service", body: ["Bookings are confirmed only after payment is received and acknowledged by us.", "Prices are in Indian rupees and exclude GST unless stated.", "Draft: legal review pending before launch."] },
  privacy: { title: "Privacy policy", body: ["We collect only the details needed to plan and operate your trip: name, phone, email and travel preferences.", "We do not sell personal data.", "Draft: legal review pending before launch."] },
  "cancellation-policy": { title: "Cancellation policy", body: ["Cancellations more than 15 days before departure: full refund less a small processing fee.", "7 to 15 days: 50% refund. Under 7 days: no refund.", "Draft: terms to be finalised before launch."] },
};

export function generateStaticParams() {
  return Object.keys(docs).map((doc) => ({ doc }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ doc: string }> }): Promise<Metadata> {
  const d = docs[(await params).doc];
  return d ? { title: d.title, alternates: { canonical: `/${(await params).doc}` } } : {};
}

export default async function LegalPage({ params }: { params: Promise<{ doc: string }> }) {
  const d = docs[(await params).doc];
  if (!d) notFound();
  return (
    <>
      <PageHeader eyebrow="Legal" title={[d.title]} />
      <Container className="max-w-3xl space-y-5 pb-28 text-lg text-ink-soft">{d.body.map((p) => <p key={p}>{p}</p>)}</Container>
    </>
  );
}
