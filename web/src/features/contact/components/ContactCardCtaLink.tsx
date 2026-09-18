"use client";

import Link from "next/link";
import { cn } from "@/shared/utils/cn";

type ContactCardCtaLinkProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  target?: string;
  rel?: string;
};

const ContactCardCtaLink = ({
  children,
  href,
  onClick,
  className,
  target,
  rel,
}: ContactCardCtaLinkProps) => {
  const classes = cn(
    "inline-flex w-fit max-w-full break-all border-b border-darkblack pb-1 font-gill text-sm font-normal leading-110 text-darkblack",
    className,
  );

  if (href) {
    return (
      <Link href={href} target={target} rel={rel} onClick={onClick} className={classes}>
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

export default ContactCardCtaLink;
