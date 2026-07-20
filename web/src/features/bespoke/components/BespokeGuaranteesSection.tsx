import { Fragment } from "react";
import Image from "next/image";
import Reveal from "@/shared/Animation/Reveal";
import { cn } from "@/shared/utils/cn";
import { bespokePageContent } from "@/features/bespoke/data/content";

const BespokeGuaranteesSection = () => {
  const { guarantees } = bespokePageContent;

  return (
    <section aria-label="Shopping guarantees" className="border-y border-neutral300 bg-white">
      <ul className="m-0 flex list-none flex-col items-center p-0 px-4 py-10 md:hidden">
        {guarantees.map((item, index) => (
          <Fragment key={item.label}>
            {index > 0 ? (
              <li aria-hidden className="my-4 h-px w-full max-w-[320px] bg-neutral300" />
            ) : null}
            <Reveal as="li" direction="up" className="flex w-full max-w-[320px] flex-col items-center gap-3 text-center">
              <div className="flex size-10 items-center justify-center md:size-16">
                <Image src={item.iconSrc} alt="" width={64} height={64} className="size-full object-contain" aria-hidden />
              </div>
              <p className="font-gill text-base leading-110 text-darkblack">{item.label}</p>
            </Reveal>
          </Fragment>
        ))}
      </ul>

      <ul className="m-0 hidden list-none items-stretch justify-center p-0 md:flex md:py-16 py-10 md:px-[180px] px-4">
        {guarantees.map((item, index) => (
          <Fragment key={item.label}>
            {index > 0 ? (
              <li aria-hidden className="flex min-w-0 flex-1 items-center justify-center self-stretch">
                <span className="h-136 w-hairline bg-gray600" />
              </li>
            ) : null}
            <Reveal
              as="li"
              direction="up"
              className={cn(
                "flex w-[260px] shrink-0 flex-col items-center justify-center gap-3 p-3 text-center",
              )}
            >
              <div className="flex size-16 items-center justify-center">
                <Image src={item.iconSrc} alt="" width={64} height={64} className="size-full object-contain" aria-hidden />
              </div>
              <p className="max-w-236 font-gill text-xl font-normal leading-110 text-darkblack">{item.label}</p>
            </Reveal>
          </Fragment>
        ))}
      </ul>
    </section>
  );
};

export default BespokeGuaranteesSection;
