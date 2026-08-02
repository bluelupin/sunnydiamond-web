"use client";

type CareersResponsiveHeadingProps = {
  id?: string;
  mobile: string;
  desktop: string;
  className?: string;
};

const CareersResponsiveHeading = ({
  id,
  mobile,
  desktop,
  className,
}: CareersResponsiveHeadingProps) => {
  return (
    <h2 id={id} className={className}>
      <span className="md:hidden">{mobile}</span>
      <span className="hidden md:inline">{desktop}</span>
    </h2>
  );
};

export default CareersResponsiveHeading;
