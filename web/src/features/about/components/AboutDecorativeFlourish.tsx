interface AboutDecorativeFlourishProps {
  className?: string;
}

const AboutDecorativeFlourish = ({ className }: AboutDecorativeFlourishProps) => {
  return (
    <svg
      width="20"
      height="19"
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <path
        d="M10.48 9.62C5.2 14.9 0.52 18.58 0.04 18.17C-0.44 17.76 3.24 13.08 8.52 7.8C3.24 2.52 -0.44 -1.16 0.04 -1.57C0.52 -1.98 5.2 1.7 10.48 6.98C15.76 1.7 20.44 -1.98 20.92 -1.57C21.4 -1.16 17.72 2.52 12.44 7.8C17.72 13.08 21.4 17.76 20.92 18.17C20.44 18.58 15.76 14.9 10.48 9.62Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default AboutDecorativeFlourish;
