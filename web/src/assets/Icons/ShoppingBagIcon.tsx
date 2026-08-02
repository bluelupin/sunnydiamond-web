interface ShoppingBagIconProps {
  className?: string;
}

/** Figma node 2556:654 — Cart icon */
const ShoppingBagIcon = ({ className }: ShoppingBagIconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 20.4952 18.25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <path
      d="M17.9042 5H2.59102C2.40668 4.99998 2.22868 5.06734 2.09055 5.18942C1.95241 5.3115 1.86367 5.47986 1.84102 5.66281L0.505087 16.9128C0.49273 17.0184 0.502948 17.1254 0.535065 17.2267C0.567182 17.328 0.620464 17.4213 0.69138 17.5005C0.762296 17.5796 0.849226 17.6428 0.94641 17.6858C1.04359 17.7288 1.14881 17.7507 1.25509 17.75H19.2401C19.3464 17.7507 19.4516 17.7288 19.5488 17.6858C19.6459 17.6428 19.7329 17.5796 19.8038 17.5005C19.8747 17.4213 19.928 17.328 19.9601 17.2267C19.9922 17.1254 20.0024 17.0184 19.9901 16.9128L18.6542 5.66281C18.6315 5.47986 18.5428 5.3115 18.4046 5.18942C18.2665 5.06734 18.0885 4.99998 17.9042 5Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.49759 5V4.25C6.49759 3.25544 6.89268 2.30161 7.59594 1.59835C8.2992 0.895088 9.25303 0.5 10.2476 0.5C11.2422 0.5 12.196 0.895088 12.8992 1.59835C13.6025 2.30161 13.9976 3.25544 13.9976 4.25V5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ShoppingBagIcon;
