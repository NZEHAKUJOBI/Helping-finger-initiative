import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "accent" | "outline" | "ghost" | "light" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-brand-800 text-white shadow-soft hover:bg-brand-900",
  accent: "bg-accent-400 text-brand-950 shadow-soft hover:bg-accent-300",
  outline: "border border-brand-900/20 bg-white/60 text-brand-900 hover:border-brand-900/40 hover:bg-white",
  ghost: "text-brand-800 hover:bg-brand-50",
  light: "bg-white text-brand-900 shadow-soft hover:bg-cream",
  danger: "bg-alert-500 text-white hover:brightness-95",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[15px]",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );
}

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  onClick?: () => void;
}

export function ButtonLink({ href, children, variant, size, className, onClick }: ButtonLinkProps) {
  return (
    <Link href={href} onClick={onClick} className={buttonClasses(variant, size, className)}>
      {children}
    </Link>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={buttonClasses(variant, size, className)} {...props} />;
}
