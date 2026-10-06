/** Figma 4903:61397 — Discover journey step 3 diamond shape. */
interface props {
  className?: string;
}

const PearShapeIcon = ({ className }: props) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M20 34C20 34 9 24 9 15C9 9.5 13.5 6 20 6C26.5 6 31 9.5 31 15C31 24 20 34 20 34Z"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M20 6V34M12 14H28" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
    <path
      d="M14 18L26 26M26 18L14 26"
      stroke="currentColor"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
  </svg>
);

export default PearShapeIcon;
