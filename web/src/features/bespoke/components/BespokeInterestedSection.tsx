import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import Reveal from "@/shared/Animation/Reveal";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { bespokePageContent, bespokePageFigmaSpec } from "@/features/bespoke/data/content";

const BespokeInterestedSection = () => {
  const { interested } = bespokePageContent;

  return (
    <section
      id={interested.id}
      aria-labelledby="bespoke-interested-title"
      className="relative w-full overflow-hidden md:h-[432px] h-[219px]"
    >
      <ResponsiveImage
        desktopSrc={interested.image.desktop}
        mobileSrc={interested.image.mobile}
        alt={interested.image.alt}
        width={1440}
        height={bespokePageFigmaSpec.interestedHeight}
        sizes="100vw"
        className="absolute inset-0 size-full object-cover object-center"
      />
      <div aria-hidden className="absolute inset-0 bg-darkblack/50" />
      <div className="relative flex md:h-[432px] h-[219px] flex-col items-center justify-center px-4 md:px-10">
        <div className="flex w-full max-w-[720px] mx-auto flex-col items-center gap-6 text-center md:gap-10">
          <div className="flex flex-col items-center justify-center gap-3 lg:gap-4">
            <Reveal
              as="h2"
              id="bespoke-interested-title"
              direction="up"
              className="font-larken font-light leading-110 text-white lg:text-5xl md:text-4xl text-32"
            >
              {interested.title}
            </Reveal>
            <Reveal as="p" direction="up" className="font-gill text-base font-light leading-110 text-white lg:text-xl md:text-lg">
              {interested.description}
            </Reveal>
          </div>
          <Reveal direction="up">
            <DetailTextLink href={interested.ctaHref} light className="uppercase">
              {interested.ctaLabel}
            </DetailTextLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default BespokeInterestedSection;
