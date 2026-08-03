"use client";

import { useCallback, useState } from "react";
import { profileDetailsContent } from "../data/profileContent";

type DeleteAccountPayload = {
  reason: string;
  comments: string;
};

type UseDeleteAccountResult = {
  isSubmitting: boolean;
  error: string | null;
  clearError: () => void;
  deleteAccount: (payload: DeleteAccountPayload) => Promise<void>;
};

const content = profileDetailsContent.deleteAccount;

export function useDeleteAccount(): UseDeleteAccountResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // The caller needs the failure (the success dialog must stay closed), so rethrow.
  const deleteAccount = useCallback(async (payload: DeleteAccountPayload) => {
    setIsSubmitting(true);
    setError(null);

    let failure: string | null = null;

    try {
      const response = await fetch("/api/customer/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { code?: string };
        // Unlike order cancellation, a 409 here means the deletion did NOT happen.
        failure =
          response.status === 409 && body.code === "ACTIVE_ORDERS"
            ? content.activeOrdersMessage
            : content.errorMessage;
      }
    } catch {
      failure = content.errorMessage;
    } finally {
      setIsSubmitting(false);
    }

    if (failure) {
      setError(failure);
      throw new Error(failure);
    }
  }, []);

  return { isSubmitting, error, clearError, deleteAccount };
}
