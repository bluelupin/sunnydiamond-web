"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ContactPhoneLink from "@/features/contact/components/ContactPhoneLink";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { fetchSupportPage } from "@/services/support/support-page.fetch";
import type { NormalizedSupportContactOption } from "@/services/support/support-page.types";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useToast } from "@/shared/hooks/use-toast";
import { cn } from "@/shared/utils/cn";
import { ProfileSupportListingSkeleton } from "./ProfileSupportListingSkeleton";

/** Figma 1480:39360 — Help & Support contact cards */
const outlineCtaClassName =
  "btn-border-slide inline-flex h-14 w-fit shrink-0 items-center justify-center border border-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack";

const contactLinkClassName =
  "font-gill text-sm font-normal leading-110 text-darkblack";

function getClipboardPhoneValue(href: string, fallbackLabel?: string): string {
  const fromHref = href.replace(/^tel:/i, "").trim();
  if (fromHref) return fromHref;
  return fallbackLabel?.trim() ?? "";
}

const ProfileSupportSection = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [options, setOptions] = useState<NormalizedSupportContactOption[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    void fetchSupportPage({ signal: controller.signal }).then((page) => {
      if (controller.signal.aborted) {
        return;
      }

      setOptions(page.contactOptions);
      setHasLoaded(true);
    });

    return () => controller.abort();
  }, []);

  const handleDesktopTelClick = async (href: string, phoneLabel?: string | null) => {
    try {
      await navigator.clipboard.writeText(getClipboardPhoneValue(href, phoneLabel ?? undefined));
      toast({ title: "Phone number copied" });
    } catch {
      toast({
        title: "Unable to copy",
        description: "Please copy the phone number manually.",
      });
    }
  };

  if (!hasLoaded) {
    return <ProfileSupportListingSkeleton />;
  }

  if (options.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:gap-6 gap-4 md:grid-cols-2 xl:grid-cols-2 lg:grid-cols-1">
      {options.map((option) => {
        const isPhone = Boolean(option.phoneHref);
        const valueHref = option.phoneHref ?? option.emailHref;
        const valueLabel = option.phone ?? option.email;
        const ctaIsTel = Boolean(option.cta?.url && /^tel:/i.test(option.cta.url));

        return (
          <div
            key={option.id}
            className="flex flex-col justify-between gap-6 bg-gray300 p-6 text-left"
          >
            <div className="flex w-full flex-col items-start md:gap-6 gap-4">
              <h3 className="font-larken font-light leading-110 text-darkblack md:text-2xl text-xl">
                {option.title}
              </h3>
              <div className="flex w-full flex-col items-start gap-4">
                {isPhone && option.hours.length > 0 ? (
                  <div className="flex flex-col items-start gap-2 text-base leading-110 text-darkblack">
                    {option.hours.map((entry) => (
                      <div
                        key={`${option.id}-${entry.label}-${entry.value}`}
                        className="flex flex-wrap items-center gap-3 text-base"
                      >
                        {entry.label ? (
                          <span className="font-gill font-light">{entry.label}</span>
                        ) : null}
                        <span className="font-gill font-normal">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                ) : option.description ? (
                  <p className="max-w-full font-gill text-base font-light leading-110 text-darkblack">
                    {option.description}
                  </p>
                ) : null}

                {isPhone && valueHref && valueLabel ? (
                  <ContactPhoneLink
                    href={valueHref}
                    label={valueLabel}
                    variant="detail"
                    className={cn(contactLinkClassName)}
                  />
                ) : valueHref && valueLabel ? (
                  <DetailTextLink href={valueHref} className={cn(contactLinkClassName)}>
                    {valueLabel}
                  </DetailTextLink>
                ) : null}
              </div>
            </div>
            {option.cta ? (
              ctaIsTel && !isMobile ? (
                <button
                  type="button"
                  className={cn(outlineCtaClassName)}
                  onClick={() =>
                    void handleDesktopTelClick(option.cta!.url, option.phone)
                  }
                >
                  <span className="relative z-10">{option.cta.label}</span>
                </button>
              ) : (
                <Link href={option.cta.url} className={cn(outlineCtaClassName)}>
                  <span className="relative z-10">{option.cta.label}</span>
                </Link>
              )
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default ProfileSupportSection;
