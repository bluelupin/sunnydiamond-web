interface InformationIconProps {
  className?: string;
}

/** Figma node 1480:22654 — information icon for order footnotes */
const InformationIcon = ({ className }: InformationIconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 19.125 19.125"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <path
      d="M8.8125 8.8125C9.01141 8.8125 9.20218 8.89152 9.34283 9.03217C9.48348 9.17282 9.5625 9.36359 9.5625 9.5625V13.3125C9.5625 13.5114 9.64152 13.7022 9.78217 13.8428C9.92282 13.9835 10.1136 14.0625 10.3125 14.0625"
      stroke="currentColor"
      strokeWidth="1.125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.1875 6.375C9.70527 6.375 10.125 5.95527 10.125 5.4375C10.125 4.91973 9.70527 4.5 9.1875 4.5C8.66973 4.5 8.25 4.91973 8.25 5.4375C8.25 5.95527 8.66973 6.375 9.1875 6.375Z"
      fill="currentColor"
    />
    <path
      d="M9.5625 18.5625C14.5331 18.5625 18.5625 14.5331 18.5625 9.5625C18.5625 4.59194 14.5331 0.5625 9.5625 0.5625C4.59194 0.5625 0.5625 4.59194 0.5625 9.5625C0.5625 14.5331 4.59194 18.5625 9.5625 18.5625Z"
      stroke="currentColor"
      strokeWidth="1.125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default InformationIcon;
