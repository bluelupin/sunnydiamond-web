import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { siteConfig } from "@/shared/lib/siteConfig";
import CareersJobSlugPage from "@/features/careers/components/CareersJobSlugPage";
import { getCareerJobPath } from "@/features/careers/constants/careersRoutes";
import {
  EMPTY_CAREERS_PAGE_DATA,
  getCareerOpeningByJobId,
  getCareersPageData,
} from "@/services/careers/careers.service";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ jobId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { jobId } = await params;
  const decodedJobId = decodeURIComponent(jobId);
  const job = await getCareerOpeningByJobId(decodedJobId);

  if (!job) {
    return constructMetadata({
      title: "Job Not Found",
      description: "The requested career opportunity could not be found.",
      noIndex: true,
    });
  }

  return constructMetadata({
    title: `${job.title} | Careers | ${siteConfig.brand.name}`,
    description: job.summary,
    canonicalPath: getCareerJobPath(job.jobCode),
  });
}

export default async function CareerJobPage({ params }: PageProps) {
  const { jobId } = await params;
  const decodedJobId = decodeURIComponent(jobId);

  const [job, cmsResult] = await Promise.allSettled([
    getCareerOpeningByJobId(decodedJobId),
    getCareersPageData(),
  ]);

  if (job.status !== "fulfilled" || !job.value) {
    notFound();
  }

  const cms = cmsResult.status === "fulfilled" ? cmsResult.value : EMPTY_CAREERS_PAGE_DATA;

  return <CareersJobSlugPage cms={cms} job={job.value} />;
}
