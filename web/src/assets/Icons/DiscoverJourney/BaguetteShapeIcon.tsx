/** Figma 4903:61397 — Discover journey step 3 diamond shape. */
interface props {
  className?: string;
}

const BaguetteShapeIcon = ({ className }: props) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M14 9H26V31H14V9Z"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M20 9V31M14 20H26" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
    <path
      d="M14 14L26 26M26 14L14 26"
      stroke="currentColor"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
  </svg>
);

export default BaguetteShapeIcon;
