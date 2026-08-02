interface EditIconProps {
  className?: string;
}

/** Figma node 2083:10679 — checkout section edit icon */
const EditIcon = ({ className }: EditIconProps) => (
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
      d="M14.3578 7.52522L16.5839 9.75135M12.8737 17.9138H18.81M6.93736 14.9456L6.19531 17.9138L9.16348 17.1718L17.7608 8.57447C18.039 8.29616 18.1953 7.91874 18.1953 7.52522C18.1953 7.13169 18.039 6.75428 17.7608 6.47597L17.6332 6.34834C17.3549 6.07012 16.9774 5.91382 16.5839 5.91382C16.1904 5.91382 15.813 6.07012 15.5347 6.34834L6.93736 14.9456Z"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default EditIcon;
