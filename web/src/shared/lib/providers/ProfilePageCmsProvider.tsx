"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { NormalizedProfilePage } from "@/services/profile/profile-page.types";

const ProfilePageCmsContext = createContext<NormalizedProfilePage | null>(null);

type ProfilePageCmsProviderProps = {
  page: NormalizedProfilePage | null;
  children: ReactNode;
};

export function ProfilePageCmsProvider({ page, children }: ProfilePageCmsProviderProps) {
  return (
    <ProfilePageCmsContext.Provider value={page}>{children}</ProfilePageCmsContext.Provider>
  );
}

export function useProfilePageCms(): NormalizedProfilePage | null {
  return useContext(ProfilePageCmsContext);
}
