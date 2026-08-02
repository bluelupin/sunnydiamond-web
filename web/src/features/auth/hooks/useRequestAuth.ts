"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLoginModal } from "@/features/auth/context/LoginModalContext";
import {
  getLoginHrefForReturn,
  sanitizeReturnUrl,
} from "@/features/auth/utils/authNavigation";
import { isAuthRoute } from "@/shared/utils/navigation";

export type AuthPresentation = "modal" | "page";

type RequestAuthOptions = {
  returnUrl?: string;
  mode?: AuthPresentation;
};

export function useRequestAuth() {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const { openLoginModal } = useLoginModal();

  const requestAuth = useCallback(
    (options?: RequestAuthOptions) => {
      const returnUrl = sanitizeReturnUrl(options?.returnUrl ?? pathname);
      const mode = options?.mode ?? "modal";

      if (mode === "page" || isAuthRoute(pathname)) {
        router.push(getLoginHrefForReturn(returnUrl));
        return;
      }

      openLoginModal({ returnUrl });
    },
    [openLoginModal, pathname, router],
  );

  return { requestAuth };
}
