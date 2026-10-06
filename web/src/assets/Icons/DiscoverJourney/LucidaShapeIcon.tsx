/** Figma 4903:61397 — Discover journey step 3 diamond shape. */
interface props {
  className?: string;
}

const LucidaShapeIcon = ({ className }: props) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M13 10H27L30 13V27L27 30H13L10 27V13L13 10Z"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M20 10V30M10 20H30" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
    <path
      d="M13 10L30 27M30 10L13 27"
      stroke="currentColor"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
    <path
      d="M10 13L27 30M27 13L10 30"
      stroke="currentColor"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
  </svg>
);

export default LucidaShapeIcon;
