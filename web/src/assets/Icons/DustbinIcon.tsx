interface DustbinIconProps {
  className?: string;
}

const DustbinIcon = ({ className }: DustbinIconProps) => (
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
      d="M9 3H15M5 6H19M18 6L17.2 19.1C17.1 20.2 16.2 21 15.1 21H8.9C7.8 21 6.9 20.2 6.8 19.1L6 6"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10 10V16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <path d="M14 10V16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export default DustbinIcon;
