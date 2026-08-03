"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { NormalizedCareersPageData } from "@/services/careers/careers.types";
import { getCareerJobPath } from "../constants/careersRoutes";
import type { CareerJob, CareersApplicationEntry, CareersFlowStep } from "../types";
import { filterCareerJobs } from "../utils/careersFormatting";
import { getCareerJobById } from "../utils/careersJobs";
import { resetCareersHeaderMode, setCareersHeaderMode } from "./careersHeaderBridge";

export type CareersHeaderMode = "overlay" | "solid";

type CareersJobsContextValue = {
  cms: NormalizedCareersPageData;
  jobs: readonly CareerJob[];
  selectedJobId: string | null;
  selectedJob: CareerJob | null;
  flowStep: CareersFlowStep;
  searchQuery: string;
  locationFilter: string;
  departmentFilter: string;
  experienceFilter: string;
  filterOptions: NormalizedCareersPageData["listing"]["filterOptions"];
  filteredJobs: CareerJob[];
  headerMode: CareersHeaderMode;
  applicationEntry: CareersApplicationEntry | null;
  pendingResumeFile: File | null;
  selectJob: (jobId: string) => void;
  clearSelectedJob: () => void;
  setSearchQuery: (query: string) => void;
  setLocationFilter: (value: string) => void;
  setDepartmentFilter: (value: string) => void;
  setExperienceFilter: (value: string) => void;
  clearListingFilters: () => void;
  goToLanding: () => void;
  goToListings: () => void;
  goToDetail: (jobId: string) => void;
  goToApplication: (entry?: CareersApplicationEntry, resumeFile?: File) => void;
  clearPendingResume: () => void;
  goToSuccess: () => void;
  goBackFromApplication: () => void;
};

const CareersJobsContext = createContext<CareersJobsContextValue | undefined>(undefined);

function scrollCareersToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function headerModeForFlowStep(flowStep: CareersFlowStep): CareersHeaderMode {
  return flowStep === "landing" || flowStep === "listings" ? "overlay" : "solid";
}

type CareersJobsProviderProps = {
  cms: NormalizedCareersPageData;
  children: ReactNode;
  initialSelectedJobId?: string | null;
  initialFlowStep?: CareersFlowStep;
};

export function CareersJobsProvider({
  cms,
  children,
  initialSelectedJobId,
  initialFlowStep = "landing",
}: CareersJobsProviderProps) {
  const router = useRouter();
  const jobs = cms.jobs;
  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    initialSelectedJobId ?? jobs[0]?.id ?? null,
  );
  const [flowStep, setFlowStep] = useState<CareersFlowStep>(initialFlowStep);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [applicationEntry, setApplicationEntry] = useState<CareersApplicationEntry | null>(null);
  const [pendingResumeFile, setPendingResumeFile] = useState<File | null>(null);

  const filterOptions = cms.listing.filterOptions;

  const selectJob = useCallback((jobId: string) => {
    setSelectedJobId(jobId);
  }, []);

  const clearSelectedJob = useCallback(() => {
    setSelectedJobId(null);
  }, []);

  const clearListingFilters = useCallback(() => {
    setSearchQuery("");
    setLocationFilter("");
    setDepartmentFilter("");
    setExperienceFilter("");
  }, []);

  const goToLanding = useCallback(() => {
    setFlowStep("landing");
    setSearchQuery("");
    setLocationFilter("");
    setDepartmentFilter("");
    setExperienceFilter("");
    setCareersHeaderMode("overlay");
    scrollCareersToTop();
  }, []);

  const goToListings = useCallback(() => {
    setFlowStep("listings");
    setCareersHeaderMode("overlay");
    scrollCareersToTop();
  }, []);

  const goToDetail = useCallback(
    (jobId: string) => {
      const job = getCareerJobById(jobs, jobId);
      if (job?.jobCode) {
        router.push(getCareerJobPath(job.jobCode));
        return;
      }

      setSelectedJobId(jobId);
      setFlowStep("detail");
      setCareersHeaderMode("solid");
      scrollCareersToTop();
    },
    [jobs, router],
  );

  const goToApplication = useCallback(
    (entry: CareersApplicationEntry = "manual", resumeFile?: File) => {
      setApplicationEntry(entry);
      setPendingResumeFile(entry === "resume" && resumeFile ? resumeFile : null);
      setFlowStep("application");
      setCareersHeaderMode("solid");
      scrollCareersToTop();
    },
    [],
  );

  const clearPendingResume = useCallback(() => {
    setPendingResumeFile(null);
  }, []);

  const goBackFromApplication = useCallback(() => {
    setApplicationEntry(null);
    setPendingResumeFile(null);
    setFlowStep("detail");
    setCareersHeaderMode("solid");
    scrollCareersToTop();
  }, []);

  const goToSuccess = useCallback(() => {
    setApplicationEntry(null);
    setPendingResumeFile(null);
    setFlowStep("success");
    setCareersHeaderMode("solid");
    scrollCareersToTop();
  }, []);

  const filteredJobs = useMemo(
    () =>
      filterCareerJobs(jobs, searchQuery, {
        location: locationFilter || undefined,
        department: departmentFilter || undefined,
        experience: experienceFilter || undefined,
      }),
    [jobs, searchQuery, locationFilter, departmentFilter, experienceFilter],
  );

  const headerMode: CareersHeaderMode = headerModeForFlowStep(flowStep);

  useLayoutEffect(() => {
    setCareersHeaderMode(headerMode);
  }, [headerMode]);

  useLayoutEffect(() => {
    return () => resetCareersHeaderMode();
  }, []);

  const value = useMemo(
    () => ({
      cms,
      jobs,
      selectedJobId,
      selectedJob: getCareerJobById(jobs, selectedJobId),
      flowStep,
      searchQuery,
      locationFilter,
      departmentFilter,
      experienceFilter,
      filterOptions,
      filteredJobs,
      headerMode,
      applicationEntry,
      pendingResumeFile,
      selectJob,
      clearSelectedJob,
      setSearchQuery,
      setLocationFilter,
      setDepartmentFilter,
      setExperienceFilter,
      clearListingFilters,
      goToLanding,
      goToListings,
      goToDetail,
      goToApplication,
      clearPendingResume,
      goBackFromApplication,
      goToSuccess,
    }),
    [
      applicationEntry,
      clearSelectedJob,
      clearListingFilters,
      clearPendingResume,
      cms,
      departmentFilter,
      experienceFilter,
      filterOptions,
      filteredJobs,
      flowStep,
      goToApplication,
      goBackFromApplication,
      goToSuccess,
      headerMode,
      jobs,
      locationFilter,
      pendingResumeFile,
      searchQuery,
      selectJob,
      selectedJobId,
    ],
  );

  return <CareersJobsContext.Provider value={value}>{children}</CareersJobsContext.Provider>;
}

export function useCareersJobs() {
  const context = useContext(CareersJobsContext);

  if (!context) {
    throw new Error("useCareersJobs must be used within CareersJobsProvider");
  }

  return context;
}

export function useOptionalCareersJobs() {
  return useContext(CareersJobsContext);
}
