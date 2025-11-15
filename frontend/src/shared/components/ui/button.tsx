import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/shared/utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  const styles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-brand-600 text-white hover:bg-brand-500 focus-visible:outline-brand-400",
    ghost: "bg-transparent text-brand-300 hover:bg-slate-800 focus-visible:outline-brand-400"
  };

  return <button className={cn(base, styles[variant], className)} {...props} />;
}
