interface Props {
  className?: string;
  disabled?: boolean;
  strokeWidth?: number;
}

const CarouselChevronLeft = ({
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
        d="M18.75 9.03033H0.75M9.25 17.5303L0.75 9.03033L9.25 0.53033"
        stroke={disabled ? "#CCCCCC" : "#0A0A0A"}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CarouselChevronLeft;
