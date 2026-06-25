import Image from "next/image";
import { educationFourCsIntroContent, educationPageImages } from "../data/content";

const EducationFourCsIntroSection = () => {
  return (
    <section
      aria-labelledby="education-four-cs-intro-title"
      className="bg-white px-4 py-16 max-lg:min-h-[561px] max-lg:justify-center lg:h-[694px] lg:px-0 lg:py-0"
    >
      <div className="mx-auto flex h-full max-w-[677px] flex-col items-center justify-center gap-6 lg:gap-10 lg:pt-16">
        <h2
          id="education-four-cs-intro-title"
          className="text-center font-larken text-[32px] font-light leading-110 text-darkblack lg:text-[48px]"
        >
          <span className="lg:hidden">{educationFourCsIntroContent.mobileTitle}</span>
          <span className="hidden lg:inline">{educationFourCsIntroContent.desktopTitle}</span>
        </h2>

        <div className="flex flex-col items-center gap-6 lg:gap-8">
          <div className="relative h-[130px] w-[160px] overflow-hidden rounded-[110px] lg:h-[202px] lg:w-[250px]">
            <Image
              src={educationPageImages.diamondOval}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 160px, 250px"
            />
          </div>

          <div className="h-[55px] w-px bg-[rgba(10,10,10,0.4)] max-lg:hidden" aria-hidden />

          <p className="max-w-[342px] text-center font-gill text-base font-light leading-110 text-darkblack lg:max-w-[523px] lg:text-[20px]">
            {educationFourCsIntroContent.description}
          </p>

          <div className="h-px w-[250px] bg-gradient-to-r from-darkMagenta to-[#dda957] lg:w-[421px]" aria-hidden />

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-gill text-[20px] leading-110 text-darkblack lg:gap-x-4 lg:text-24">
            {educationFourCsIntroContent.pillars.map((pillar, index) => (
              <span key={pillar} className="inline-flex items-center gap-3 lg:gap-4">
                {index > 0 ? (
                  <Image
                    src={educationPageImages.star}
                    alt=""
                    width={16}
                    height={16}
                    className="size-4"
                    aria-hidden
                  />
                ) : null}
                {pillar}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationFourCsIntroSection;
