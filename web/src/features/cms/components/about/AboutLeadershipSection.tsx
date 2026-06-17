import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import AboutSectionHeading from "@/features/cms/components/about/AboutSectionHeading";
import type { AboutLeadershipContent } from "@/types/about/aboutPage";

interface AboutLeadershipSectionProps {
  id?: string;
  content: AboutLeadershipContent;
}

const AboutLeadershipSection = ({ id, content }: AboutLeadershipSectionProps) => {
  const { title, description, members } = content;

  return (
    <section id={id} className="bg-white pb-16 md:pb-20 lg:pb-24">
      <div className="container">
        <AboutSectionHeading
          title={title}
          description={description}
          className="mb-10 md:mb-12 lg:mb-14"
        />

        <div className="flex flex-col sm:flex-row gap-1 sm:h-[600px]">
          {members.map((member) => (
            <div
              key={member.id}
              className="group relative overflow-hidden h-[400px] sm:h-full sm:aspect-auto sm:basis-0 sm:grow transition-[flex-grow] duration-500 ease-in-out sm:hover:grow-[2.4]"
            >
              <ResponsiveImage
                desktopSrc={member.image.desktopSrc}
                mobileSrc={member.image.mobileSrc}
                alt={member.image.alt}
                width={600}
                height={800}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />

              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />

              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 lg:p-7 translate-y-3 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                <p className="font-larken font-light text-xl md:text-2xl text-white leading-[110%] whitespace-nowrap">
                  {member.name}
                </p>
                <p className="mt-1 font-gill text-xs md:text-sm text-white/80 tracking-[0.12em] uppercase whitespace-nowrap">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutLeadershipSection;
