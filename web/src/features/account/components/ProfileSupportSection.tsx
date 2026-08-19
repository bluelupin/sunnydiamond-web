"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ContactSupportIcon } from "@/features/contact/components/ContactSupportIcon";
import { fetchSupportPage } from "@/services/support/support-page.fetch";
import type { NormalizedSupportContactOption } from "@/services/support/support-page.types";
import { cn } from "@/shared/utils/cn";
import { ProfileSupportListingSkeleton } from "./ProfileSupportListingSkeleton";

const outlineCtaClassName =
  "btn-border-slide inline-flex h-14 shrink-0 items-center justify-center border border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack hover:text-white";

const ProfileSupportSection = () => {
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

  if (!hasLoaded) {
    return <ProfileSupportListingSkeleton />;
  }

  if (options.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 lg:grid-cols-1 md:grid-cols-2">
        {options.map((option) => {
          const isPhone = Boolean(option.phoneHref);
          const valueHref = option.phoneHref ?? option.emailHref;
          const valueLabel = option.phone ?? option.email;

          return (
            <div
              key={option.id}
              className="flex flex-col items-center justify-between gap-6 bg-gray300 p-6 text-center"
            >
              <div className="flex w-full flex-col items-center md:gap-6 gap-4">
                <h3 className="font-larken md:text-2xl text-xl font-light leading-110 text-darkblack">
                  {option.title}
                </h3>

                <div className="flex w-full flex-col items-center gap-4">
                  {option.hours.length > 0 ? (
                    <div className="flex flex-col items-center gap-4 text-base leading-110 text-darkblack">
                      {option.hours.map((entry) => (
                        <div
                          key={`${option.id}-${entry.label}-${entry.value}`}
                          className="flex items-center gap-3 whitespace-nowrap"
                        >
                          {entry.label ? (
                            <span className="font-gill font-light">{entry.label}</span>
                          ) : null}
                          <span className="font-gill font-normal">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {option.description ? (
                    <p className="max-w-full font-gill text-base font-light leading-110 text-darkblack">
                      {option.description}
                    </p>
                  ) : null}

                  {valueHref && valueLabel ? (
                    <Link
                      href={valueHref}
                      className="flex flex-wrap items-center justify-center gap-2 font-gill text-base font-normal leading-110 text-darkblack"
                    >
                      <ContactSupportIcon name={isPhone ? "phone" : "email"} />
                      {valueLabel}
                    </Link>
                  ) : null}
                </div>
              </div>

              {option.cta ? (
                <Link href={option.cta.url} className={cn(outlineCtaClassName, "mt-auto")}>
                  <span>{option.cta.label}</span>
                </Link>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileSupportSection;
