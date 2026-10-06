/** Figma 4903:61397 — Discover journey step 3 diamond shape. */
interface props {
  className?: string;
}

const EmeraldShapeIcon = ({ className }: props) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 8H28L32 12V28L28 32H12L8 28V12L12 8Z"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M20 8V32M8 20H32" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
    <path
      d="M12 8L28 32M28 8L12 32"
      stroke="currentColor"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
  </svg>
);

export default EmeraldShapeIcon;
