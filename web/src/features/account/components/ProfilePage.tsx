"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  DEFAULT_PROFILE_SECTION,
  getProfileSectionMobileTitle,
  isProfileSectionId,
} from "../data/profileSections";
import { profileTabsContent } from "../data/profileContent";
import type { ProfileSectionId } from "../types";
import { PROFILE_ORDER_QUERY_PARAM } from "../utils/profileOrderNavigation";
import { ProfileBespokeToastProvider } from "../context/ProfileBespokeToastContext";
import ProfileAuthGate from "./ProfileAuthGate";
import ProfileHeroSection from "./ProfileHeroSection";
import { ProfileMobileNavSheet } from "./ProfileMobileNavSheet";
import { ProfileMobileSectionHeader } from "./ProfileMobileSectionHeader";
import { ProfilePromoStrip } from "./ProfilePromoStrip";
import ProfileSectionContent from "./ProfileSectionContent";
import ProfileSidebar from "./ProfileSidebar";
import ProfileSupportFaqSection from "./ProfileSupportFaqSection";
import { cn } from "@/shared/utils/cn";

const ProfilePage = () => {
  const { customer } = useAuth();
  const router = useRouter();
  const pathname = usePathname() ?? "/profile";
  const searchParams = useSearchParams();

  const activeSection = useMemo<ProfileSectionId>(() => {
    const requested = searchParams?.get("section");
    return isProfileSectionId(requested) ? requested : DEFAULT_PROFILE_SECTION;
  }, [searchParams]);

  const mobileSectionTitle = useMemo(() => {
    const orderNumber = searchParams?.get(PROFILE_ORDER_QUERY_PARAM)?.trim();
    if (activeSection === "orders" && orderNumber) {
      return profileTabsContent.orders.detail.pageTitle;
    }

    return getProfileSectionMobileTitle(activeSection);
  }, [activeSection, searchParams]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleSectionChange = useCallback(
    (section: ProfileSectionId) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      params.delete(PROFILE_ORDER_QUERY_PARAM);
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
        <ProfileBespokeToastProvider>
          <div className="bg-white">
            <ProfileHeroSection firstName={customer.firstname} />

            <div
              className={cn(
                "px-4 pt-10 md:px-10 lg:px-10",
                activeSection === "support" ? "pb-0" : "pb-16",
              )}
            >
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

              <div className="lg:-mx-10 lg:mt-8 lg:grid lg:grid-cols-[480px_minmax(0,1fr)] lg:gap-6">
                <aside className="hidden lg:block">
                  <ProfileSidebar
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                  />
                </aside>

                <div className="min-w-0 lg:pr-6">
                  <ProfileSectionContent section={activeSection} customer={customer} />
                </div>
              </div>
            </div>

            {activeSection === "support" ? <ProfileSupportFaqSection /> : null}

            {activeSection !== "support" ? <ProfilePromoStrip /> : null}
          </div>
        </ProfileBespokeToastProvider>
      ) : null}
    </ProfileAuthGate>
  );
};

export default ProfilePage;
