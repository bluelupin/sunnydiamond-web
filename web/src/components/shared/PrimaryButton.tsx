import { cn } from "@/lib/utils";
import Link from "next/link";

type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

const PrimaryButton = ({ children, className, ...props }: PrimaryButtonProps) => (
  <button
    className={cn(
      "btn-slide-up inline-flex items-center justify-center gap-2 bg-primary hover:bg-gold-dark text-primary-foreground px-8 py-3 text-sm tracking-widest uppercase font-body transition-colors",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

interface PrimaryLinkProps {
  children: React.ReactNode;
  to: string;
  className?: string;
}

const PrimaryLink = ({ children, to, className }: PrimaryLinkProps) => (
  <Link
    href={to}
    className={cn(
      "btn-slide-up inline-flex items-center justify-center gap-2 bg-primary hover:bg-gold-dark text-primary-foreground px-8 py-3 text-sm tracking-widest uppercase font-body transition-colors",
      className
    )}
  >
    {children}
  </Link>
);

const OutlineLink = ({ children, to, className }: PrimaryLinkProps) => (
  <Link
    href={to}
    className={cn(
      "btn-slide-up inline-flex items-center justify-center gap-2 border border-foreground text-foreground hover:bg-foreground hover:text-background px-8 py-3 text-sm tracking-widest uppercase font-body transition-colors",
      className
    )}
  >
    {children}
  </Link>
);

export { PrimaryButton, PrimaryLink, OutlineLink };
