"use client";

import ProductDetailVisitUsSection from "@/features/products/components/detail/ProductDetailVisitUsSection";
import type { NormalizedContactPage } from "@/services/contact/contact-page.types";
import ContactHeroSection from "./ContactHeroSection";
import ContactInfoSection from "./ContactInfoSection";
import ContactFormSection from "./ContactFormSection";

type ContactPageProps = {
  page: NormalizedContactPage;
};

const ContactPage = ({ page }: ContactPageProps) => {
  return (
    <>
      <ContactHeroSection hero={page.hero} />
      <div className="flex flex-col gap-16 px-4 py-16 md:gap-104 md:px-0 md:py-0">
        <ContactInfoSection intro={page.intro} infoCards={page.infoCards} />
        <ContactFormSection form={page.form} />
        <ProductDetailVisitUsSection visitUs={page.visitUs} />
      </div>
    </>
  );
};

export default ContactPage;
