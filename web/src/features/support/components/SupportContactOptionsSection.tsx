"use client";

import Link from "next/link";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import type { NormalizedSupportContactOption } from "@/services/support/support-page.types";

type SupportContactOptionsSectionProps = {
  options: NormalizedSupportContactOption[];
};

const SupportContactOptionsSection = ({ options }: SupportContactOptionsSectionProps) => {
  if (options.length === 0) return null;

  return (
    <section
      aria-label="Contact options"
      className="bg-white px-4 py-16 md:px-8 lg:px-10 lg:py-100"
    >
      <div className="mx-auto grid w-full max-w-[910px] gap-10 md:grid-cols-2 md:gap-16">
        {options.map((option, index) => (
          <ScrollReveal
            key={option.id}
            delayMs={80 + index * 80}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-3">
              <h2 className="font-larken text-32 font-light leading-110 text-darkblack md:text-4xl">
                {option.title}
              </h2>
              {option.description ? (
                <p className="font-gill text-base font-light leading-110 text-neutral500 md:text-lg">
                  {option.description}
                </p>
              ) : null}
            </div>

            {option.hours.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {option.hours.map((hour) => (
                  <li
                    key={`${option.id}-${hour.label}-${hour.value}`}
                    className="font-gill text-base font-light leading-110 text-darkblack"
                  >
                    {hour.label ? (
                      <>
                        <span className="font-normal">{hour.label}</span>{" "}
                        <span>{hour.value}</span>
                      </>
                    ) : (
                      hour.value
                    )}
                  </li>
                ))}
              </ul>
            ) : null}

            {option.phone && option.phoneHref ? (
              <a
                href={option.phoneHref}
                className="font-gill text-xl font-light leading-110 text-darkblack underline-offset-4 hover:underline"
              >
                {option.phone}
              </a>
            ) : null}

            {option.email && option.emailHref ? (
              <a
                href={option.emailHref}
                className="font-gill text-base font-light leading-110 text-darkblack underline-offset-4 hover:underline md:text-lg"
              >
                {option.email}
              </a>
            ) : null}

            {option.cta ? (
              <Link
                href={option.cta.url}
                className="inline-flex w-fit border-b border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
              >
                {option.cta.label}
              </Link>
            ) : null}
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export default SupportContactOptionsSection;
