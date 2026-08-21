import Link from "next/link";
import { cn } from "@/shared/utils/cn";

type DetailTextLinkProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  light?: boolean;
  disabled?: boolean;
  target?: string;
  rel?: string;
};

export const DetailTextLink = ({
  children,
  href,
  onClick,
  className,
  light,
  disabled = false,
  target,
  rel,
}: DetailTextLinkProps) => {
  const classes = cn(
    "inline-flex w-fit uppercase",
    "relative shrink-0 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:transition-all after:duration-300 border-b-[1.5px] pb-1 font-gill text-sm font-normal leading-110 sm:pb-1",
    disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:after:w-full",
    className,
    disabled
      ? light
        ? "text-white border-white/80"
        : "text-darkblack border-darkblack"
      : light
        ? "text-white border-white/80 hover:border-white hover:text-white after:bg-white"
        : "text-darkblack border-darkblack hover:border-darkMagenta hover:text-darkMagenta after:bg-darkMagenta",
  );

  if (href) {
    const handleClick =
      disabled || onClick
        ? (event: React.MouseEvent<HTMLAnchorElement>) => {
            if (disabled) {
              event.preventDefault();
              return;
            }
            onClick?.();
          }
        : undefined;

    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        {...(handleClick ? { onClick: handleClick } : {})}
        aria-disabled={disabled || undefined}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={classes}>
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
      "btn-dark-slide inline-flex h-14 w-full items-center justify-center px-7 font-gill text-sm uppercase leading-110 text-white border border-black",
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
