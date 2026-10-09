"use client";

import { useRef, type ElementType } from "react";
import { useGSAP } from "./useGsapContext";
import { MQ, ease, setupGsap } from "./gsap";

type Props = {
  lines: string[];
  as?: ElementType;
  className?: string;
  /** "load" plays immediately (hero); "scroll" plays when entering the viewport. */
  trigger?: "load" | "scroll";
  delay?: number;
};

/** Headline reveal: each line slides up from inside its own mask. Reduced motion falls back to a fade. */
export function MaskedLines({ lines, as: Tag = "div", className, trigger = "scroll", delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const { gsap } = setupGsap();
    const el = ref.current!;
    const inner = el.querySelectorAll<HTMLElement>("[data-line]");
    const scrollTrigger = trigger === "scroll" ? { trigger: el, start: "top 85%", once: true } : undefined;
    const mm = gsap.matchMedia();
    mm.add(MQ.reduced, () => {
      gsap.fromTo(inner, { opacity: 0 }, { opacity: 1, duration: 0.6, delay, scrollTrigger });
    });
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(inner, { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: ease.out, stagger: 0.12, delay, scrollTrigger });
    });
    return () => mm.revert();
  }, ref);

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line) => (
        <span key={line} className="line-mask">
          <span data-line className="block will-change-transform">{line}</span>
        </span>
      ))}
    </Tag>
  );
}
