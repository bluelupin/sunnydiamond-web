"use client";

import { useEffect, useState } from "react";
import { fetchSupportPage } from "@/services/support/support-page.fetch";
import { ProfileAccordion } from "./profileUi";

const ProfileSupportFaqSection = () => {
  const [title, setTitle] = useState<string>("");
  const [items, setItems] = useState<Array<{ id: string; question: string; answer: string }>>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    void fetchSupportPage({ signal: controller.signal }).then((page) => {
      if (controller.signal.aborted) {
        return;
      }

      setTitle(page.faq?.title?.trim() ?? "");
      setItems(page.faq?.items ?? []);
      setHasLoaded(true);
    });

    return () => controller.abort();
  }, []);

  if (!hasLoaded || items.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="profile-support-faq"
      className="bg-white px-4 py-16 md:px-10 lg:py-104"
    >
      <div className="mx-auto flex w-full max-w-[910px] flex-col gap-8 lg:items-center lg:gap-10">
        {title ? (
          <h2
            id="profile-support-faq"
            className="w-full text-left font-larken text-32 font-light leading-110 text-darkblack md:text-4xl lg:text-center lg:text-5xl"
          >
            {title}
          </h2>
        ) : null}
        <ProfileAccordion items={items} />
      </div>
    </section>
  );
};

export default ProfileSupportFaqSection;
