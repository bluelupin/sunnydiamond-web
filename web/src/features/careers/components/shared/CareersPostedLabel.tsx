"use client";

import { formatPostedRelative } from "@/features/careers/utils/careersFormatting";

type CareersPostedLabelProps = {
  postedAt: string;
  className?: string;
};

const CareersPostedLabel = ({ postedAt, className }: CareersPostedLabelProps) => {
  const label = formatPostedRelative(postedAt);

  return (
    <p className={className} suppressHydrationWarning>
      {label}
    </p>
  );
};

export default CareersPostedLabel;
