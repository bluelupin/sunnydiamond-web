import Layout from "@/components/layout/Layout";
import { PrimaryLink } from "@/components/shared/PrimaryButton";

interface StaticRoutePageProps {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}

const StaticRoutePage = ({
  title,
  description,
  ctaHref = "/",
  ctaLabel = "Back to Home",
}: StaticRoutePageProps) => {
  return (
    <Layout>
      <section className="container py-14 md:py-20 lg:py-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center rounded-[2rem] border border-border/60 bg-card px-6 py-14 text-center shadow-[0_24px_80px_rgba(15,23,42,0.06)] sm:px-10 md:px-14">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Coming Soon
          </p>
          <h1 className="mt-4 text-h1 text-foreground">{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            {description}
          </p>
          <div className="mt-10">
            <PrimaryLink href={ctaHref}>{ctaLabel}</PrimaryLink>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default StaticRoutePage;
