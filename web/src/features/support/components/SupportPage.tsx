"use client";

import ScrollReveal from "@/shared/ui/ScrollReveal";
import SupportContactOptionsSection from "./SupportContactOptionsSection";
import SupportFaqSection from "./SupportFaqSection";
import type { NormalizedSupportPage } from "@/services/support/support-page.types";

type SupportPageProps = {
  page: NormalizedSupportPage;
};

const SupportPage = ({ page }: SupportPageProps) => {
  return (
    <div className="bg-white">
      {(page.title || page.subtitle) && (
        <section
          aria-labelledby={page.title ? "support-page-title" : undefined}
          className="px-4 pt-16 md:px-8 lg:px-10 lg:pt-100"
        >
          <div className="mx-auto flex max-w-[910px] flex-col items-center gap-4 text-center">
            {page.title ? (
              <ScrollReveal delayMs={0}>
                <h1
                  id="support-page-title"
                  className="font-larken text-32 font-light leading-110 text-darkblack md:text-4xl lg:text-5xl"
                >
                  {page.title}
                </h1>
              </ScrollReveal>
            ) : null}
            {page.subtitle ? (
              <ScrollReveal
                as="p"
                delayMs={80}
                className="max-w-[640px] font-gill text-base font-light leading-110 text-neutral500 md:text-lg"
              >
                {page.subtitle}
              </ScrollReveal>
            ) : null}
          </div>
        </section>
      )}

      <SupportContactOptionsSection options={page.contactOptions} />
      {page.faq ? <SupportFaqSection faq={page.faq} /> : null}
    </div>
  );
};

export default SupportPage;
