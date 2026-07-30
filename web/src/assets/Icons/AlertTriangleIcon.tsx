interface AlertTriangleIconProps {
  className?: string;
}

/** Figma node 1480:39107 — payment due alert icon */
const AlertTriangleIcon = ({ className }: AlertTriangleIconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 20.502 18.25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <path
      d="M11.6019 1.27063L19.8013 15.5084C20.376 16.5116 19.6335 17.75 18.4504 17.75H2.05162C0.868496 17.75 0.125996 16.5116 0.700684 15.5084L8.90006 1.27063C9.49068 0.243125 11.0113 0.243125 11.6019 1.27063Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10.251 11V7.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M10.251 15.5C10.8723 15.5 11.376 14.9963 11.376 14.375C11.376 13.7537 10.8723 13.25 10.251 13.25C9.62968 13.25 9.126 13.7537 9.126 14.375C9.126 14.9963 9.62968 15.5 10.251 15.5Z"
      fill="currentColor"
    />
  </svg>
);

export default AlertTriangleIcon;
