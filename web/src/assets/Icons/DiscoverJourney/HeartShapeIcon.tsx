/** Figma 4903:61397 — Discover journey step 3 diamond shape. */
interface props {
  className?: string;
}

const HeartShapeIcon = ({ className }: props) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M20 33C20 33 8 23 8 15C8 10.5 11.5 7 16 7C18.5 7 20 8.5 20 8.5C20 8.5 21.5 7 24 7C28.5 7 32 10.5 32 15C32 23 20 33 20 33Z"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M20 8.5V33M11 14H29" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
    <path
      d="M13 19L27 27M27 19L13 27"
      stroke="currentColor"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
  </svg>
);

export default HeartShapeIcon;
