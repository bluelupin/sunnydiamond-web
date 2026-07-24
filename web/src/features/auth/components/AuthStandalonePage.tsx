"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthFlow } from "../hooks/useAuthFlow";
import { getAuthFlowLabel } from "../utils/authNavigation";
import AuthFlowSteps from "./AuthFlowSteps";

type AuthStandalonePageProps = {
  returnUrl: string;
};

const LOGIN_BACKGROUND_IMAGE_URL =
  "https://d1gf9vo4d2b63b.cloudfront.net/cms/login_bg_0e012a2085.png";

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
    <div className="relative h-full">
      <div className="absolute inset-0">
        <Image
          src={LOGIN_BACKGROUND_IMAGE_URL}
          alt=""
          fill
          priority
          className="object-cover object-center md:object-left"
          sizes="100vw"
          aria-hidden
        />

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/10 md:bg-none"
          aria-hidden
        />
      </div>

      <div className="relative flex min-h-full flex-col justify-end px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-8 md:items-center md:justify-center md:px-8 md:py-12 lg:items-end lg:pr-[max(2.5rem,calc((100vw-1440px)/2+2.5rem))]">
        <div
          role="region"
          aria-label={flowLabel}
          className="w-full max-w-[520px] bg-white p-6 shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
        >
          <AuthFlowSteps {...contentProps} titleClassName={titleClassName} />
        </div>
      </div>
    </div>
  );
};

export default AuthStandalonePage;
