interface props {
  className?: string;
}

const ShowroomSectionSkeleton = ({ className }: props) => {
  return (
    <section
      className="bg-white lg:bg-gray200 lg:py-20 lg:h-846 md:h-auto h-auto"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-8 bg-white py-16 lg:hidden">
        <div
          className="mx-auto h-10 w-72 rounded bg-gray300"
          aria-hidden
        />
        <div className="w-full lg:border-r-[0.5px] lg:border-neutral300 px-4">
          <div className="flex flex-col gap-4 bg-gray300 py-6" aria-hidden>
            <div className="h-5 w-24 rounded bg-gray50" />
            <div className="h-[0.5px] w-full bg-neutral300" />
            <div className="aspect-[2500/1797] w-full rounded bg-gray50" />
            <div className="h-4 w-full rounded bg-gray50" />
            <div className="h-4 w-40 rounded bg-gray50" />
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="py-6" aria-hidden>
              <div className="h-5 w-28 rounded bg-gray300" />
            </div>
          ))}
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="2xl:pl-24 lg:pl-20 pl-5 lg:pr-0 pr-5">
          <div
            className="h-10 w-72 rounded bg-gray300 mx-auto lg:mx-0 mb-4 sm:mb-6 md:mb-8 lg:mb-10"
            aria-hidden
          />
          <div className="md:hidden mx-auto mb-4 h-5 w-80 rounded bg-gray300" aria-hidden />
        </div>
        <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2 md:gap-5 lg:gap-6 items-start lg:static relative">
          <div className="lg:px-0 px-5 lg:mb-0 mb-[14px] flex lg:flex-col flex-row lg:border-r lg:border-b-0 border-b border-gray600 overflow-x-auto">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="2xl:pl-24 lg:pl-20 lg:w-full w-fit lg:pr-4 lg:border-r-[3px] lg:border-b-0 border-b-[3px] transition-all duration-300 border-transparent"
              >
                <div className="h-50 w-40 rounded bg-gray300/70 lg:h-73" aria-hidden />
              </div>
            ))}
          </div>
          <div
            className="relative aspect-[350/480] h-478 overflow-hidden px-5 bg-gray300/70 md:aspect-[850/600] md:h-595 md:px-0"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
};

export default ShowroomSectionSkeleton;
