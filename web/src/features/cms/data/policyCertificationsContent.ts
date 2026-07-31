export type PolicyAccordionSection = {
  id: string;
  title: string;
  intro?: string;
  listItems?: string[];
  body?: string;
};

export type PolicyDocument = {
  id: string;
  navLabel: string;
  /** Mobile nav label when it differs from desktop sidebar text. */
  mobileNavLabel?: string;
  contentTitle: string;
  sections: PolicyAccordionSection[];
};

export type PolicyNavGroup = {
  id: string;
  label: string;
  items: PolicyDocument[];
};

const fifteenDayReturnListItems = [
  "If you are not happy with the jewellery or solitaire purchased from us, you can return it to us within 15 days from the date of delivery.",
  "The 15 day return policy on solitaires will be valid only if you are returning it for design changes or selection change. For other reasons, the shipping charges will be deducted from the refund amount.",
  "Free returns are only applicable for domestic orders or customers in India.",
  "Customer should not return the product before receiving a confirmation email from Sunny Diamonds about the same.",
  "If you are returning the product after 15 days, the diamond value will be refunded based on the Authenticity Card and gold value based on the current market price for all products except for solitaires.",
  "The return should be accompanied by the Authenticity Card issued by Sunny Diamonds, Original/Copy of Invoice and the original lab certificate for solitaire stones (Either stand-alone or used in the jewellery) for the refund to be initiated within 10 – 15 working days of the receipt of the product.",
  "In case you are unable to produce the original lab certificate of the solitaire stones (Either stand-alone or used in the jewellery), we will send the jewellery/solitaire to the lab for recertification. The shipping and certification cost Rs 9000/- shall be borne by the customer.",
  "The Product will not be accepted under 15 day return policy if the tag is removed.",
  "During the quality check by our quality team, if any item shows sign of wear and tear or has been resized, altered or damaged, the Product will not be accepted under the Return Policy and for such returns our “After 15 day Return Policy” will be applicable.",
  "The “15-day Return Policy” is not be applicable for Customized jewellery (including personalized/engraved products)",
  "Complimentary return is applicable for all orders except Cash On Delivery.",
  "Ones the tag is removed you can't avail the 15 Day Return policy.",
  "For return of Cash On Delivery orders, the shipping charges will be deducted from the refund amount.",
] as const;

