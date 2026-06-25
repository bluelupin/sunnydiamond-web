import Image from "next/image";
import Link from "next/link";
import { educationDiscoverContent, educationPageImages } from "../data/content";

const EducationDiscoverSection = () => {
  return (
    <section
      aria-labelledby="education-discover-title"
      className="relative overflow-hidden bg-[#F4F3EE] lg:h-[615px]"
    >
      <div className="absolute bottom-0 left-0 hidden h-[585px] w-[621px] mix-blend-darken lg:block">
        <Image
          src={educationPageImages.discoverImage}
          alt=""
          fill
          className="object-cover object-left-bottom"
          sizes="621px"
        />
      </div>

      <div className="relative flex flex-col gap-8 px-4 py-16 lg:absolute lg:inset-y-0 lg:left-1/2 lg:w-[589px] lg:translate-x-[calc(-50%+294.5px)] lg:justify-center lg:px-0 lg:py-0">
        <div className="flex flex-col gap-8 lg:gap-10">
          <div className="flex flex-col gap-3 lg:gap-4">
            <h2
              id="education-discover-title"
              className="font-larken text-[32px] font-light leading-110 text-darkblack lg:text-[48px]"
            >
              {educationDiscoverContent.title}
            </h2>
            <p className="font-gill text-base font-light leading-110 text-neutral500 lg:max-w-[531px] lg:text-[20px]">
              {educationDiscoverContent.description}
            </p>
          </div>

          <div className="flex gap-4">
            <div className="relative flex flex-col gap-12 lg:gap-10">
              <div
                className="absolute left-2 top-3 h-[calc(100%-24px)] w-px bg-darkblack/20"
                aria-hidden
              />
              {educationDiscoverContent.steps.map((_, index) => (
                <div
                  key={index}
                  className="relative z-10 flex size-4 items-center justify-center rounded-full border border-darkblack bg-white p-1 lg:h-[26px] lg:w-4"
                >
                  <span className="font-gill text-[12px] font-light leading-none text-darkblack lg:text-[14px]">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>

            <ol className="flex flex-col justify-between gap-8 font-gill text-base font-light leading-110 text-darkblack lg:gap-10 lg:text-[20px]">
              {educationDiscoverContent.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        <Link
          href={educationDiscoverContent.ctaHref}
          className="btn-slide-up inline-flex h-14 w-fit items-center justify-center border border-neutral300 px-7 font-gill text-sm uppercase leading-110 text-darkblack"
        >
          {educationDiscoverContent.ctaLabel}
        </Link>
      </div>

      <div className="relative mx-auto mt-8 h-[240px] w-full max-w-[343px] mix-blend-darken lg:hidden">
        <Image
          src={educationPageImages.discoverImage}
          alt=""
          fill
          className="object-cover"
          sizes="343px"
        />
      </div>
    </section>
  );
};

export default EducationDiscoverSection;
