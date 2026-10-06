/** Figma 4903:61397 — Discover journey step 3 diamond shape. */
interface props {
  className?: string;
}

const MarquiseShapeIcon = ({ className }: props) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7 20C7 11 13 7 20 7C27 7 33 11 33 20C33 29 27 33 20 33C13 33 7 29 7 20Z"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M6 20H34M20 6V34" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
    <path
      d="M11 11L29 29M29 11L11 29"
      stroke="currentColor"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
  </svg>
);

export default MarquiseShapeIcon;
