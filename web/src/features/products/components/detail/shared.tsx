import Link from "next/link";
import { cn } from "@/shared/utils/cn";

type DetailTextLinkProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  light?: boolean;
};

export const DetailTextLink = ({ children, href, onClick, className, light }: DetailTextLinkProps) => {
  const classes = cn(
    "text-link-underline inline-flex w-fit cursor-pointer border-b-[1.5px] pb-1 font-gill text-sm leading-110",
    light ? "border-white text-white" : "border-darkblack text-darkblack",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
};

type DetailDarkButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

export const DetailDarkButton = ({ children, className, ...props }: DetailDarkButtonProps) => (
  <button
    type="button"
    className={cn(
      "btn-dark-slide inline-flex h-14 w-full items-center justify-center px-7 font-gill text-sm uppercase leading-110 text-white",
      className,
    )}
    {...props}
  >
    <span className="relative z-10">{children}</span>
  </button>
);

type DetailOutlineButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

export const DetailOutlineButton = ({ children, className, ...props }: DetailOutlineButtonProps) => (
  <button
    type="button"
    className={cn(
      "btn-border-slide inline-flex h-14 items-center justify-center border border-neutral300 px-7 font-gill text-sm uppercase leading-110 text-darkblack",
      className,
    )}
    {...props}
  >
    <span className="relative z-10">{children}</span>
  </button>
);

const outlineLinkClassName =
  "btn-border-slide inline-flex h-14 items-center justify-center border border-neutral300 px-7 font-gill text-sm uppercase leading-110 text-darkblack";

type DetailOutlineLinkProps = {
  children: React.ReactNode;
  href: string;
  className?: string;
};

export const DetailOutlineLink = ({ children, href, className }: DetailOutlineLinkProps) => (
  <Link href={href} className={cn(outlineLinkClassName, className)}>
    <span className="relative z-10">{children}</span>
  </Link>
);

export const AttributeSeparator = () => (
  <span aria-hidden className="h-18 w-px shrink-0 bg-neutral300" />
);
