"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { DetailOutlineLink } from "@/features/products/components/detail/shared";
import { profileTabsContent } from "../data/profileContent";
import { ProfileAccordion, ProfileCard } from "./profileUi";

const ProfileSupportSection = () => {
  const { callUs, emailUs, faqTitle, faqItems } = profileTabsContent.support;

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ProfileCard className="flex flex-col items-center gap-6 text-center">
          <h3 className="font-larken text-2xl font-light leading-110 text-darkblack">
            {callUs.title}
          </h3>
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-3 text-base leading-110 text-darkblack">
              {callUs.hours.map((entry) => (
                <div key={entry.label} className="flex flex-wrap items-center justify-center gap-3">
                  <span className="font-gill font-light">{entry.label}</span>
                  <span className="font-gill font-normal">{entry.value}</span>
                </div>
              ))}
            </div>
            <Link
              href={callUs.phoneHref}
              className="flex items-center gap-2 font-gill text-base font-normal leading-110 text-darkblack"
            >
              <Phone className="size-6" strokeWidth={1.5} aria-hidden />
              {callUs.phone}
            </Link>
          </div>
          <DetailOutlineLink href={callUs.ctaHref} className="w-full max-w-xs">
            {callUs.ctaLabel}
          </DetailOutlineLink>
        </ProfileCard>

        <ProfileCard className="flex flex-col items-center justify-between gap-6 text-center">
          <div className="flex flex-col items-center gap-6">
            <h3 className="font-larken text-2xl font-light leading-110 text-darkblack">
              {emailUs.title}
            </h3>
            <div className="flex flex-col items-center gap-4">
              <p className="font-gill text-base font-light leading-110 text-darkblack">
                {emailUs.description}
              </p>
              <Link
                href={emailUs.emailHref}
                className="flex items-center gap-2 font-gill text-base font-normal leading-110 text-darkblack"
              >
                <Mail className="size-6" strokeWidth={1.5} aria-hidden />
                {emailUs.email}
              </Link>
            </div>
          </div>
          <DetailOutlineLink href={emailUs.emailHref} className="w-full max-w-xs">
            {emailUs.ctaLabel}
          </DetailOutlineLink>
        </ProfileCard>
      </div>

      <section aria-labelledby="profile-support-faq" className="flex flex-col gap-10 py-6">
        <h2
          id="profile-support-faq"
          className="text-center font-larken text-32 font-light leading-110 text-darkblack md:text-5xl"
        >
          {faqTitle}
        </h2>
        <ProfileAccordion items={faqItems} />
      </section>
    </div>
  );
};

export default ProfileSupportSection;
