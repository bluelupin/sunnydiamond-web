"use client";

import ContactCardCtaLink from "./ContactCardCtaLink";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { useToast } from "@/shared/hooks/use-toast";
import { useIsMobile } from "@/shared/hooks/use-mobile";

type ContactPhoneLinkProps = {
  href?: string;
  label: string;
  className?: string;
  /** Matches DetailTextLink styling used on Contact info cards; default keeps ContactCardCtaLink. */
  variant?: "card" | "detail";
};

const getClipboardPhoneValue = (href: string | undefined, label: string): string => {
  const trimmedLabel = label.trim();
  if (trimmedLabel) {
    return trimmedLabel;
  }

  return href?.replace(/^tel:/i, "").trim() ?? "";
};

const ContactPhoneLink = ({
  href,
  label,
  className,
  variant = "card",
}: ContactPhoneLinkProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleCopyPhoneNumber = async () => {
    try {
      await navigator.clipboard.writeText(getClipboardPhoneValue(href, label));
      toast({
        title: "Phone number copied",
      });
    } catch {
      toast({
        title: "Unable to copy",
        description: "Please copy the phone number manually.",
      });
    }
  };

  if (variant === "detail") {
    if (isMobile && href) {
      return (
        <DetailTextLink href={href} className={className}>
          {label}
        </DetailTextLink>
      );
    }

    if (!href) {
      return (
        <DetailTextLink className={className} disabled>
          {label}
        </DetailTextLink>
      );
    }

    return (
      <DetailTextLink onClick={handleCopyPhoneNumber} className={className}>
        {label}
      </DetailTextLink>
    );
  }

  if (isMobile && href) {
    return (
      <ContactCardCtaLink href={href} className={className}>
        {label}
      </ContactCardCtaLink>
    );
  }

  if (!href) {
    return (
      <ContactCardCtaLink className={className}>
        {label}
      </ContactCardCtaLink>
    );
  }

  return (
    <ContactCardCtaLink onClick={handleCopyPhoneNumber} className={className}>
      {label}
    </ContactCardCtaLink>
  );
};

export default ContactPhoneLink;
