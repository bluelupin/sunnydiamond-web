import Layout from "@/components/layout/Layout";
import SectionHeader from "@/components/shared/SectionHeader";
import StatGrid from "@/components/shared/StatGrid";
import { aboutContent } from "@/data/content";

const AboutPage = () => {
  return (
    <Layout>
      <article className="container py-10 md:py-16 max-w-3xl mx-auto">
        <SectionHeader
          subtitle={aboutContent.header.subtitle}
          title={aboutContent.header.title}
          as="h1"
          className="mb-12"
        />

        <div className="space-y-6 font-body text-sm leading-relaxed text-muted-foreground">
          {aboutContent.paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}

          <StatGrid items={aboutContent.stats} />

          <p>{aboutContent.closingParagraph}</p>
        </div>
      </article>
    </Layout>
  );
};

export default AboutPage;
