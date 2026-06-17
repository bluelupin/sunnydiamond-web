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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          {members.map((member) => (
            <div key={member.id} className="aspect-[3/4] overflow-hidden group">
              <ResponsiveImage
                desktopSrc={member.image.desktopSrc}
                mobileSrc={member.image.mobileSrc}
                alt={member.image.alt}
                width={600}
                height={800}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutLeadershipSection;
