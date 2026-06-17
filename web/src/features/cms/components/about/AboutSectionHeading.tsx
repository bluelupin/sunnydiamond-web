import { cn } from "@/shared/utils/cn";

interface AboutSectionHeadingProps {
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

const AboutSectionHeading = ({
  title,
  description,
  align = "center",
  className,
}: AboutSectionHeadingProps) => {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        isCenter ? "text-center mx-auto" : "text-left",
        className,
      )}
    >
      <h2 className="font-larken font-light text-[32px] md:text-4xl lg:text-5xl text-darkblack tracking-[0%] leading-[100%]">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 md:mt-5 max-w-560 text-base md:text-lg text-gray500 font-gill font-light tracking-[1%] leading-[140%]",
            isCenter && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
};

export default AboutSectionHeading;
