"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/lib/site";

const links = [["Destinations", "/destinations"], ["Packages", "/packages"], ["Vehicles", "/vehicles"], ["About", "/about"]] as const;
const EASE = [0.16, 1, 0.3, 1] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 80);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  // Only the home page and detail pages open on a dark image; everywhere else the nav sits on ivory.
  const pathname = usePathname();
  const darkHero = pathname === "/" || /^\/(packages|destinations)\/[^/]+$/.test(pathname);
  const tone = solid || open || !darkHero ? "text-charcoal" : "text-ivory";

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid && !open ? "bg-ivory/90 backdrop-blur" : ""}`}
      >
        <div className={`mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 md:px-10 lg:px-[5vw] ${tone}`}>
          <Link href="/" className="font-display text-lg leading-tight sm:text-2xl" onClick={() => setOpen(false)}>{site.name}</Link>
          <nav aria-label="Primary" className="hidden items-center gap-10 text-sm lg:flex">
            {links.map(([l, h]) => <Link key={h} href={h} className="opacity-90 transition-opacity hover:opacity-100">{l}</Link>)}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/contact" className="hidden min-h-11 items-center rounded-full border border-current px-6 text-sm transition-colors hover:border-accent hover:bg-accent hover:text-ivory lg:inline-flex">Plan a Trip</Link>
            <button type="button" className="min-h-11 px-2 text-sm lg:hidden" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((v) => !v)}>
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu" role="dialog" aria-label="Menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ivory px-6"
          >
            <ul className="space-y-2">
              {links.map(([l, h], i) => (
                <motion.li key={h} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 + i * 0.07, duration: 0.7, ease: EASE }}>
                  <Link href={h} onClick={() => setOpen(false)} className="font-display text-5xl leading-tight">{l}</Link>
                </motion.li>
              ))}
            </ul>
            <Link href="/contact" onClick={() => setOpen(false)} className="mt-10 inline-flex min-h-12 w-fit items-center rounded-full bg-charcoal px-8 text-ivory">Plan a Trip</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
