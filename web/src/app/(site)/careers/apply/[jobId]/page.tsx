import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { siteConfig } from "@/shared/lib/siteConfig";
import CareersApplyPage from "@/features/careers/components/CareersApplyPage";
import { getCareerApplyPath } from "@/features/careers/constants/careersRoutes";
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
    title: `Apply — ${job.title} | Careers | ${siteConfig.brand.name}`,
    description: `Apply for ${job.title} at ${siteConfig.brand.name}.`,
    canonicalPath: getCareerApplyPath(job.jobCode),
    noIndex: true,
  });
}

export default async function CareerApplyPage({ params }: PageProps) {
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

  return <CareersApplyPage cms={cms} job={job.value} />;
}
