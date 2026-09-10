"use client";

import { DetailTextLink } from "@/features/products/components/detail/shared";
import { useToast } from "@/shared/hooks/use-toast";
import { useIsMobile } from "@/shared/hooks/use-mobile";

type ContactPhoneLinkProps = {
  href: string;
  label: string;
  className?: string;
};

const getClipboardPhoneValue = (href: string, label: string): string => {
  const trimmedLabel = label.trim();
  if (trimmedLabel) {
    return trimmedLabel;
  }

  return href.replace(/^tel:/i, "").trim();
};

const ContactPhoneLink = ({ href, label, className }: ContactPhoneLinkProps) => {
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

  if (isMobile) {
    return (
      <DetailTextLink href={href} className={className}>
        {label}
      </DetailTextLink>
    );
  }

  return (
    <DetailTextLink onClick={handleCopyPhoneNumber} className={className}>
      {label}
    </DetailTextLink>
  );
};

export default ContactPhoneLink;
