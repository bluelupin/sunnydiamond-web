"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useHomepageShell } from "@/hooks/homepage/useHomepageShell";
import { resolveShellFooterLinkGroups } from "@/shared/lib/shellNavigation";
import PageContainer from "@/shared/ui/layout/PageContainer";
import TrustBadgeSection from "@/features/cms/components/common/TrustBadges";
import Reveal from "@/shared/Animation/Reveal";
import { cn } from "@/shared/utils/cn";

const SOCIAL_ICON_MAP: Record<string, string> = {
  instagram: "/images/navigation/social-instagram.svg",
  facebook: "/images/navigation/social-facebook.svg",
  x: "/images/navigation/social-x.svg",
  twitter: "/images/navigation/social-x.svg",
  linkedin: "/images/navigation/social-linkedin.svg",
};

type CmsSocialLink = {
  label?: string | null;
  url?: string | null;
  isActive?: boolean | null;
};

function resolveShellSocialLinks(
  cmsSocialLinks: readonly CmsSocialLink[] | null | undefined,
): Array<{ id: string; label: string; href: string; icon: string }> {
  if (!cmsSocialLinks?.length) {
    return [];
  }

  return cmsSocialLinks
    .filter((item) => item?.isActive !== false && item?.url?.trim())
    .map((item) => {
      const label = item.label?.trim() ?? "";
      const href = item.url?.trim() ?? "";
      const iconKey = label.toLowerCase();
      const icon = SOCIAL_ICON_MAP[iconKey];

      if (!label || !href || !icon) {
        return null;
      }

      return {
        id: iconKey,
        label,
        href,
        icon,
      };
    })
    .filter((item): item is { id: string; label: string; href: string; icon: string } =>
      Boolean(item),
    );
}

const Footer = ({ className }: { className?: string }) => {
  const pathName = usePathname();
  const { data: shellData } = useHomepageShell();
  const cmsFooterLinkGroups = shellData?.global?.footerLinkGroups || shellData?.footerLinkGroups;
  const footerLinkGroups = useMemo(
    () => resolveShellFooterLinkGroups(cmsFooterLinkGroups),
    [cmsFooterLinkGroups],
  );

  const footerCopyright = (
    shellData?.global?.footerCopyright ||
    shellData?.footerCopyright ||
    ""
  ).trim();

  const cmsSocialLinks = shellData?.global?.socialLinks || shellData?.socialLinks;
  const socialLinks = useMemo(
    () => resolveShellSocialLinks(cmsSocialLinks as CmsSocialLink[] | null | undefined),
    [cmsSocialLinks],
  );

  const hasFooterNavigation = footerLinkGroups.length > 0;
  const hasSocialLinks = socialLinks.length > 0;
  const hasCopyright = footerCopyright.length > 0;

  return (
    <footer className={cn(pathName === "/cart" || pathName === "/checkout" ? "bg-gray200" : "bg-gray300", className)}>
      <TrustBadgeSection />
      <PageContainer className="flex flex-col gap-20 lg:gap-[120px] lg:py-100 py-16">
        <div className="flex flex-col items-center xl:gap-12 md:gap-10 gap-8 lg:flex-row lg:items-start lg:justify-start">
          <Reveal direction="up" className="shrink-0">
            <Link href="/" aria-label="Sunny Diamonds">
              <Image
                src="/images/brand/logo-desktop.svg"
                alt="Sunny Diamonds"
                width={336}
                height={142}
                loading="lazy"
                fetchPriority="low"
                className="h-auto w-[200px] xl:w-[336px]"
              />
            </Link>
          </Reveal>
          {hasFooterNavigation ? (
            <nav
              aria-label="Footer navigation"
              className="grid md:grid-cols-4 grid-cols-2 lg:flex lg:w-full xl:max-w-[923px] w-full justify-between lg:gap-4 gap-8"
            >
              {footerLinkGroups.map((column) => (
                <div
                  key={column.id}
                  className="flex w-full flex-col gap-6"
                >
                  <Reveal as="p" direction="up" className="font-gill lg:text-xl md:text-lg text-base font-normal leading-110 text-darkblack">
                    {column.title.toUpperCase()}
                  </Reveal>
                  <ul className="flex flex-col gap-[12px]">
                    {column.links.map((link) => (
                      <Reveal as="li" direction="up" key={link.id}>
                        <Link
                          href={link.url}
                          className="font-gill text-sm font-light leading-110 text-neutral500 transition-colors hover:text-darkMagenta"
                        >
                          {link.label}
                        </Link>
                      </Reveal>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          ) : null}
        </div>
        <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
          {hasSocialLinks ? (
            <div className="flex items-center gap-7">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-60"
                >
                  <Image
                    src={social.icon}
                    alt=""
                    width={24}
                    height={24}
                    aria-hidden
                    className="size-6"
                  />
                </a>
              ))}
            </div>
          ) : null}
          <div className="relative h-[25px] w-[320px] lg:w-[380px]">
            <Image
              src="/images/navigation/payment-methods.png"
              alt="Accepted payment methods: Visa, Mastercard, Amex, Maestro, PayTM, RuPay"
              fill
              sizes="(max-width: 1024px) 320px, 380px"
              className="object-contain object-left"
            />
          </div>

          {hasCopyright ? (
            <p className="text-center font-gill text-sm font-light leading-110 text-neutral500 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:whitespace-nowrap">
              {footerCopyright}
            </p>
          ) : null}
        </div>
      </PageContainer>
    </footer>
  );
};

export default Footer;
