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
import { careerJobs, getCareerJobById } from "../data/content";
import type { CareerJob, CareersApplicationEntry, CareersFlowStep } from "../types";
import {
  filterCareerJobs,
  getUniqueCareerFilterOptions,
} from "../utils/careersFormatting";
import { resetCareersHeaderMode, setCareersHeaderMode } from "./careersHeaderBridge";

export type CareersHeaderMode = "overlay" | "solid";

type CareersJobsContextValue = {
  jobs: readonly CareerJob[];
  selectedJobId: string | null;
  selectedJob: CareerJob | null;
  flowStep: CareersFlowStep;
  searchQuery: string;
  locationFilter: string;
  departmentFilter: string;
  experienceFilter: string;
  filterOptions: ReturnType<typeof getUniqueCareerFilterOptions>;
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
  children: ReactNode;
};

export function CareersJobsProvider({ children }: CareersJobsProviderProps) {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(careerJobs[0]?.id ?? null);
  const [flowStep, setFlowStep] = useState<CareersFlowStep>("landing");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [applicationEntry, setApplicationEntry] = useState<CareersApplicationEntry | null>(null);
  const [pendingResumeFile, setPendingResumeFile] = useState<File | null>(null);

  const filterOptions = useMemo(() => getUniqueCareerFilterOptions(careerJobs), []);

  const selectJob = useCallback((jobId: string) => {
    setSelectedJobId(jobId);
  }, []);

  const clearSelectedJob = useCallback(() => {
    setSelectedJobId(null);
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

  const goToDetail = useCallback((jobId: string) => {
    setSelectedJobId(jobId);
    setFlowStep("detail");
    setCareersHeaderMode("solid");
    scrollCareersToTop();
  }, []);

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
      filterCareerJobs(careerJobs, searchQuery, {
        location: locationFilter || undefined,
        department: departmentFilter || undefined,
        experience: experienceFilter || undefined,
      }),
    [searchQuery, locationFilter, departmentFilter, experienceFilter],
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
      jobs: careerJobs,
      selectedJobId,
      selectedJob: getCareerJobById(selectedJobId),
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
      clearPendingResume,
      departmentFilter,
      experienceFilter,
      filterOptions,
      filteredJobs,
      flowStep,
      goToApplication,
      goBackFromApplication,
      goToSuccess,
      headerMode,
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
