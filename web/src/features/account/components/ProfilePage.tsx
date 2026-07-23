"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import PageContainer from "@/shared/ui/layout/PageContainer";
import {
  DEFAULT_PROFILE_SECTION,
  getProfileSection,
  isProfileSectionId,
  PROFILE_SECTIONS,
} from "../data/profileSections";
import type { ProfileSectionId } from "../types";
import ProfileAuthGate from "./ProfileAuthGate";
import ProfileSectionContent from "./ProfileSectionContent";
import ProfileSidebar from "./ProfileSidebar";

const ProfilePage = () => {
  const { customer } = useAuth();
  const router = useRouter();
  const pathname = usePathname() ?? "/profile";
  const searchParams = useSearchParams();

  const activeSection = useMemo<ProfileSectionId>(() => {
    const requested = searchParams.get("section");
    return isProfileSectionId(requested) ? requested : DEFAULT_PROFILE_SECTION;
  }, [searchParams]);

  const activeMeta = getProfileSection(activeSection);

  const handleSectionChange = useCallback(
    (section: ProfileSectionId) => {
      const params = new URLSearchParams(searchParams.toString());
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
        <section className="bg-gray200 pb-16 pt-6 md:pb-20 md:pt-10">
        <PageContainer>
          <div className="mb-8 space-y-2">
            <h1 className="font-larken text-32 font-light leading-110 text-darkblack md:text-40">
              My Profile
            </h1>
            <p className="font-gill text-base font-light leading-110 text-neutral500">
              Hi {customer.firstname}, manage your account and services in one place.
            </p>
          </div>

          <div className="lg:hidden">
            <label htmlFor="profile-section-mobile" className="sr-only">
              Profile section
            </label>
            <select
              id="profile-section-mobile"
              value={activeSection}
              onChange={(event) => handleSectionChange(event.target.value as ProfileSectionId)}
              className="mb-6 h-14 w-full rounded-sm border border-neutral300 bg-white px-4 font-gill text-base text-darkblack outline-none focus:border-darkblack"
            >
              {PROFILE_SECTIONS.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
            <aside className="hidden rounded-sm bg-gray200/80 p-2 lg:block">
              <ProfileSidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
            </aside>

            <div className="min-w-0">
              <p className="mb-4 font-gill text-sm font-light leading-110 text-neutral500 lg:hidden">
                {activeMeta.description}
              </p>
              <ProfileSectionContent section={activeSection} customer={customer} />
            </div>
          </div>
        </PageContainer>
      </section>
      ) : null}
    </ProfileAuthGate>
  );
};

export default ProfilePage;
