interface Props {
  className?: string;
  stroke?: string;
}

/** Figma Icons / Chev Left (24×24) — auth back control. */
const LeftArrow = ({ className, stroke = "currentColor" }: Props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M15.5 19L9 12.5L15.5 6"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LeftArrow;
