"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { siteConfig } from "@/shared/lib/siteConfig";
import { useHomepageShell } from "@/hooks/homepage/useHomepageShell";
import { resolveShellFooterLinkGroups } from "@/shared/lib/shellNavigation";

/* ── Social icon asset map ─────────────────────────────────────── */
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

const Footer = () => {
  const { data: shellData } = useHomepageShell();

  /* Footer link columns — CMS with fallback to siteConfig */
  const cmsFooterLinkGroups = shellData?.global?.footerLinkGroups || shellData?.footerLinkGroups;
  const footerLinkGroups = useMemo(
    () => resolveShellFooterLinkGroups(cmsFooterLinkGroups),
    [cmsFooterLinkGroups],
  );

  /* Copyright — CMS with fallback */
  const footerCopyright =
    shellData?.global?.footerCopyright ||
    shellData?.footerCopyright ||
    "© Sunny Diamonds. All Rights Reserved.";

  /* Social links — always show all 4 icons; override URLs with CMS data where present */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cmsSocialLinks: any[] = shellData?.global?.socialLinks || shellData?.socialLinks || [];
  const socialLinks = useMemo(() => {
    if (!cmsSocialLinks.length) return SOCIAL_FALLBACK;
    // Build lookup: label → url from CMS
    const cmsMap = new Map<string, string>(
      (cmsSocialLinks as Array<{ label: string; url: string; isActive?: boolean }>)
        .filter((item) => item?.isActive !== false && item?.url)
        .map((item) => [item.label.toLowerCase(), item.url]),
    );
    // Use the full fallback list but override hrefs with CMS URLs when available
    return SOCIAL_FALLBACK.map((item) => ({
      ...item,
      href: cmsMap.get(item.id) ?? cmsMap.get(item.label.toLowerCase()) ?? item.href,
    }));
  }, [cmsSocialLinks]);

  return (
    <footer className="bg-[#F4F3EE]">
      <div className="flex flex-col gap-[80px] px-5 py-16 sm:px-10 lg:gap-[120px] lg:px-[40px] lg:py-[104px]">

        {/* ── Main section: logo + nav columns ──────────────────── */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">

          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" aria-label="Sunny Diamonds">
              <Image
                src="/images/brand/logo-desktop.svg"
                alt="Sunny Diamonds"
                width={336}
                height={142}
                className="h-auto w-[180px] sm:w-[240px] lg:w-[336px]"
                priority
              />
            </Link>
          </div>

          {/* Navigation columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 lg:flex lg:gap-[16px]">
            {footerLinkGroups.map((column) => (
              <div key={column.id} className="flex w-full flex-col gap-[24px] lg:w-[219px]">
                <p className="font-gill text-[20px] font-normal leading-[110%] text-[#0a0a0a] opacity-90">
                  {column.title.toUpperCase()}
                </p>
                <ul className="flex flex-col gap-[12px]">
                  {column.links.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.url}
                        className="font-gill text-[14px] font-light leading-[110%] text-[#4D4D4D] transition-colors hover:text-[#722257]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar: social | copyright | payment ──────────── */}
        <div className="flex flex-col items-center gap-6 lg:relative lg:flex-row lg:items-center lg:justify-between">

          {/* Social icons */}
          <div className="flex items-center gap-[28px]">
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
                  alt={social.label}
                  width={24}
                  height={24}
                  className="size-6"
                />
              </a>
            ))}
          </div>

          {/* Copyright — centred absolutely on desktop, inline on mobile */}
          <p className="text-center font-gill text-[14px] font-light leading-[110%] text-[#4D4D4D] lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:whitespace-nowrap">
            {footerCopyright}
          </p>

          {/* Payment methods strip */}
          <Image
            src="/images/navigation/payment-methods.png"
            alt="Accepted payment methods: Visa, Mastercard, Amex, Maestro, PayTM, RuPay"
            width={380}
            height={25}
            className="h-auto max-h-[25px] w-auto max-w-[320px] lg:max-w-[380px]"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
