type ErrorStatusBadgeProps = {
  label: string;
};

const ErrorStatusBadge = ({ label }: ErrorStatusBadgeProps) => (
  <span className="inline-flex items-center rounded-full border border-[#D9C5A1]/80 bg-[#D9C5A1]/30 px-4 py-1.5 font-gill text-xs uppercase tracking-[0.12em] text-[#1E1E1E]">
    <span
      aria-hidden
      className="mr-2 inline-block size-1.5 rounded-full bg-[#B8894E] motion-safe:animate-pulse"
    />
    {label}
  </span>
);

export default ErrorStatusBadge;
