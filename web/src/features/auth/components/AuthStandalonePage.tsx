"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthFlow } from "../hooks/useAuthFlow";
import { getAuthFlowLabel } from "../utils/authNavigation";
import {
  authLoginMobileBackgroundImageClassName,
  authLoginWebBackgroundImageClassName,
} from "../constants/authLoginBackground";
import AuthFlowSteps from "./AuthFlowSteps";

type AuthStandalonePageProps = {
  returnUrl: string;
};

const LOGIN_WEB_BACKGROUND_IMAGE_URL =
  "https://d1gf9vo4d2b63b.cloudfront.net/cms/login_web_bg_a141f6da7f.avif";

const LOGIN_MOBILE_BACKGROUND_IMAGE_URL =
  "https://d1gf9vo4d2b63b.cloudfront.net/cms/login_mobile_bg_c7195b83ef.avif";

const AuthStandalonePage = ({ returnUrl }: AuthStandalonePageProps) => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  const { step, contentProps } = useAuthFlow({
    active: true,
    returnUrl,
    surface: "standalone",
    onComplete: (nextReturnUrl) => {
      router.push(nextReturnUrl);
    },
    onAbort: () => {
      router.push(returnUrl);
    },
  });

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const titleClassName = isMobile ? "text-2xl" : undefined;
  const flowLabel = getAuthFlowLabel(step);

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <div className="absolute inset-0">
        <Image
          src={LOGIN_WEB_BACKGROUND_IMAGE_URL}
          alt=""
          fill
          priority
          className={authLoginWebBackgroundImageClassName}
          sizes="100vw"
          aria-hidden
        />
        <Image
          src={LOGIN_MOBILE_BACKGROUND_IMAGE_URL}
          alt=""
          fill
          priority
          className={authLoginMobileBackgroundImageClassName}
          sizes="100vw"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[344px] bg-gradient-to-b from-black to-transparent md:hidden"
          aria-hidden
        />
      </div>

      <div
        className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-[calc(64px+env(safe-area-inset-top,0px))] md:px-8 md:landscape:justify-center md:landscape:pt-104 md:landscape:py-6 justify-end lg:items-end lg:pr-[max(2.5rem,calc((100vw-1440px)/2+2.5rem))]"
      >
        <div
          role="region"
          aria-label={flowLabel}
          className="w-full max-w-full shrink-0 bg-white px-4 py-6 shadow-[0_8px_40px_rgba(0,0,0,0.08)] md:max-w-[520px] md:p-6 md:landscape:my-auto"
        >
          <AuthFlowSteps {...contentProps} titleClassName={titleClassName} />
        </div>
      </div>
    </div>
  );
};

export default AuthStandalonePage;
