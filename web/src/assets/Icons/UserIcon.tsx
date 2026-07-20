interface UserIconProps {
  className?: string;
}

/** Figma node 2556:679 — Profile icon */
const UserIcon = ({ className }: UserIconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 19.0002 18.2501"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <path
      d="M9.50008 12.5C12.8138 12.5 15.5001 9.81371 15.5001 6.5C15.5001 3.18629 12.8138 0.5 9.50008 0.5C6.18637 0.5 3.50008 3.18629 3.50008 6.5C3.50008 9.81371 6.18637 12.5 9.50008 12.5Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M0.500083 17.75C2.31602 14.6122 5.61415 12.5 9.50008 12.5C13.386 12.5 16.6841 14.6122 18.5001 17.75"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default UserIcon;
