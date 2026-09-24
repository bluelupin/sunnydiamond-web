"use client";

import Link from "next/link";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import type {
  NormalizedDfeResponsiveImage,
  NormalizedDfeSuccessScreen,
} from "@/services/diamonds-for-everyone/diamonds-for-everyone-page.types";

type DfeInvestSuccessStepProps = {
  successScreen: NormalizedDfeSuccessScreen;
  investmentPlannerImage: NormalizedDfeResponsiveImage | null;
};

const DfeInvestSuccessStep = ({
  successScreen,
  investmentPlannerImage,
}: DfeInvestSuccessStepProps) => {
  const iconDesktopUrl =
    successScreen.icon?.desktopUrl?.trim() || successScreen.icon?.mobileUrl?.trim() || "";
  const iconMobileUrl =
    successScreen.icon?.mobileUrl?.trim() || successScreen.icon?.desktopUrl?.trim() || "";
  const iconAlt =
    successScreen.icon?.desktopAlt?.trim() || successScreen.icon?.mobileAlt?.trim() || "";
  const hasCmsIcon = Boolean(iconDesktopUrl);

  const image = investmentPlannerImage;
  const imageDesktopUrl =
    image?.desktopUrl?.trim() || image?.mobileUrl?.trim() || "";
  const imageMobileUrl =
    image?.mobileUrl?.trim() || image?.desktopUrl?.trim() || "";
  const imageAlt =
    image?.desktopAlt?.trim() ||
    image?.mobileAlt?.trim() ||
    "";
  const hasImage = Boolean(imageDesktopUrl);

  const showManagePayments =
    Boolean(successScreen.managePaymentsButtonLabel) &&
    Boolean(successScreen.managePaymentsUrl);
  const showShoppingLink =
    Boolean(successScreen.shoppingLinkLabel) && Boolean(successScreen.shoppingUrl);

  return (
    <div className="flex w-full max-w-[601px] items-center justify-center bg-gray200 p-3 lg:p-6">
      <div className="flex w-full max-w-[553px] flex-col items-center gap-6 border border-linkGold bg-gray200 py-4 text-center lg:py-10">
        {hasCmsIcon ? (
          <span className="relative size-10 shrink-0" aria-hidden>
            <ResponsiveImage
              desktopSrc={iconDesktopUrl}
              mobileSrc={iconMobileUrl}
              alt={iconAlt}
              desktopAlt={successScreen.icon?.desktopAlt}
              mobileAlt={successScreen.icon?.mobileAlt}
              fill
              className="object-contain"
              sizes="40px"
            />
          </span>
        ) : null}

        <div className="flex w-full flex-col items-center gap-3 px-4 lg:gap-4 lg:px-10">
          <h2 className="font-larken text-2xl font-light leading-110 text-darkblack lg:text-[29px]">
            {successScreen.heading}
          </h2>
          {successScreen.description ? (
            <p className="max-w-[302px] font-gill text-sm font-light leading-110 text-darkblack lg:max-w-none lg:text-base">
              {successScreen.description}
            </p>
          ) : null}
        </div>

        {hasImage ? (
          <div className="relative h-[191px] w-[245px] shrink-0 overflow-hidden px-4 lg:h-[231px] lg:w-[296px] lg:px-10">
            <ResponsiveImage
              desktopSrc={imageDesktopUrl}
              mobileSrc={imageMobileUrl}
              alt={imageAlt}
              desktopAlt={image?.desktopAlt}
              mobileAlt={image?.mobileAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 245px, 296px"
            />
          </div>
        ) : null}

        {showManagePayments || showShoppingLink ? (
          <div className="flex w-full flex-col items-center gap-6 px-4 lg:gap-4 lg:px-10">
            {showManagePayments ? (
              <Link
                href={successScreen.managePaymentsUrl!}
                className="btn-dark-slide inline-flex h-14 w-full items-center justify-center border border-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
              >
                <span className="relative z-10">{successScreen.managePaymentsButtonLabel}</span>
              </Link>
            ) : null}
            {showShoppingLink ? (
              <Link
                href={successScreen.shoppingUrl!}
                className="text-tertiary-cta-underline cursor-pointer pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
              >
                {successScreen.shoppingLinkLabel}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DfeInvestSuccessStep;
