const DiamondsForEveryonePageSkeleton = () => (
  <div aria-busy="true" aria-label="Loading diamonds for everyone page">
    <section className="relative left-1/2 h-[240px] w-screen max-w-none -translate-x-1/2 overflow-hidden md:h-320">
      <div className="absolute inset-0 animate-pulse bg-gray200" aria-hidden />
      <div className="absolute bottom-10 left-1/2 z-10 h-10 w-64 -translate-x-1/2 animate-pulse rounded bg-white/30 md:bottom-16" aria-hidden />
    </section>

    <section className="relative w-full overflow-hidden px-4 py-16 md:py-[104px]">
      <div className="mx-auto flex max-w-[528px] flex-col items-center gap-4">
        <div className="h-10 w-full max-w-md animate-pulse rounded bg-gray200" aria-hidden />
        <div className="h-6 w-full max-w-sm animate-pulse rounded bg-gray200" aria-hidden />
      </div>
    </section>

    <section className="mx-auto max-w-[1440px] px-4 py-16 md:px-16 md:py-100">
      <div className="flex flex-col items-center justify-between gap-10 lg:flex-row lg:gap-16">
        <div className="h-[280px] w-full max-w-[400px] animate-pulse rounded bg-gray200 md:h-[422px] xl:max-w-[541px]" aria-hidden />
        <div className="flex w-full max-w-[530px] flex-col gap-6 md:gap-10">
          <div className="h-10 w-full animate-pulse rounded bg-gray200" aria-hidden />
          <div className="h-32 w-full animate-pulse rounded bg-gray200" aria-hidden />
          <div className="h-14 w-full animate-pulse rounded bg-gray200" aria-hidden />
        </div>
      </div>
    </section>

    <section className="h-[320px] w-full animate-pulse bg-gray200 md:h-[550px]" aria-hidden />

    <section className="relative overflow-hidden bg-chalkCard py-16 md:min-h-[550px] md:bg-gray300 md:py-[104px]">
      <div className="mx-auto flex max-w-[1360px] flex-col items-center gap-10 px-4 md:px-10">
        <div className="flex max-w-[620px] flex-col items-center gap-4">
          <div className="h-6 w-32 animate-pulse rounded bg-gray200" aria-hidden />
          <div className="h-10 w-full max-w-md animate-pulse rounded bg-gray200" aria-hidden />
        </div>
        <div className="hidden w-full max-w-[784px] flex-col items-center gap-6 md:flex">
          <div className="h-10 w-full animate-pulse rounded bg-gray200" aria-hidden />
          <div className="flex w-full justify-between gap-6">
            {[0, 1, 2].map((index) => (
              <div key={index} className="h-16 w-[250px] animate-pulse rounded bg-gray200" aria-hidden />
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-[1440px] px-4 py-16 md:px-10 md:py-[104px]">
      <div className="mx-auto flex max-w-[910px] flex-col gap-6">
        <div className="h-10 w-full max-w-md animate-pulse rounded bg-gray200 md:mx-auto" aria-hidden />
        {[0, 1, 2].map((index) => (
          <div key={index} className="h-12 w-full animate-pulse rounded bg-gray200" aria-hidden />
        ))}
      </div>
    </section>
  </div>
);

export default DiamondsForEveryonePageSkeleton;
