import type { PropsWithChildren } from "react";
import { cn } from "@/shared/utils/cn";

type CardProps = PropsWithChildren<{
  title?: string;
  className?: string;
}>;

export function Card({ title, className, children }: CardProps) {
  return (
    <section className={cn("rounded-xl border border-slate-800 bg-slate-900/70 p-6", className)}>
      {title ? <h2 className="mb-4 text-lg font-semibold text-slate-100">{title}</h2> : null}
      {children}
    </section>
  );
}
