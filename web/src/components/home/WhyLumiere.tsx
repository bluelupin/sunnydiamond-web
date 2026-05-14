import { Award, Leaf, Users, Shield } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { homeContent } from "@/data/content";
import { useFadeIn } from "@/hooks/use-fade-in";

const iconMap = {
  Award,
  Leaf,
  Users,
  Shield,
} as const;

const WhyLumiere = ({ id }: { id?: string }) => {
  const { whyUs } = homeContent;
  const ref = useFadeIn();

  return (
    <section id={id} ref={ref} className="container py-16 md:py-24">
      <SectionHeader subtitle={whyUs.subtitle} title={whyUs.title} className="mb-12" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {whyUs.items.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <div key={item.title} className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <Icon size={22} className="text-primary" />
              </div>
              <h3 className="font-heading text-lg font-medium text-foreground">{item.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WhyLumiere;
