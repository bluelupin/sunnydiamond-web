"use client";

import ProductDetailVisitUsSection from "@/features/products/components/detail/ProductDetailVisitUsSection";
import ContactHeroSection from "./ContactHeroSection";
import ContactInfoSection from "./ContactInfoSection";
import ContactFormSection from "./ContactFormSection";
import { contactPageContent } from "../data/content";

const contactVisitUsSection = {
  title: contactPageContent.visitUs.title,
  description: contactPageContent.visitUs.description,
  imageSrc: contactPageContent.visitUs.image.src,
  mobileImageSrc: contactPageContent.visitUs.image.mobileSrc,
  imageAlt: contactPageContent.visitUs.image.alt,
  ctaLabel: contactPageContent.visitUs.ctaLabel,
};

const ContactPage = () => {
  return (
    <>
      <ContactHeroSection />
      <div className="flex flex-col gap-16 px-4 py-16 md:gap-104 md:px-0 md:py-0">
        <ContactInfoSection />
        <ContactFormSection />
        <ProductDetailVisitUsSection visitUs={contactVisitUsSection} />
      </div>
    </>
  );
};

export default ContactPage;
