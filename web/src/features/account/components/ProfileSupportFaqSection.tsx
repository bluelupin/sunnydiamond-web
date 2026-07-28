"use client";

import { profileTabsContent } from "../data/profileContent";
import { ProfileAccordion } from "./profileUi";

const ProfileSupportFaqSection = () => {
  const { faqTitle, faqItems } = profileTabsContent.support;

  return (
    <section
      aria-labelledby="profile-support-faq"
      className="bg-white px-4 py-16 md:px-10 lg:py-104"
    >
      <div className="mx-auto flex max-w-[910px] flex-col items-center gap-10">
        <h2
          id="profile-support-faq"
          className="text-center font-larken text-32 font-light leading-110 text-darkblack md:text-4xl lg:text-5xl"
        >
          {faqTitle}
        </h2>
        <ProfileAccordion items={faqItems} />
      </div>
    </section>
  );
};

export default ProfileSupportFaqSection;
