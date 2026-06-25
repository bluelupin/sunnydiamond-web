interface Props {
  className?: string;
  disabled?: boolean;
  strokeWidth?: number;
}

const CarouselChevronRight = ({
  className,
  disabled = false,
  strokeWidth = 1,
}: Props) => {
  return (
    <svg
      viewBox="0 0 18.5 17.7071"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M0 8.85355H18M9.5 17.3536L18 8.85355L9.5 0.353553"
        stroke={disabled ? "#CCCCCC" : "#0A0A0A"}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CarouselChevronRight;
