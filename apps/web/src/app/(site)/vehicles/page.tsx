import type { Metadata } from "next";
import { formatINR } from "@travel/utils";
import { getVehicles } from "@/lib/api";
import { whatsappLink } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Vehicle rental in Bengaluru",
  description: "Cars, SUVs, Tempo Travellers and buses with drivers for daily and outstation trips from Bengaluru.",
  alternates: { canonical: "/vehicles" },
};

export default async function VehiclesPage() {
  const vehicles = await getVehicles();
  return (
    <>
      <PageHeader eyebrow="Vehicle rental" title={["Travel", "your way."]} intro="Our own fleet, our own drivers. Daily rates for city use, per-km rates for outstation." />
      <section className="pb-28">
        <Container>
          <ul className="border-t border-line">
            {vehicles.map((v) => (
              <li key={v.id} className="grid items-center gap-4 border-b border-line py-8 md:grid-cols-[1.4fr_1fr_1fr_auto]">
                <div>
                  <p className="font-display text-4xl">{v.type}</p>
                  <p className="text-ink-soft">{v.model}</p>
                </div>
                <p className="text-sm text-ink-soft">{v.seats} seats · {v.ac ? "AC" : "Non-AC"}<br />{v.driverAvailable ? "Driver included" : "Self-drive available"}</p>
                <p>{formatINR(v.dailyPrice)}<span className="text-sm text-ink-soft">/day</span>{v.perKmPrice ? <><br /><span className="text-sm text-ink-soft">outstation {formatINR(v.perKmPrice)}/km</span></> : null}</p>
                <Button href={whatsappLink(`Hi, I would like to book a ${v.type} (${v.model}).`)} variant="outline" target="_blank" rel="noopener noreferrer">{v.available ? "Enquire" : "Currently on trip"}</Button>
              </li>
            ))}
          </ul>
          {!vehicles.length && <p className="text-ink-soft">Fleet details are loading. Please try again shortly.</p>}
        </Container>
      </section>
    </>
  );
}
