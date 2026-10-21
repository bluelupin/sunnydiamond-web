import Image from "next/image";
import { DetailDarkLink } from "@/features/products/components/detail/shared";
import { notFoundContent } from "../data/notFoundContent";

/** Figma 7332:67705 — 404 hero (header/footer supplied by site Layout). */
const NotFoundPage = () => {
  return (
    <section className="flex min-h-[60vh] w-full flex-1 flex-col items-center justify-center bg-gray200 px-4 pb-20 pt-10 md:py-20">
      <div className="flex w-full max-w-[386px] flex-col items-center gap-6">
        <div className="relative size-16 shrink-0 overflow-hidden" aria-hidden>
          <Image
            src="/icons/not-found-diamond.svg"
            alt=""
            width={64}
            height={64}
            className="size-full object-contain"
          />
        </div>

        <h1 className="w-full text-center font-larken text-32 font-light leading-110 text-darkblack">
          {notFoundContent.title}
        </h1>

        <div className="w-full text-center font-gill text-base font-light leading-110 text-neutral500">
          <p className="mb-0">{notFoundContent.descriptionLine1}</p>
          <p>{notFoundContent.descriptionLine2}</p>
        </div>

        <DetailDarkLink href={notFoundContent.ctaHref} className="w-auto shrink-0">
          {notFoundContent.ctaLabel}
        </DetailDarkLink>
      </div>
    </section>
  );
};

export default NotFoundPage;
