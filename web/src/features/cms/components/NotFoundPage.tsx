import Layout from "@/shared/ui/layout/Layout";
import { PrimaryLink } from "@/shared/ui/PrimaryButton";

const NotFoundPage = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh] text-center px-4">
        <div>
          <h1 className="font-heading text-6xl font-semibold text-foreground mb-4">404</h1>
          <p className="font-body text-lg text-muted-foreground mb-6">
            The page you're looking for doesn't exist.
          </p>
          <PrimaryLink href="/">Return to Home</PrimaryLink>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;
