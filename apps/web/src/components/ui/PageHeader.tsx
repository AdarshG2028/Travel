import Image from "next/image";
import { MaskedLines } from "@/lib/motion";
import { Eyebrow } from "./Eyebrow";

type Props = { eyebrow: string; title: string[]; intro?: string; image?: string; imageAlt?: string };

/** Interior page header. With an image it is a dark, full-bleed band; without, a quiet ivory block. */
export function PageHeader({ eyebrow, title, intro, image, imageAlt = "" }: Props) {
  const dark = !!image;
  return (
    <header className={`relative overflow-hidden ${dark ? "min-h-[70svh] text-ivory" : "pt-40 pb-16"} flex items-end`}>
      {image && (
        <>
          <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />
        </>
      )}
      <div className={`relative w-full px-5 md:px-10 lg:px-[5vw] ${dark ? "pb-14 pt-40" : ""}`}>
        <Eyebrow className={dark ? "text-ivory/80" : "text-forest"}>{eyebrow}</Eyebrow>
        <h1 className="mt-5 font-display text-[length:var(--text-display)] leading-[0.92] tracking-tight">
          <MaskedLines trigger="load" lines={title} />
        </h1>
        {intro && <p className={`mt-6 max-w-xl text-lg ${dark ? "text-ivory/85" : "text-ink-soft"}`}>{intro}</p>}
      </div>
    </header>
  );
}
