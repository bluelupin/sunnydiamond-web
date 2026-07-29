"use client";

import { useEffect, useState } from "react";
import {
  formatPostedAbsolute,
  formatPostedRelative,
} from "@/features/careers/utils/careersFormatting";

type CareersPostedLabelProps = {
  postedAt: string;
  className?: string;
};

const CareersPostedLabel = ({ postedAt, className }: CareersPostedLabelProps) => {
  const [label, setLabel] = useState(() => `Posted ${formatPostedAbsolute(postedAt)}`);

  useEffect(() => {
    setLabel(formatPostedRelative(postedAt));
  }, [postedAt]);

  return (
    <p className={className} suppressHydrationWarning>
      {label}
    </p>
  );
};

export default CareersPostedLabel;
