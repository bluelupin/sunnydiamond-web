const blockClass = "animate-pulse bg-gray200/70";

export default function CareersPageSkeleton() {
  return (
    <div className="bg-white" aria-hidden>
      <div className={`h-240 w-full md:h-320 ${blockClass}`} />
      <div className="space-y-6 px-4 py-10 md:px-10 md:py-104">
        <div className={`mx-auto h-10 w-64 ${blockClass}`} />
        <div className={`h-6 w-full max-w-xl ${blockClass}`} />
        <div className={`h-40 w-full ${blockClass}`} />
        <div className={`h-40 w-full ${blockClass}`} />
      </div>
    </div>
  );
}