export const policyCertificationsContent = {
  pageTitle: "Policy & Certifications",
  searchPlaceholder: "Search keywords",
  emptySearchLabel: "No matching policy sections found.",
  support: {
    callTitle: "Call Us",
    emailTitle: "Email Us",
    emailDescription:
      "Our customer support team would be delighted to help resolve your concerns",
    contactCtaLabel: "CONTACT US",
    contactHref: "/contact",
    emailCtaLabel: "SEND AN EMAIL",
    emailHref: "mailto:customerservice@sunnydiamonds.com",
    phoneLabel: "+91 9744355555",
    phoneHref: "tel:+919744355555",
    emailLabel: "customerservice@sunnydiamonds.com",
    hours: [
      { label: "Monday to Saturday", value: "9:00 AM to 7:00 PM" },
      { label: "Sunday:", value: "9:00 AM to 4:00 PM" },
    ],
  },
  navGroups: [
    {
      id: "general",
      label: "General",
      items: [
        {
          id: "privacy-policy",
          navLabel: "PRIVACY POLICY",
          contentTitle: "Privacy Policy",
          sections: [
            {
              id: "privacy-overview",
              title: "Overview",
              intro:
                "Sunny Diamonds respects your privacy and is committed to protecting the personal information you share with us when you browse our website, visit our showrooms, or purchase our products and services.",
              listItems: [
                "We collect information necessary to process orders, provide customer support, and improve your shopping experience.",
                "We do not sell your personal information to third parties for marketing purposes.",
                "You may contact us to review, update, or request deletion of your personal information subject to applicable law.",
              ],
            },
            {
              id: "privacy-collection",
              title: "Information We Collect",
              body:
                "We may collect personal details such as your name, phone number, email address, billing and delivery addresses, payment-related information, appointment preferences, and communication history when you interact with Sunny Diamonds online or in store.",
            },
            {
              id: "privacy-use",
              title: "How We Use Your Information",
              body:
                "Your information helps us fulfil orders, arrange appointments, respond to enquiries, personalise recommendations, improve our services, comply with legal obligations, and communicate important updates about your purchases or account.",
            },
            {
              id: "privacy-security",
              title: "Data Security",
              body:
                "We use appropriate technical and organisational safeguards to protect your information against unauthorised access, alteration, disclosure, or destruction. While we strive to protect your data, no method of transmission over the internet is completely secure.",
            },
          ],
        },
        {
          id: "terms-and-conditions",
          navLabel: "TERMS & CONDITIONS",
          mobileNavLabel: "TERMS AND CONDITIONS",
          contentTitle: "Terms & Conditions",
          sections: [
            {
              id: "terms-usage",
              title: "Website Usage",
              body:
                "By accessing sunnydiamonds.com you agree to use the website lawfully and in accordance with these terms. Content on this website is provided for general information and may be updated without prior notice.",
            },
            {
              id: "terms-orders",
              title: "Orders and Pricing",
              body:
                "All orders are subject to acceptance and availability. Prices, product descriptions, and specifications may change without notice. Sunny Diamonds reserves the right to cancel orders affected by pricing or product errors.",
            },
            {
              id: "terms-liability",
              title: "Limitation of Liability",
              body:
                "Sunny Diamonds shall not be liable for indirect or consequential losses arising from the use of our website or products except where liability cannot be excluded under applicable law.",
            },
          ],
        },
        {
          id: "certifications",
          navLabel: "CERTIFICATIONS",
          contentTitle: "Certifications",
          sections: [
            {
              id: "certifications-overview",
              title: "Our Certifications",
              intro:
                "Every Sunny Diamonds solitaire is accompanied by trusted certification that verifies authenticity, quality, and grading standards.",
              listItems: [
                "Solitaires are certified by internationally recognised gemological laboratories.",
                "Certification details are shared at the time of purchase and included with eligible products.",
                "Original certificates must be preserved for returns, exchanges, and buyback processes where applicable.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "business",
      label: "Business",
      items: [
        {
          id: "money-back-policy",
          navLabel: "100% MONEY BACK POLICY",
          contentTitle: "100% Money Back Policy",
          sections: [
            {
              id: "money-back-overview",
              title: "Policy Overview",
              body:
                "Sunny Diamonds offers a 100% money back policy on eligible purchases within the stipulated return window, subject to product condition, certification, and invoice requirements outlined at the time of purchase.",
            },
          ],
        },
        {
          id: "15-day-return-policy",
          navLabel: "15 DAY RETURN POLICY",
          contentTitle: "15 Day Return Policy",
          sections: [
            {
              id: "15-day-return-how",
              title: "How do I return the product to sunnydiamonds.com within 15 days?",
              intro:
                "Sunny Diamonds is committed to ensuring full customer satisfaction concerning the products available on our website. We strive to provide each guest with an experience that makes them confident in their purchase. We hope that the diamonds you buy from us bring you many years of joy. However, if you are unhappy or dissatisfied with the product, you can avail our 15 days return policy and choose to return the order.",
              listItems: [...fifteenDayReturnListItems],
            },
            {
              id: "15-day-return-domestic",
              title: "Return On Domestic Order (Order with in India)",
              body:
                "For domestic orders, please contact our customer support team to initiate a return. Once approved, follow the packaging and shipping instructions shared in your confirmation email. Returns must meet the eligibility criteria stated in our 15 day return policy.",
            },
            {
              id: "15-day-return-international",
              title: "Return On International Orders",
              body:
                "International return eligibility, shipping charges, and timelines may differ from domestic orders. Please contact customer support before returning any international order so we can guide you through the applicable process and documentation requirements.",
            },
          ],
        },
        {
          id: "cancellation-policy",
          navLabel: "CANCELLATION POLICY",
          contentTitle: "Cancellation Policy",
          sections: [
            {
              id: "cancellation-overview",
              title: "Order Cancellation",
              body:
                "Orders may be cancelled before dispatch by contacting Sunny Diamonds customer support. Once an order has been shipped or is in production for customised pieces, cancellation may not be possible and standard return policies may apply.",
            },
          ],
        },
        {
          id: "dfe-terms",
          navLabel: "DFE TERMS & CONDITIONS",
          mobileNavLabel: "DFE TERMS AND CONDITIONS",
          contentTitle: "DFE Terms & Conditions",
          sections: [
            {
              id: "dfe-overview",
              title: "Diamonds For Everyone Programme",
              body:
                "The Diamonds For Everyone programme terms govern participation, benefits, eligibility, and redemption conditions. Please review programme communications and in-store guidance for the latest applicable terms.",
            },
          ],
        },
        {
          id: "gift-vouchers",
          navLabel: "GIFT VOUCHERS",
          contentTitle: "Gift Vouchers",
          sections: [
            {
              id: "gift-vouchers-overview",
              title: "Gift Voucher Terms",
              body:
                "Gift vouchers issued by Sunny Diamonds are subject to validity periods, redemption limits, and exclusions on certain products or services. Vouchers cannot be exchanged for cash unless required by applicable law.",
            },
          ],
        },
      ],
    },
  ] as PolicyNavGroup[],
};

export const policyDocuments = policyCertificationsContent.navGroups.flatMap(
  (group) => group.items,
);

export const defaultPolicyId = "privacy-policy";

export function getPolicyById(policyId: string): PolicyDocument | undefined {
  return policyDocuments.find((policy) => policy.id === policyId);
}
