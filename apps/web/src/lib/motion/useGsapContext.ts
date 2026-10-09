"use client";

import { useLayoutEffect, type RefObject } from "react";
import { setupGsap } from "./gsap";

/** Scoped GSAP hook: runs `fn` once on mount and reverts everything on unmount. */
export function useGSAP(fn: () => void | (() => void), scope: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const { gsap } = setupGsap();
    let cleanup: void | (() => void);
    const ctx = gsap.context(() => {
      cleanup = fn();
    }, scope);
    return () => {
      if (typeof cleanup === "function") cleanup();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
