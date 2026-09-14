"use client";

import Link from "next/link";
import { contactCardLayoutClasses } from "../data/contactHeroFigmaSpec";
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
  const classes = cn(contactCardLayoutClasses.cta, className);

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
