import { cn } from "@/shared/utils/cn";

interface WishlistIconProps {
  className?: string;
  filled?: boolean;
}

/** Figma node 2556:669 — Wishlist icon */
const WishlistIcon = ({ className, filled = false }: WishlistIconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 20.5012 17.5006"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <path
      d="M10.2506 17.0006L18.6281 8.50312C19.5073 7.62393 20.0012 6.43148 20.0012 5.18812C20.0012 3.94475 19.5073 2.75231 18.6281 1.87312C17.7489 0.993925 16.5565 0.5 15.3131 0.5C14.0698 0.5 12.8773 0.993925 11.9981 1.87312L10.2506 3.50062L8.50312 1.87312C7.62393 0.993925 6.43148 0.5 5.18812 0.5C3.94475 0.5 2.75231 0.993925 1.87312 1.87312C0.993925 2.75231 0.5 3.94475 0.5 5.18812C0.5 6.43148 0.993925 7.62393 1.87312 8.50312L10.2506 17.0006Z"
      className={cn(filled && "fill-current")}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default WishlistIcon;
