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

  return (
    <>
      {page.hero ? <ContactHeroSection hero={page.hero} /> : null}
      <div className="flex flex-col gap-16 pt-16 md:gap-[100px] md:px-0 md:py-0">
        {hasInfoSection ? (
          <ContactInfoSection intro={page.intro} infoCards={page.infoCards} />
        ) : null}
        {page.form ? <ContactFormSection form={page.form} /> : null}
        {page.visitUs ? <ProductDetailVisitUsSection visitUs={page.visitUs} /> : null}
      </div>
    </>
  );
};

export default ContactPage;
