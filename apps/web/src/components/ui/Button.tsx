import Link from "next/link";
import clsx from "clsx";
import type { ComponentProps } from "react";

type Variant = "solid" | "outline" | "light";
const styles: Record<Variant, string> = {
  solid: "bg-charcoal text-ivory hover:bg-forest",
  outline: "border border-charcoal/30 text-charcoal hover:bg-charcoal hover:text-ivory",
  light: "bg-ivory text-charcoal hover:bg-accent hover:text-ivory",
};

export function Button({ variant = "solid", className, children, ...props }: ComponentProps<typeof Link> & { variant?: Variant }) {
  return (
    <Link
      {...props}
      className={clsx("group inline-flex min-h-12 items-center gap-3 rounded-full px-7 text-sm font-medium tracking-wide transition-colors duration-300", styles[variant], className)}
    >
      {children}
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
    </Link>
  );
}
