import { errorPageCopy } from "@/features/error/data/errorPageContent";

type ErrorStatusCardProps = {
  statusLabel: string;
  lastChecked: string;
  estimatedTime?: string;
  errorCode?: string;
};

const ErrorStatusCard = ({
  statusLabel,
  lastChecked,
  estimatedTime,
  errorCode,
}: ErrorStatusCardProps) => (
  <section
    aria-label="Service status details"
    className="w-full max-w-md rounded-2xl border border-[#D9C5A1]/60 bg-white/50 p-5 shadow-[0_12px_40px_rgba(30,30,30,0.06)] backdrop-blur-sm md:p-6"
  >
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1">
        <dt className="font-gill text-xs uppercase tracking-[0.1em] text-[#6B6B6B]">
          {errorPageCopy.statusCard.status}
        </dt>
        <dd className="font-gill text-base text-[#1E1E1E]">{statusLabel}</dd>
      </div>
      <div className="flex flex-col gap-1">
        <dt className="font-gill text-xs uppercase tracking-[0.1em] text-[#6B6B6B]">
          {errorPageCopy.statusCard.lastChecked}
        </dt>
        <dd className="font-gill text-base text-[#1E1E1E]">{lastChecked}</dd>
      </div>
      {estimatedTime ? (
        <div className="flex flex-col gap-1">
          <dt className="font-gill text-xs uppercase tracking-[0.1em] text-[#6B6B6B]">
            {errorPageCopy.statusCard.estimatedTime}
          </dt>
          <dd className="font-gill text-base text-[#1E1E1E]">{estimatedTime}</dd>
        </div>
      ) : null}
      {errorCode ? (
        <div className="flex flex-col gap-1">
          <dt className="font-gill text-xs uppercase tracking-[0.1em] text-[#6B6B6B]">
            {errorPageCopy.statusCard.errorCode}
          </dt>
          <dd className="font-gill text-base text-[#1E1E1E]">{errorCode}</dd>
        </div>
      ) : null}
    </dl>
  </section>
);

export default ErrorStatusCard;
