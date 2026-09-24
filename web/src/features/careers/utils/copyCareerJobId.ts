import { toast } from "@/shared/hooks/use-toast";
import {
  CAREERS_COPY_JOB_ID_ERROR_MESSAGE,
  CAREERS_COPY_JOB_ID_SUCCESS_MESSAGE,
} from "../constants/careersCopy";

export async function copyCareerJobId(jobCode: string): Promise<boolean> {
  const trimmed = jobCode.trim();
  if (!trimmed) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(trimmed);
    toast({ title: CAREERS_COPY_JOB_ID_SUCCESS_MESSAGE });
    return true;
  } catch {
    toast({
      title: CAREERS_COPY_JOB_ID_ERROR_MESSAGE,
      description: "Please copy the Job ID manually.",
    });
    return false;
  }
}
