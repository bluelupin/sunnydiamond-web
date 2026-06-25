interface Props {
  className?: string;
  disabled?: boolean;
  strokeWidth?: number;
}

const CarouselChevronLeft = ({
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
        d="M18.5 8.85355H0.5M9 17.3536L0.5 8.85355L9 0.353553"
        stroke={disabled ? "#CCCCCC" : "#0A0A0A"}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CarouselChevronLeft;
