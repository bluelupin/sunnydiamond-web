export default function Loading() {
  return (
    <section
      className="mx-auto min-h-screen w-full max-w-1440 px-4 pt-6 md:px-8 md:pt-16 lg:px-10"
      aria-label="Loading article"
      aria-busy="true"
    >
      <div className="h-10 w-3/4 max-w-[640px] animate-pulse rounded bg-gray200" />
      <div className="mt-8 aspect-[3/2] w-full max-w-[1000px] animate-pulse rounded bg-gray200 md:mx-auto" />
    </section>
  );
}
