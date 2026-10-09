"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "./useGsapContext";
import { MQ, setupGsap } from "./gsap";

type Props = { children: ReactNode; className?: string; /** Percent of own height to travel. */ amount?: number };

/** Scrubbed vertical drift. Stronger on desktop, softened on mobile, absent for reduced motion. */
export function Parallax({ children, className, amount = 12 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const { gsap } = setupGsap();
    const el = ref.current!;
    const run = (a: number) =>
      gsap.fromTo(el, { yPercent: -a }, { yPercent: a, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    const mm = gsap.matchMedia();
    mm.add(MQ.desktop, () => { run(amount); });
    mm.add(MQ.mobile, () => { run(amount / 3); });
    return () => mm.revert();
  }, ref);

  return <div ref={ref} className={className}>{children}</div>;
}
