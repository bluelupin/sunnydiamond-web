import type { NormalizedContactPage } from "@/services/contact/contact-page.types";
import ProductDetailVisitUsSection from "@/features/products/components/detail/ProductDetailVisitUsSection";
import ContactFormSection from "./ContactFormSection";
import ContactHeroSection from "./ContactHeroSection";
import ContactInfoSection from "./ContactInfoSection";
import ContactPageLoadError from "./ContactPageLoadError";

type ContactPageProps = {
  page: NormalizedContactPage;
};

const ContactPage = ({ page }: ContactPageProps) => {
  const hasInfoSection = Boolean(page.intro) || page.infoCards.length > 0;
  const hasContent =
    Boolean(page.hero) || hasInfoSection || Boolean(page.form) || Boolean(page.visitUs);

  return (
    <>
      {page.loadError && !hasContent ? <ContactPageLoadError /> : null}
      {page.hero ? <ContactHeroSection hero={page.hero} /> : null}
      {hasInfoSection || page.form ? (
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
