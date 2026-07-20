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
      className="relative w-full overflow-hidden md:min-h-[432px] min-h-[219px]"
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

      <div className="relative flex md:min-h-[432px] min-h-[219px] flex-col items-center justify-center px-4 py-16 md:px-10">
        <div className="flex w-full max-w-1360 flex-col items-center gap-6 text-center md:gap-10">
          <div className="flex max-w-[640px] flex-col items-center gap-3 md:gap-4">
            <Reveal
              as="h2"
              id="bespoke-interested-title"
              direction="up"
              className="font-larken text-32 font-light leading-110 text-white md:text-5xl"
            >
              {interested.title}
            </Reveal>
            <Reveal as="p" direction="up" className="font-gill text-base font-light leading-110 text-white md:text-xl">
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
