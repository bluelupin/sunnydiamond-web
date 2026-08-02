"use client";

import Image from "next/image";
import Link from "next/link";
import { diamondsForEveryonePageContent } from "../../data/content";

const SUCCESS_CHECK_SRC = "/images/diamonds-for-everyone/invest-success-check.svg";

const DfeInvestSuccessStep = () => {
  const { success } = diamondsForEveryonePageContent.investFlow;

  return (
    <div className="flex w-full max-w-[553px] flex-col items-center gap-6 border border-linkGold bg-gray200 p-6 text-center md:p-10">
      <span className="relative size-10 shrink-0" aria-hidden>
        <span className="absolute inset-[-2.35%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SUCCESS_CHECK_SRC} alt="" className="block size-full max-w-none" />
        </span>
      </span>

      <h2 className="font-larken text-32 font-light leading-110 text-darkblack">
        {success.title}
      </h2>

      <p className="font-gill text-base font-light leading-110 text-darkblack">
        {success.subtitle}
      </p>

      <div className="relative h-[231px] w-[296px] shrink-0 overflow-hidden">
        <Image
          src={success.image.src}
          alt={success.image.alt}
          fill
          className="object-cover object-center"
          sizes="296px"
        />
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        <Link
          href={success.managePaymentsHref}
          className="inline-flex h-14 w-full items-center justify-center bg-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white transition-opacity hover:opacity-90"
        >
          {success.managePaymentsLabel}
        </Link>
        <Link
          href={success.backToShoppingHref}
          className="border-b border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
        >
          {success.backToShoppingLabel}
        </Link>
      </div>
    </div>
  );
};

export default DfeInvestSuccessStep;
