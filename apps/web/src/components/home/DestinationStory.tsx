"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { DestinationDTO } from "@travel/types";
import { MQ, ease, setupGsap } from "@/lib/motion";
import { useGSAP } from "@/lib/motion/useGsapContext";

/**
 * Desktop: one pinned viewport; each destination wipes over the previous with a scrubbed clip-path.
 * Mobile / reduced motion: plain stacked full-bleed sections, no pinning.
 */
export function DestinationStory({ items }: { items: DestinationDTO[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const { gsap } = setupGsap();
    const mm = gsap.matchMedia();
    mm.add(MQ.desktop, () => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, pin: true, scrub: 0.8, start: "top top", end: () => `+=${(panels.length - 1) * 100}%` },
      });
      panels.forEach((p, i) => {
        if (i === 0) return;
        tl.fromTo(p, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: ease.inOut }, `+=0.1`)
          .fromTo(p.querySelector("[data-pimg]"), { scale: 1.3 }, { scale: 1 }, "<")
          .fromTo(p.querySelector("[data-ptext]"), { yPercent: 25, opacity: 0 }, { yPercent: 0, opacity: 1 }, "<0.3");
        tl.to(panels[i - 1].querySelector("[data-pimg]"), { scale: 1.08 }, "<");
      });
    });
    return () => mm.revert();
  }, root);

  return (
    <section ref={root} aria-label="Destinations" className="relative bg-charcoal text-ivory lg:h-screen lg:overflow-hidden">
      {items.map((d, i) => (
        <article key={d.id} data-panel className="relative h-[85svh] lg:absolute lg:inset-0 lg:h-full">
          <div data-pimg className="absolute inset-0 will-change-transform">
            <Image src={d.heroImage} alt={`${d.name}, ${d.state}`} fill sizes="100vw" className="object-cover" priority={i === 0} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
          <div data-ptext className="absolute inset-x-0 bottom-0 px-5 pb-14 md:px-10 lg:px-[5vw] lg:pb-20">
            <p className="text-xs uppercase tracking-[0.28em] text-ivory/75">{String(i + 1).padStart(2, "0")} · {d.state}</p>
            <h2 className="mt-3 font-display text-[length:var(--text-display)] leading-[0.9]">{d.name}</h2>
            <p className="mt-4 max-w-md text-lg text-ivory/85">{d.tagline}</p>
            <Link href={`/destinations/${d.slug}`} className="mt-6 inline-flex min-h-11 items-center gap-2 border-b border-ivory/60 pb-1 text-sm tracking-wide hover:border-accent">Explore {d.name} <span aria-hidden>→</span></Link>
          </div>
        </article>
      ))}
    </section>
  );
}
