"use client";

import Image from "next/image";
import Link from "next/link";
import { profileTabsContent } from "../data/profileContent";
import { cn } from "@/shared/utils/cn";

const outlineCtaClassName =
  "btn-border-slide inline-flex h-14 shrink-0 items-center justify-center border border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack";

const ProfileSupportSection = () => {
  const { callUs, emailUs } = profileTabsContent.support;

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col items-center gap-6 bg-gray300 p-6 text-center">
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
              <Image
                src="/images/contact/icon-phone.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden
              />
              {callUs.phone}
            </Link>
          </div>

          <Link href={callUs.ctaHref} className={outlineCtaClassName}>
            {callUs.ctaLabel}
          </Link>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 bg-gray300 p-6 text-center">
          <div className="flex w-full flex-col items-center gap-6">
            <h3 className="font-larken text-2xl font-light leading-110 text-darkblack">
              {emailUs.title}
            </h3>

            <div className="flex w-full flex-col items-center gap-4">
              <p className="max-w-full font-gill text-base font-light leading-110 text-darkblack">
                {emailUs.description}
              </p>

              <Link
                href={emailUs.emailHref}
                className="flex flex-wrap items-center justify-center gap-2 font-gill text-base font-normal leading-110 text-darkblack"
              >
                <Image
                  src="/images/contact/icon-email.svg"
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden
                />
                {emailUs.email}
              </Link>
            </div>
          </div>

          <Link href={emailUs.emailHref} className={cn(outlineCtaClassName, "mt-auto")}>
            {emailUs.ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileSupportSection;
