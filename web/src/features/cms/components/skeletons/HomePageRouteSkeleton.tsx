const HomePageRouteSkeleton = () => (
  <>
    <section
      className="relative flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden"
      aria-busy="true"
      aria-label="Loading homepage"
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="absolute inset-0 animate-pulse bg-gray200" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-6 px-4 pb-11 md:pb-16">
          <div className="h-4 w-32 animate-pulse rounded bg-white/30" aria-hidden />
          <div className="h-10 w-72 max-w-full animate-pulse rounded bg-white/30" aria-hidden />
          <div className="h-14 w-40 animate-pulse rounded bg-white/40" aria-hidden />
        </div>
      </div>
      <div className="h-14 shrink-0 border-t border-gray200 bg-gray100 animate-pulse" aria-hidden />
    </section>

    <section className="w-full bg-white pb-16 md:pb-12" aria-hidden>
      <div className="relative h-390 overflow-hidden md:h-420 lg:h-432">
        <div className="absolute right-[-29px] top-[-100px] h-[435px] w-full animate-pulse rounded bg-gray200 sm:top-[-83px] md:h-[560px] md:w-[550px] lg:right-[2%] lg:top-[-204px] lg:h-[850px] lg:w-[600px]" />
        <div className="relative z-10 flex h-full flex-col items-center justify-end gap-4 px-4 pb-10 md:pb-12">
          <div className="h-6 w-48 animate-pulse rounded bg-gray200" />
          <div className="h-10 w-64 animate-pulse rounded bg-gray200" />
        </div>
      </div>
      <div className="mt-8 grid w-full grid-cols-2 gap-3 px-4 md:mt-10 md:grid-cols-4 md:gap-3 md:px-0 lg:mt-12">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="aspect-square animate-pulse bg-gray200" />
        ))}
      </div>
    </section>
  </>
);

export default HomePageRouteSkeleton;
