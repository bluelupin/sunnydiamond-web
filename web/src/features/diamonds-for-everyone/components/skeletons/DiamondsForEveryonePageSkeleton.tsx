const DiamondsForEveryonePageSkeleton = () => (
  <div aria-busy="true" aria-label="Loading diamonds for everyone page">
    <section className="relative grid h-[240px] w-full overflow-hidden bg-white md:h-320">
      <div className="absolute inset-0 animate-pulse bg-gray200" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center px-5 pb-10 lg:pb-16">
        <div className="h-10 w-64 animate-pulse rounded bg-white/30" aria-hidden />
      </div>
    </section>

    <section className="bg-white pt-10 sm:pt-16 lg:min-h-[700px] lg:pt-104">
      <div className="mx-auto flex w-full max-w-[700px] flex-col items-center px-4 text-center lg:max-w-[950px]">
        <div className="mb-8 h-10 w-full max-w-md animate-pulse rounded bg-gray200" aria-hidden />
        <div
          className="mx-auto h-[300px] w-[300px] animate-pulse rounded bg-gray200 lg:h-[350px] lg:w-[350px]"
          aria-hidden
        />
        <div className="mt-5 h-4 w-32 animate-pulse rounded bg-gray200 lg:mt-[23px]" aria-hidden />
        <div className="mt-2.5 h-6 w-full max-w-sm animate-pulse rounded bg-gray200 sm:mt-3 lg:mt-[13px]" aria-hidden />
      </div>
    </section>

    <section className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-10 md:px-16 lg:px-100 lg:pb-104">
      <div className="flex flex-col items-center justify-between gap-10 lg:flex-row lg:items-center">
        <div className="h-[280px] w-full max-w-[400px] animate-pulse rounded bg-gray200 md:h-[422px] lg:w-[541px] lg:max-w-[541px]" aria-hidden />
        <div className="flex w-full max-w-[530px] flex-col gap-10">
          <div className="h-10 w-full animate-pulse rounded bg-gray200" aria-hidden />
          <div className="h-32 w-full animate-pulse rounded bg-gray200" aria-hidden />
          <div className="h-14 w-full animate-pulse rounded bg-gray200" aria-hidden />
        </div>
      </div>
    </section>

    <section className="relative overflow-hidden bg-chalkCard py-16 md:min-h-[550px] md:bg-transparent md:py-104">
      <div className="mx-auto flex max-w-[1360px] flex-col items-center gap-8 px-4 md:gap-10 md:px-10">
        <div className="flex w-full max-w-[620px] flex-col items-center gap-6 md:max-w-[510px]">
          <div className="h-4 w-40 animate-pulse rounded bg-gray200" aria-hidden />
          <div className="flex w-full flex-col items-center gap-4">
            <div className="h-10 w-full max-w-md animate-pulse rounded bg-gray200" aria-hidden />
            <div className="h-5 w-full max-w-sm animate-pulse rounded bg-gray200" aria-hidden />
          </div>
        </div>
        <div className="hidden w-full max-w-[740px] flex-col items-center gap-6 md:flex">
          <div className="h-10 w-full animate-pulse rounded bg-gray200" aria-hidden />
          <div className="flex w-full max-w-[980px] justify-between gap-10">
            {[0, 1, 2].map((index) => (
              <div key={index} className="h-20 w-[200px] animate-pulse rounded bg-gray200 lg:w-[250px]" aria-hidden />
            ))}
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-12 md:hidden">
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex w-full flex-col items-center gap-4">
              <div className="size-10 animate-pulse rounded-full bg-gray200" aria-hidden />
              <div className="h-16 w-full max-w-xs animate-pulse rounded bg-gray200" aria-hidden />
            </div>
          ))}
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
