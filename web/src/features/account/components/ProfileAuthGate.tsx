"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { getLoginHref } from "@/features/auth/utils/authNavigation";

type ProfileAuthGateProps = {
  children: ReactNode;
};

const ProfileAuthGate = ({ children }: ProfileAuthGateProps) => {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname() ?? "/profile";

  useEffect(() => {
    if (status === "guest") {
      router.replace(getLoginHref(pathname));
    }
  }, [pathname, router, status]);

  if (status === "loading") {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-gray200">
        <p className="sr-only" aria-live="polite">
          Loading your profile
        </p>
      </section>
    );
  }

  if (status !== "authenticated") {
    return null;
  }

  return children;
};

export default ProfileAuthGate;
