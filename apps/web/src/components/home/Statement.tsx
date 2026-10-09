import { Container } from "../ui/Container";
import { Eyebrow } from "../ui/Eyebrow";
import { MaskedLines } from "@/lib/motion";

/** Large-type interlude: sets the voice before the packages. */
export function Statement() {
  return (
    <section className="bg-ivory py-28 md:py-44">
      <Container>
        <Eyebrow className="text-forest">Why travel with us</Eyebrow>
        <h2 className="mt-8 max-w-5xl font-display text-[length:var(--text-headline)] leading-[1.02] tracking-tight">
          <MaskedLines lines={["We live on these roads.", "Our drivers know which", "ghat to take, and when."]} />
        </h2>
        <div className="mt-16 grid gap-10 border-t border-line pt-10 text-ink-soft md:grid-cols-3">
          {[
            ["Own vehicles, own drivers", "No sub-contracted cabs. The person who picks you up works for us."],
            ["Priced in rupees, honestly", "The package price is the price. Taxes and what is not included are listed up front."],
            ["Reachable on WhatsApp", "A real person answers, before and during your trip."],
          ].map(([t, d]) => (
            <div key={t}><h3 className="font-display text-2xl text-charcoal">{t}</h3><p className="mt-3">{d}</p></div>
          ))}
        </div>
      </Container>
    </section>
  );
}
