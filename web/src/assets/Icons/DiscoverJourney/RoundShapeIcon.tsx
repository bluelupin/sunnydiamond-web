/** Figma 4903:61397 — Discover journey step 3 diamond shape. */
interface props {
  className?: string;
}

const RoundShapeIcon = ({ className }: props) => (
  <svg width="40" height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M20 34C27.732 34 34 27.732 34 20C34 12.268 27.732 6 20 6C12.268 6 6 12.268 6 20C6 27.732 12.268 34 20 34Z"
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

export default RoundShapeIcon;
