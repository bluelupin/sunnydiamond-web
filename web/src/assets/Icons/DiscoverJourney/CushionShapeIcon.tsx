/** Figma 4903:61397 — Discover journey step 3 diamond shape. */
interface props {
  className?: string;
}

const CushionShapeIcon = ({ className }: props) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 8H28C30.2 8 32 9.8 32 12V28C32 30.2 30.2 32 28 32H12C9.8 32 8 30.2 8 28V12C8 9.8 9.8 8 12 8Z"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M20 8V32M8 20H32" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
    <path
      d="M11.5 11.5L28.5 28.5M28.5 11.5L11.5 28.5"
      stroke="currentColor"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
  </svg>
);

export default CushionShapeIcon;
