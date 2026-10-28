"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { getLoginHref } from "@/features/auth/utils/authNavigation";

type ProfileAuthGateProps = {
  children: ReactNode;
};

const ProfileAuthGate = ({ children }: ProfileAuthGateProps) => {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname() ?? "/profile";
  const searchParams = useSearchParams();
  const returnPath = useMemo(() => {
    const query = searchParams?.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (status === "guest") {
      router.replace(getLoginHref(returnPath));
    }
  }, [returnPath, router, status]);

  if (status === "loading") {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-white">
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
