"use client";

import ProfileAppointmentsSection from "./ProfileAppointmentsSection";
import ProfileBespokeSection from "./ProfileBespokeSection";
import ProfileDetailsSection from "./ProfileDetailsSection";
import ProfileOrdersSection from "./ProfileOrdersSection";
import ProfileAddressesSection from "./ProfileAddressesSection";
import ProfileWishlistSection from "./ProfileWishlistSection";
import ProfileSupportSection from "./ProfileSupportSection";
import type { AuthCustomer } from "@/features/auth/context/AuthContext";
import type { ProfileSectionId } from "../types";

type ProfileSectionContentProps = {
  section: ProfileSectionId;
  customer: AuthCustomer;
};

const ProfileSectionContent = ({ section, customer }: ProfileSectionContentProps) => {
  if (section === "details") {
    return <ProfileDetailsSection customer={customer} />;
  }

  if (section === "orders") {
    return <ProfileOrdersSection />;
  }

  if (section === "addresses") {
    return <ProfileAddressesSection />;
  }

  if (section === "wishlist") {
    return <ProfileWishlistSection />;
  }

  if (section === "appointments") {
    return <ProfileAppointmentsSection />;
  }

  if (section === "bespoke") {
    return <ProfileBespokeSection />;
  }

  return <ProfileSupportSection />;
};

export default ProfileSectionContent;
