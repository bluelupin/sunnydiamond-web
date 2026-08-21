"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { mapProfileNavItems } from "@/services/profile/profile-page.mapper";
import { useProfilePageCms } from "@/shared/lib/providers/ProfilePageCmsProvider";
import {
  DEFAULT_PROFILE_SECTION,
  getProfileSectionMobileTitle,
  isProfileSectionId,
} from "../data/profileSections";
import type { ProfileSectionId } from "../types";
import { PROFILE_ORDER_QUERY_PARAM } from "../utils/profileOrderNavigation";
import { ProfileBespokeToastProvider } from "../context/ProfileBespokeToastContext";
import ProfileAuthGate from "./ProfileAuthGate";
import ProfileHeroSection from "./ProfileHeroSection";
import { ProfileMobileSectionHeader } from "./ProfileMobileSectionHeader";
import { ProfilePromoStrip } from "./ProfilePromoStrip";
import ProfileSectionContent from "./ProfileSectionContent";
import ProfileSidebar from "./ProfileSidebar";
import ProfileSupportFaqSection from "./ProfileSupportFaqSection";
import { cn } from "@/shared/utils/cn";

const ProfilePage = () => {
  const { customer } = useAuth();
  const searchParams = useSearchParams();
  const profilePage = useProfilePageCms();

  const navItems = useMemo(
    () => mapProfileNavItems(profilePage?.sideTabs ?? []),
    [profilePage?.sideTabs],
  );

  const activeSection = useMemo<ProfileSectionId>(() => {
    const requested = searchParams?.get("section");
    return isProfileSectionId(requested) ? requested : DEFAULT_PROFILE_SECTION;
  }, [searchParams]);

  const mobileSectionTitle = useMemo(
    () => getProfileSectionMobileTitle(activeSection),
    [activeSection],
  );

  const showMobileSectionHeader = useMemo(() => {
    const orderNumber = searchParams?.get(PROFILE_ORDER_QUERY_PARAM)?.trim();
    return activeSection !== "orders" || !orderNumber;
  }, [activeSection, searchParams]);

  return (
    <ProfileAuthGate>
      {customer &&
        <ProfileBespokeToastProvider>
          <ProfileHeroSection
            firstName={customer.firstname}
            backgroundImage={profilePage?.backgroundImage ?? null}
          />
          <div
            className={cn(
              "lg:pt-20 md:pt-14 pt-10 2xl:max-w-1920 max-w-1440",
              activeSection === "wishlist"
                ? "2xl:px-[60px] lg:px-10"
                : "2xl:px-[60px] lg:px-10 md:px-8 px-4",
              activeSection === "support" ? "pb-0" : "lg:pb-100 md:pb-20 pb-10",
            )}
          >
            {showMobileSectionHeader ? (
              <ProfileMobileSectionHeader
                title={mobileSectionTitle}
                align={activeSection === "wishlist" ? "center" : "left"}
              />
            ) : null}
            <div className="lg:grid xl:grid-cols-[437px_minmax(0,1fr)] lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-6">
              <aside className="relative hidden lg:block">
                <ProfileSidebar activeSection={activeSection} navItems={navItems} />
              </aside>
              <div className="min-w-0">
                <ProfileSectionContent section={activeSection} customer={customer} />
              </div>
            </div>
          </div>
          {activeSection === "support" ? <ProfileSupportFaqSection /> : null}
          {activeSection !== "support" ? (
            <ProfilePromoStrip trustBadges={profilePage?.trustBadges ?? []} />
          ) : null}
        </ProfileBespokeToastProvider>
      }
    </ProfileAuthGate>
  );
};

export default ProfilePage;
