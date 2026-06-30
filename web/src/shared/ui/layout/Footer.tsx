"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useHomepageShell } from "@/hooks/homepage/useHomepageShell";
import { siteConfig } from "@/shared/lib/siteConfig";
import { resolveShellFooterLinkGroups } from "@/shared/lib/shellNavigation";
import PageContainer from "@/shared/ui/layout/PageContainer";
import TrustBadgeSection from "@/features/cms/components/common/TrustBadges";
import Reveal from "@/shared/Animation/Reveal";

const SOCIAL_ICON_MAP: Record<string, string> = {
  instagram: "/images/navigation/social-instagram.svg",
  facebook: "/images/navigation/social-facebook.svg",
  x: "/images/navigation/social-x.svg",
  twitter: "/images/navigation/social-x.svg",
  linkedin: "/images/navigation/social-linkedin.svg",
};

const SOCIAL_FALLBACK = [
  { id: "instagram", label: "Instagram", href: siteConfig.social.instagram, icon: SOCIAL_ICON_MAP.instagram },
  { id: "facebook", label: "Facebook", href: siteConfig.social.facebook, icon: SOCIAL_ICON_MAP.facebook },
  { id: "x", label: "X", href: "https://x.com/sunnydiamonds", icon: SOCIAL_ICON_MAP.x },
  { id: "linkedin", label: "LinkedIn", href: "https://linkedin.com/company/sunnydiamonds", icon: SOCIAL_ICON_MAP.linkedin },
] satisfies { id: string; label: string; href: string; icon: string }[];

const DEFAULT_COPYRIGHT = "© 2026 Sunny Diamonds. All Rights Reserved.";

const Footer = () => {
  const { data: shellData } = useHomepageShell();

  const cmsFooterLinkGroups = shellData?.global?.footerLinkGroups || shellData?.footerLinkGroups;
  const footerLinkGroups = useMemo(
    () => resolveShellFooterLinkGroups(cmsFooterLinkGroups),
    [cmsFooterLinkGroups],
  );

  const footerCopyright =
    shellData?.global?.footerCopyright ||
    shellData?.footerCopyright ||
    DEFAULT_COPYRIGHT;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cmsSocialLinks: any[] = shellData?.global?.socialLinks || shellData?.socialLinks || [];
  const socialLinks = useMemo(() => {
    if (!cmsSocialLinks.length) return SOCIAL_FALLBACK;

    const cmsMap = new Map<string, string>(
      (cmsSocialLinks as Array<{ label: string; url: string; isActive?: boolean }>)
        .filter((item) => item?.isActive !== false && item?.url)
        .map((item) => [item.label.toLowerCase(), item.url]),
    );

    return SOCIAL_FALLBACK.map((item) => ({
      ...item,
      href: cmsMap.get(item.id) ?? cmsMap.get(item.label.toLowerCase()) ?? item.href,
    }));
  }, [cmsSocialLinks]);

  return (
    <footer className="bg-chalk-beige">
      <TrustBadgeSection />
      <PageContainer className="flex flex-col gap-20 lg:gap-[120px] lg:py-100 py-16">
        <div className="flex flex-col items-center xl:gap-12 md:gap-[40px] gap-8 lg:flex-row lg:items-start lg:justify-start">
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
        </div>
        <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
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
          <div className="relative h-[25px] w-[320px] lg:w-[380px]">
            <Image
              src="/images/navigation/payment-methods.png"
              alt="Accepted payment methods: Visa, Mastercard, Amex, Maestro, PayTM, RuPay"
              fill
              sizes="(max-width: 1024px) 320px, 380px"
              className="object-contain object-left"
            />
          </div>

          <p className="text-center font-gill text-sm font-light leading-110 text-neutral500 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:whitespace-nowrap">
            {footerCopyright}
          </p>
        </div>
      </PageContainer>
    </footer>
  );
};

export default Footer;
