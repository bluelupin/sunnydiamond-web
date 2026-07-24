"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { careerJobs, getCareerJobById } from "../data/content";
import type { CareerJob } from "../types";

type CareersJobsContextValue = {
  jobs: readonly CareerJob[];
  selectedJobId: string | null;
  selectedJob: CareerJob | null;
  selectJob: (jobId: string) => void;
  clearSelectedJob: () => void;
};

const CareersJobsContext = createContext<CareersJobsContextValue | undefined>(undefined);

type CareersJobsProviderProps = {
  children: ReactNode;
};

export function CareersJobsProvider({ children }: CareersJobsProviderProps) {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(careerJobs[0]?.id ?? null);

  const selectJob = useCallback((jobId: string) => {
    setSelectedJobId(jobId);
  }, []);

  const clearSelectedJob = useCallback(() => {
    setSelectedJobId(null);
  }, []);

  const value = useMemo(
    () => ({
      jobs: careerJobs,
      selectedJobId,
      selectedJob: getCareerJobById(selectedJobId),
      selectJob,
      clearSelectedJob,
    }),
    [clearSelectedJob, selectJob, selectedJobId],
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
