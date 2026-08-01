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
      <div className="mx-auto flex w-full max-w-[910px] flex-col gap-8 lg:items-center lg:gap-10">
        <h2
          id="profile-support-faq"
          className="w-full text-left font-larken text-32 font-light leading-110 text-darkblack md:text-4xl lg:text-center lg:text-5xl"
        >
          {faqTitle}
        </h2>
        <ProfileAccordion items={faqItems} />
      </div>
    </section>
  );
};

export default ProfileSupportFaqSection;
