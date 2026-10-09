"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "./useGsapContext";
import { MQ, setupGsap } from "./gsap";

type Props = { children: ReactNode; className?: string };

/** Desktop: pins the section and scrolls the track sideways. Mobile/reduced: a native swipeable row. */
export function HorizontalRail({ children, className }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const { gsap } = setupGsap();
    const mm = gsap.matchMedia();
    mm.add(MQ.desktop, () => {
      const t = track.current!;
      const distance = () => t.scrollWidth - window.innerWidth;
      gsap.to(t, {
        x: () => -distance(), ease: "none",
        scrollTrigger: { trigger: root.current, pin: true, scrub: 0.6, start: "top top", end: () => `+=${distance()}`, invalidateOnRefresh: true },
      });
    });
    return () => mm.revert();
  }, root);

  return (
    <div ref={root} className={className}>
      <div ref={track} className="flex gap-6 overflow-x-auto px-5 pb-4 lg:w-max lg:overflow-visible lg:px-[8vw]">
        {children}
      </div>
    </div>
  );
}
