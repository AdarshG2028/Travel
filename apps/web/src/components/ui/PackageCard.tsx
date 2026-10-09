import Image from "next/image";
import Link from "next/link";
import type { PackageDTO } from "@travel/types";
import { durationLabel, formatINR } from "@travel/utils";

export function PackageCard({ p, tone = "light" }: { p: PackageDTO; tone?: "light" | "dark" }) {
  const muted = tone === "dark" ? "text-ivory/65" : "text-ink-soft";
  return (
    <Link href={`/packages/${p.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image src={p.coverImage} alt={`${p.destinationName}: ${p.title}`} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-105" />
      </div>
      <p className={`mt-4 text-xs uppercase tracking-[0.22em] ${muted}`}>{p.route} · {durationLabel(p.days)}</p>
      <h3 className="mt-2 font-display text-3xl">{p.title}</h3>
      <p className={`mt-2 flex items-baseline justify-between border-b pb-3 ${tone === "dark" ? "border-ivory/20" : "border-line"}`}>
        <span>From <span className="font-medium">{formatINR(p.pricePerPerson)}</span> / person</span>
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </p>
    </Link>
  );
}
