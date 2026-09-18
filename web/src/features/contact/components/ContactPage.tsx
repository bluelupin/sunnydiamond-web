"use client";

import type { NormalizedContactPage } from "@/services/contact/contact-page.types";
import ProductDetailVisitUsSection from "@/features/products/components/detail/ProductDetailVisitUsSection";
import ContactHeroSection from "./ContactHeroSection";
import ContactInfoSection from "./ContactInfoSection";
import ContactFormSection from "./ContactFormSection";
type ContactPageProps = {
  page: NormalizedContactPage;
};

const ContactPage = ({ page }: ContactPageProps) => {
  const hasInfoSection = Boolean(page.intro) || page.infoCards.length > 0;
  const hasContent =
    Boolean(page.hero) || hasInfoSection || Boolean(page.form) || Boolean(page.visitUs);

  return (
    <>
      {page.loadError && !hasContent ? (
        <section
          aria-labelledby="contact-load-error"
          className="mx-auto flex w-full max-w-[606px] flex-col items-center gap-4 px-4 py-16 text-center md:py-24"
        >
          <h1
            id="contact-load-error"
            className="font-larken text-2xl font-light leading-110 text-darkblack md:text-32"
          >
            Unable to load Contact Us
          </h1>
          <p className="font-gill text-base font-light leading-110 text-[#535353] md:text-lg">
            We couldn&apos;t load this page right now. Please refresh or try again in a moment.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-dark-slide inline-flex h-14 items-center justify-center border border-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white"
          >
            Try again
          </button>
        </section>
      ) : null}
      {page.hero ? <ContactHeroSection hero={page.hero} /> : null}
      {(hasInfoSection || page.form) ? (
        <div className="mx-auto flex w-full max-w-[1200px] flex-col xl:px-0 md:px-10 px-4">
          {hasInfoSection ? (
            <ContactInfoSection intro={page.intro} infoCards={page.infoCards} />
          ) : null}
          {page.form ? <ContactFormSection form={page.form} /> : null}
        </div>
      ) : null}
      {page.visitUs ? (
        <ProductDetailVisitUsSection visitUs={page.visitUs} variant="contact" />
      ) : null}
    </>
  );
};

export default ContactPage;
