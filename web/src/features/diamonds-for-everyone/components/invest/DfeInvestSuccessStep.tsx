"use client";

import Image from "next/image";
import Link from "next/link";
import { diamondsForEveryonePageContent } from "../../data/content";

const DfeInvestSuccessStep = () => {
  const { success } = diamondsForEveryonePageContent.investFlow;

  return (
    <div className="flex w-full max-w-[601px] items-center justify-center bg-gray200 p-3 lg:p-6">
      <div className="flex w-full max-w-[553px] flex-col items-center gap-6 border border-linkGold bg-gray200 text-center lg:py-10 py-4">
        <span className="relative size-10 shrink-0" aria-hidden>
          <span className="absolute inset-[-2.35%]">
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.9414 20.9412L18.9414 24.9412L26.9414 16.9412M40.9414 20.9412C40.9414 31.9869 31.9871 40.9412 20.9414 40.9412C9.89571 40.9412 0.941406 31.9869 0.941406 20.9412C0.941406 9.89547 9.89571 0.941162 20.9414 0.941162C31.9871 0.941162 40.9414 9.89547 40.9414 20.9412Z" stroke="#47CB6C" strokeWidth="1.88235" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
        <div className="flex w-full flex-col items-center gap-3 lg:gap-4 lg:px-10 px-4">
          <h2 className="font-larken text-2xl font-light leading-110 text-darkblack lg:text-[29px]">
            {success.title}
          </h2>
          <p className="max-w-[302px] font-gill text-sm font-light leading-110 text-darkblack lg:max-w-none lg:text-base">
            {success.subtitle}
          </p>
        </div>
        <div className="relative h-[191px] w-[245px] shrink-0 overflow-hidden lg:h-[231px] lg:w-[296px] lg:px-10 px-4">
          <div className="absolute left-[-7.36%] top-[0.11%] h-[123.4%] w-[116.1%]">
            <Image
              src={success.image.src}
              alt={success.image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 245px, 296px"
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-6 lg:gap-4 lg:px-10 px-4">
          <Link
            href={success.managePaymentsHref}
            className="btn-dark-slide inline-flex h-14 w-full items-center justify-center border border-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
          >
            <span className="relative z-10">{success.managePaymentsLabel}</span>
          </Link>
          <Link
            href={success.backToShoppingHref}
            className="text-tertiary-cta-underline cursor-pointer pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
          >
            {success.backToShoppingLabel}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DfeInvestSuccessStep;
