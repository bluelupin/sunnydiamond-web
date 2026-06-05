interface props {
    className?: string;
}
const ShowroomSectionSkeleton = ({ className }: props) => {
    return (
        <section
            className="bg-gray200 py-10 sm:py-12 md:py-16 lg:py-20 lg:h-846 md:h-auto h-auto"
            aria-busy="true"
        >
            <div className="2xl:pl-24 lg:pl-20 pl-5 lg:pr-0 pr-5">
                <div className="h-10 w-72 bg-gray300 rounded mx-auto lg:mx-0 mb-4 sm:mb-6 md:mb-8 lg:mb-10" aria-hidden />
                <div className="lg:hidden h-5 w-80 bg-gray300 rounded mx-auto mb-4" aria-hidden />
            </div>
            <div className="lg:grid grid-cols-1 lg:grid-cols-2 gap-[14px] md:gap-5 lg:gap-6 items-start lg:static relative">
                <div className="lg:px-0 px-5 lg:mb-0 mb-[14px] flex lg:flex-col flex-row lg:border-r lg:border-b-0 border-b border-gray600 overflow-x-auto">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="2xl:pl-24 lg:pl-20 lg:w-full w-fit lg:pr-4 lg:border-r-[3px] lg:border-b-0 border-b-[3px] transition-all duration-300 border-transparent">
                            <div className="w-40 h-50 lg:h-73 bg-gray300/70 rounded" aria-hidden />
                        </div>
                    ))}
                </div>
                <div className="relative aspect-auto lg:aspect-auto lg:h-595 h-478 overflow-hidden lg:px-0 px-5 bg-gray300/70" aria-hidden />
            </div>
        </section>
    )
}
export default ShowroomSectionSkeleton;