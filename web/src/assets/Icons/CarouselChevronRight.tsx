interface Props {
  className?: string;
  disabled?: boolean;
  strokeWidth?: number;
}

const CarouselChevronRight = ({
  className,
  disabled = false,
  strokeWidth = 1.5,
}: Props) => {
  return (
    <svg
      viewBox="0 0 18.75 18.0607"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M0 9.03033H18M9.5 17.5303L18 9.03033L9.5 0.53033"
        stroke={disabled ? "#CCCCCC" : "#0A0A0A"}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CarouselChevronRight;
