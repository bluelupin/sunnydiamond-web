import type { ComponentType } from "react";

type IconProps = { className?: string };

const RoundShapeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
    <circle cx="20" cy="20" r="11" stroke="currentColor" strokeWidth="0.9" />
    <path d="M20 9v22M9 20h22M12.5 12.5l15 15M27.5 12.5l-15 15" stroke="currentColor" strokeWidth="0.7" />
  </svg>
);

const OvalShapeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
    <ellipse cx="20" cy="20" rx="9" ry="12.5" stroke="currentColor" strokeWidth="0.9" />
    <path d="M20 7.5v25M11 20h18" stroke="currentColor" strokeWidth="0.7" />
  </svg>
);

const CushionShapeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
    <rect x="9.5" y="9.5" width="21" height="21" rx="5" stroke="currentColor" strokeWidth="0.9" />
    <path d="M20 9.5v21M9.5 20h21M13 13l14 14M27 13 13 27" stroke="currentColor" strokeWidth="0.7" />
  </svg>
);

const PearShapeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
    <path
      d="M20 7c4.5 0 8.5 5.2 8.5 12.2C28.5 27.2 24.2 33 20 33s-8.5-5.8-8.5-13.8C11.5 12.2 15.5 7 20 7Z"
      stroke="currentColor"
      strokeWidth="0.9"
    />
    <path d="M20 8.5v23M13.5 22h13" stroke="currentColor" strokeWidth="0.7" />
  </svg>
);

const EmeraldShapeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
    <path d="M13 10h14l5 5v10l-5 5H13l-5-5V15l5-5Z" stroke="currentColor" strokeWidth="0.9" />
    <path d="M13 10v20M27 10v20M8 15h24M8 25h24" stroke="currentColor" strokeWidth="0.7" />
  </svg>
);

const HeartShapeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
    <path
      d="M20 32.5S8.5 24.2 8.5 16.2C8.5 11.8 11.6 9 15.2 9c2.2 0 3.8 1.1 4.8 2.6C21 10.1 22.6 9 24.8 9c3.6 0 6.7 2.8 6.7 7.2 0 8-11.5 16.3-11.5 16.3Z"
      stroke="currentColor"
      strokeWidth="0.9"
    />
  </svg>
);

/** Icons keyed by Magento `sd_diamond_shape` option value. */
export const diamondShapeIconByValue: Record<string, ComponentType<IconProps>> = {
  "64": RoundShapeIcon,
  "65": OvalShapeIcon,
  "66": CushionShapeIcon,
  "67": PearShapeIcon,
  "68": EmeraldShapeIcon,
  "69": HeartShapeIcon,
};
