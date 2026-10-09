"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "./useGsapContext";
import { MQ, ease, setupGsap } from "./gsap";

type Props = { children: ReactNode; className?: string; delay?: number };

/** Image wrapper: clip-path opens upward while the content settles from a slight zoom. */
export function ClipReveal({ children, className, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const { gsap } = setupGsap();
    const el = ref.current!;
    const inner = el.firstElementChild as HTMLElement;
    const scrollTrigger = { trigger: el, start: "top 88%", once: true };
    const mm = gsap.matchMedia();
    mm.add(MQ.reduced, () => {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.6, scrollTrigger });
    });
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: ease.inOut, delay, scrollTrigger });
      gsap.fromTo(inner, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: ease.out, delay, scrollTrigger });
    });
    return () => mm.revert();
  }, ref);

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <div className="h-full w-full will-change-transform">{children}</div>
    </div>
  );
}
