/** Figma 4903:61397 — Discover journey step 3 diamond shape. */
interface props {
  className?: string;
}

const PrincessShapeIcon = ({ className }: props) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M20 6L34 20L20 34L6 20L20 6Z"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M20 6V34M6 20H34" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
    <path
      d="M10.5 10.5L29.5 29.5M29.5 10.5L10.5 29.5"
      stroke="currentColor"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
  </svg>
);

export default PrincessShapeIcon;
