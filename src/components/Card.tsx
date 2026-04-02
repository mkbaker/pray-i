import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardVariant = "form" | "panel" | "certificate" | "metrics" | "log";

type PolymorphicComponentProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
} & ComponentPropsWithoutRef<T>;

const variantStyles: Record<CardVariant, string> = {
  form: "rounded-3xl bg-[color:var(--pray-color-white-50)] p-6 sm:p-10 shadow-[0_24px_60px_var(--pray-color-ink-08)] backdrop-blur-sm",
  panel:
    "rounded-3xl bg-[color:var(--pray-color-warm-panel)] shadow-[0_28px_70px_var(--pray-color-ink-18)]",
  certificate:
    "rounded-[32px] bg-[color:var(--pray-color-warm-certificate)] px-6 py-8 sm:px-10 sm:py-10 shadow-[0_30px_80px_var(--pray-color-ink-22)]",
  metrics:
    "rounded-2xl bg-[color:var(--pray-color-white-90)] p-4 shadow-[0_18px_50px_var(--pray-color-ink-16)]",
  log: "rounded-2xl bg-[color:var(--pray-color-white-65)] p-4 shadow-[0_16px_40px_var(--pray-color-ink-16)]",
};

export function Card<T extends ElementType = "div">({
  children,
  variant = "form",
  className,
  as,
  ...props
}: PolymorphicComponentProps<T>) {
  const Component = as || "div";
  return (
    <Component className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </Component>
  );
}
