import clsx from "clsx";
import type { ComponentProps } from "react";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={clsx("mx-auto w-full max-w-[1500px] px-5 md:px-10 lg:px-[5vw]", className)} />;
}
