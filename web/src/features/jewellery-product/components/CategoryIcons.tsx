import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const baseProps = {
  width: 32,
  height: 32,
  viewBox: "0 0 32 32",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true,
} as const;

export const AllJewelleryIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path d="M16 10v12M10 16h12" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const RingsIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <ellipse cx="16" cy="18" rx="9" ry="6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M13 12l3-4 3 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const EarringsIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="11" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="21" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M11 12v4l-2 6M21 12v4l2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const NecklaceIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M8 12c0 6 3.5 10 8 10s8-4 8-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="16" cy="22" r="2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const PendantsIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M16 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 16h8l-1.5 8h-5L12 16z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export const BraceletsIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <ellipse cx="16" cy="16" rx="10" ry="5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="16" cy="16" r="2" fill="currentColor" />
  </svg>
);

export const BanglesIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <ellipse cx="16" cy="16" rx="8" ry="8" stroke="currentColor" strokeWidth="1.5" />
    <ellipse cx="16" cy="16" rx="5" ry="5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const NosepinsIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="16" cy="14" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M16 17v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const categoryIconMap = {
  all: AllJewelleryIcon,
  rings: RingsIcon,
  earrings: EarringsIcon,
  necklace: NecklaceIcon,
  pendants: PendantsIcon,
  bracelets: BraceletsIcon,
  bangles: BanglesIcon,
  nosepins: NosepinsIcon,
} as const;
