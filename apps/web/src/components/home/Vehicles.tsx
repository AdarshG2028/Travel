import Link from "next/link";
import { formatINR } from "@travel/utils";
import { Container } from "../ui/Container";
import { Eyebrow } from "../ui/Eyebrow";
import { Button } from "../ui/Button";

const fleet = [
  { name: "Car", seats: "4–5 passengers", from: 2800 },
  { name: "SUV", seats: "6–7 passengers", from: 4500 },
  { name: "Tempo Traveller", seats: "12–17 passengers", from: 7500 },
  { name: "Bus", seats: "20–50 passengers", from: 14000 },
];

/** Split layout: statement left, fleet table right. Deliberately text-led to vary the page rhythm. */
export function Vehicles() {
  return (
    <section className="bg-forest-deep py-28 text-ivory md:py-40">
      <Container className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow className="text-ivory/60">Vehicle rental</Eyebrow>
          <h2 className="mt-6 font-display text-[length:var(--text-headline)] leading-[0.95]">Travel your way.</h2>
          <p className="mt-6 max-w-sm text-ivory/75">Daily rentals and outstation trips, with an experienced driver or self-drive on request. Fixed rates, no surprise kilometres.</p>
          <div className="mt-10"><Button href="/vehicles" variant="light">See the fleet</Button></div>
        </div>
        <ul className="lg:col-span-7 lg:col-start-6">
          {fleet.map((v) => (
            <li key={v.name}>
              <Link href="/vehicles" className="group flex items-baseline justify-between gap-4 border-t border-ivory/20 py-7 transition-colors hover:bg-ivory/5">
                <span>
                  <span className="block font-display text-4xl md:text-5xl">{v.name}</span>
                  <span className="mt-1 block text-sm text-ivory/60">{v.seats}</span>
                </span>
                <span className="text-right">
                  <span className="block text-xs uppercase tracking-[0.2em] text-ivory/50">from</span>
                  <span className="font-display text-2xl">{formatINR(v.from)}<span className="text-sm text-ivory/60">/day</span></span>
                </span>
              </Link>
            </li>
          ))}
          <li className="border-t border-ivory/20" />
        </ul>
      </Container>
    </section>
  );
}
