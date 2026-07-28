"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  DEFAULT_PROFILE_SECTION,
  getProfileSectionMobileTitle,
  isProfileSectionId,
} from "../data/profileSections";
import type { ProfileSectionId } from "../types";
import ProfileAuthGate from "./ProfileAuthGate";
import ProfileHeroSection from "./ProfileHeroSection";
import { ProfileMobileNavSheet } from "./ProfileMobileNavSheet";
import { ProfileMobileSectionHeader } from "./ProfileMobileSectionHeader";
import { ProfilePromoStrip } from "./ProfilePromoStrip";
import ProfileSectionContent from "./ProfileSectionContent";
import ProfileSidebar from "./ProfileSidebar";

const ProfilePage = () => {
  const { customer } = useAuth();
  const router = useRouter();
  const pathname = usePathname() ?? "/profile";
  const searchParams = useSearchParams();

  const activeSection = useMemo<ProfileSectionId>(() => {
    const requested = searchParams?.get("section");
    return isProfileSectionId(requested) ? requested : DEFAULT_PROFILE_SECTION;
  }, [searchParams]);

  const mobileSectionTitle = getProfileSectionMobileTitle(activeSection);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleSectionChange = useCallback(
    (section: ProfileSectionId) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (section === DEFAULT_PROFILE_SECTION) {
        params.delete("section");
      } else {
        params.set("section", section);
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return (
    <ProfileAuthGate>
      {customer ? (
        <div className="bg-white">
          <ProfileHeroSection firstName={customer.firstname} />

          <div className="px-4 pb-16 pt-10 md:px-10 lg:px-10">
            <ProfileMobileSectionHeader
              title={mobileSectionTitle}
              onOpenNav={() => setMobileNavOpen(true)}
            />

            <ProfileMobileNavSheet
              open={mobileNavOpen}
              onOpenChange={setMobileNavOpen}
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />

            <div className="lg:mt-8 lg:grid lg:grid-cols-[minmax(280px,437px)_minmax(0,1fr)] lg:gap-16">
              <aside className="hidden lg:block">
                <ProfileSidebar
                  activeSection={activeSection}
                  onSectionChange={handleSectionChange}
                />
              </aside>

              <div className="min-w-0">
                <ProfileSectionContent section={activeSection} customer={customer} />
                {activeSection !== "support" ? <ProfilePromoStrip /> : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </ProfileAuthGate>
  );
};

export default ProfilePage;
