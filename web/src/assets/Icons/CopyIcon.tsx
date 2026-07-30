interface CopyIconProps {
  className?: string;
}

/** Figma node 1535:25331 — copy / duplicate icon for order IDs */
const CopyIcon = ({ className }: CopyIconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 14.6875 14.6875"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <path
      d="M11.7188 2.96875H0.46875V14.2188H11.7188V2.96875Z"
      stroke="currentColor"
      strokeWidth="0.9375"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.96875 0.46875H14.2188V11.7188"
      stroke="currentColor"
      strokeWidth="0.9375"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CopyIcon;
