import clsx from "clsx";
import type { ComponentProps } from "react";

export function Eyebrow({ className, ...props }: ComponentProps<"p">) {
  return <p {...props} className={clsx("text-xs font-medium uppercase tracking-[0.28em]", className)} />;
}
