"use client";

import Image from "next/image";
import { useRef } from "react";
import { MaskedLines, setupGsap, ease, MQ } from "@/lib/motion";
import { useGSAP } from "@/lib/motion/useGsapContext";
import { Button } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";

export function Hero({ image }: { image: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const { gsap } = setupGsap();
    const mm = gsap.matchMedia();
    mm.add(MQ.reduced, () => {
      gsap.fromTo("[data-hero-fade]", { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.1 });
    });
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ defaults: { ease: ease.out } });
      tl.fromTo("[data-hero-frame]", { clipPath: "inset(12% 8% 12% 8%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: ease.inOut })
        .fromTo("[data-hero-img]", { scale: 1.35 }, { scale: 1, duration: 2.2 }, 0)
        .fromTo("[data-hero-fade]", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.15 }, 1.3)
        .fromTo("[data-hero-scroll]", { opacity: 0 }, { opacity: 1, duration: 1 }, 2);
      // Subtle scroll-off: image drifts and darkens as you leave the hero.
      if (window.innerWidth >= 1024) {
        gsap.to("[data-hero-img]", { yPercent: 12, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      }
    });
    return () => mm.revert();
  }, root);

  return (
    <section ref={root} className="relative h-[100svh] min-h-[640px] overflow-hidden bg-forest-deep text-ivory">
      <div data-hero-frame className="absolute inset-0">
        <div data-hero-img className="absolute inset-0 will-change-transform">
          <Image src={image} alt="A winding road through green Western Ghats hill country" fill priority sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/60" />
      </div>
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
        <Eyebrow data-hero-fade className="mb-6 text-ivory/80">Bengaluru · Karnataka · Kerala · Tamil Nadu</Eyebrow>
        <h1 className="font-display text-[length:var(--text-display)] leading-[0.95] tracking-tight">
          <MaskedLines trigger="load" delay={0.9} lines={["South India", "is calling"]} />
        </h1>
        <p data-hero-fade className="mt-8 max-w-md text-lg text-ivory/85">From Bengaluru, take the road into the Western Ghats. Trips and vehicles, planned by people who live here.</p>
        <div data-hero-fade className="mt-10"><Button href="/packages" variant="light">Explore Trips</Button></div>
      </div>
      <p data-hero-scroll aria-hidden className="absolute bottom-6 right-6 z-10 text-xs uppercase tracking-[0.28em] text-ivory/70">Scroll ↓</p>
    </section>
  );
}
