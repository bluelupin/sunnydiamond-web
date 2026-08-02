const ErrorIllustration = () => (
  <div
    aria-hidden
    className="relative mx-auto flex size-44 items-center justify-center motion-safe:animate-error-float md:size-52"
  >
    <div className="absolute inset-0 rounded-full bg-[#D9C5A1]/25 blur-2xl" />
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="relative size-full drop-shadow-[0_18px_40px_rgba(184,137,78,0.18)]"
    >
      <path
        d="M100 24L124 68H168L132 98L144 144L100 118L56 144L68 98L32 68H76L100 24Z"
        stroke="#B8894E"
        strokeWidth="1.5"
        fill="#F6EFE3"
      />
      <path
        d="M100 52L112 76H136L118 90L124 114L100 100L76 114L82 90L64 76H88L100 52Z"
        fill="#D9C5A1"
        fillOpacity="0.55"
      />
      <circle cx="100" cy="100" r="58" stroke="#D9C5A1" strokeWidth="1" strokeDasharray="4 6" />
      <path
        d="M88 108H112M100 100V116"
        stroke="#B8894E"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M62 148C72 156 86 160 100 160C114 160 128 156 138 148"
        stroke="#6B6B6B"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  </div>
);

export default ErrorIllustration;
