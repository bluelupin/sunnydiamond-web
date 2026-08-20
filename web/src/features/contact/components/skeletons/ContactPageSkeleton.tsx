const ContactPageSkeleton = () => (
  <div aria-busy="true" aria-label="Loading contact page">
    <section className="relative left-1/2 h-[240px] w-screen max-w-none -translate-x-1/2 overflow-hidden md:h-320">
      <div className="absolute inset-0 animate-pulse bg-gray200" aria-hidden />
      <div className="absolute bottom-10 left-1/2 z-10 h-10 w-48 -translate-x-1/2 animate-pulse rounded bg-white/30 md:bottom-16" aria-hidden />
    </section>

    <div className="flex flex-col gap-16 pt-16 md:gap-[100px]">
      <section className="w-full px-4 md:px-10 xl:px-[150px]">
        <div className="mx-auto flex max-w-1360 flex-col items-center gap-10 md:pt-16">
          <div className="h-6 w-full max-w-[606px] animate-pulse rounded bg-gray200" aria-hidden />
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <div key={index} className="h-48 animate-pulse rounded bg-gray200" aria-hidden />
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-4 md:px-10">
        <div className="mx-auto max-w-[1140px] md:bg-gray200 md:p-6">
          <div className="flex flex-col gap-6">
            <div className="h-8 w-64 animate-pulse rounded bg-gray200" aria-hidden />
            <div className="flex flex-col gap-4">
              {[0, 1, 2, 3, 4].map((index) => (
                <div key={index} className="h-14 w-full animate-pulse rounded bg-gray200" aria-hidden />
              ))}
            </div>
            <div className="h-14 w-full animate-pulse rounded bg-gray200 md:w-40" aria-hidden />
          </div>
        </div>
      </section>

      <section className="h-[800px] w-full animate-pulse bg-gray200 md:h-804" aria-hidden />
    </div>
  </div>
);

export default ContactPageSkeleton;
