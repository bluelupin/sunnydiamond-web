"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useLoginModal } from "@/features/auth/context/LoginModalContext";
import AppStatusToast, { AppStatusToastAction } from "@/shared/ui/AppStatusToast";
import {
  readGuestSavedInspirationsFromStorage,
  writeGuestSavedInspirationsToStorage,
} from "@/features/bespoke/utils/guestSavedInspirationsStorage";
import {
  savedInspirationToastContent,
  savedInspirationToastDurationMs,
} from "@/features/bespoke/data/content";
import { saveCustomerCreationClient } from "@/services/customer/customer-saved-creations.client";

type SaveInspirationResult = {
  alreadySaved: boolean;
};

type SaveInspirationOptions = {
  /** Simple message toast after authenticated save (no VIEW action). */
  onStatusMessage?: (message: string) => void;
};

interface SavedInspirationsContextType {
  savedDocumentIds: string[];
  isSaved: (creationDocumentId: string) => boolean;
  saveInspiration: (
    creationDocumentId: string,
    options?: SaveInspirationOptions,
  ) => Promise<SaveInspirationResult>;
}

const SavedInspirationsContext = createContext<SavedInspirationsContextType | undefined>(
  undefined,
);

export function SavedInspirationsProvider({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const { openLoginModal } = useLoginModal();
  const pathname = usePathname() ?? "/";
  const [savedDocumentIds, setSavedDocumentIds] = useState<string[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const savedDocumentIdsRef = useRef(savedDocumentIds);
  const inflightIdsRef = useRef(new Set<string>());
  const [isSavedToastOpen, setIsSavedToastOpen] = useState(false);
  const savedToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  savedDocumentIdsRef.current = savedDocumentIds;

  const dismissSavedToast = useCallback(() => {
    if (savedToastTimeoutRef.current) {
      clearTimeout(savedToastTimeoutRef.current);
      savedToastTimeoutRef.current = null;
    }
    setIsSavedToastOpen(false);
  }, []);

  const showGuestSavedToast = useCallback(() => {
    dismissSavedToast();
    setIsSavedToastOpen(true);
    savedToastTimeoutRef.current = setTimeout(() => {
      setIsSavedToastOpen(false);
      savedToastTimeoutRef.current = null;
    }, savedInspirationToastDurationMs);
  }, [dismissSavedToast]);

  const handleViewSavedInspirations = useCallback(() => {
    dismissSavedToast();
    openLoginModal({ returnUrl: pathname });
  }, [dismissSavedToast, openLoginModal, pathname]);

  useEffect(() => {
    return () => {
      if (savedToastTimeoutRef.current) {
        clearTimeout(savedToastTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    if (status === "guest") {
      setSavedDocumentIds(readGuestSavedInspirationsFromStorage());
      return;
    }

    if (status === "authenticated") {
      setSavedDocumentIds([]);
    }
  }, [hasLoaded, status]);

  const isSaved = useCallback(
    (creationDocumentId: string) => {
      const id = creationDocumentId.trim();
      if (!id) {
        return false;
      }
      return savedDocumentIds.includes(id);
    },
    [savedDocumentIds],
  );

  const saveInspiration = useCallback(
    async (
      creationDocumentId: string,
      options: SaveInspirationOptions = {},
    ): Promise<SaveInspirationResult> => {
      const id = creationDocumentId.trim();
      if (!id) {
        throw new Error("Missing creation id");
      }

      if (status === "guest") {
        const current = savedDocumentIdsRef.current;
        if (current.includes(id)) {
          options.onStatusMessage?.(savedInspirationToastContent.alreadySavedMessage);
          return { alreadySaved: true };
        }

        const next = [...current, id];
        setSavedDocumentIds(next);
        writeGuestSavedInspirationsToStorage(next);
        showGuestSavedToast();
        return { alreadySaved: false };
      }

      if (status !== "authenticated") {
        openLoginModal({ returnUrl: pathname });
        throw new Error("Authentication required");
      }

      if (inflightIdsRef.current.has(id)) {
        throw new Error("Save in progress");
      }

      inflightIdsRef.current.add(id);
      try {
        const result = await saveCustomerCreationClient(id);
        const message = result.alreadySaved
          ? savedInspirationToastContent.alreadySavedMessage
          : savedInspirationToastContent.savedMessage;
        options.onStatusMessage?.(message);
        return { alreadySaved: result.alreadySaved };
      } finally {
        inflightIdsRef.current.delete(id);
      }
    },
    [openLoginModal, pathname, showGuestSavedToast, status],
  );

  const value = useMemo(
    () => ({
      savedDocumentIds,
      isSaved,
      saveInspiration,
    }),
    [isSaved, saveInspiration, savedDocumentIds],
  );

  return (
    <SavedInspirationsContext.Provider value={value}>
      {children}
      <AppStatusToast
        open={isSavedToastOpen}
        message={savedInspirationToastContent.savedMessage}
        onDismiss={dismissSavedToast}
        action={
          <AppStatusToastAction onClick={handleViewSavedInspirations}>
            {savedInspirationToastContent.viewLabel}
          </AppStatusToastAction>
        }
      />
    </SavedInspirationsContext.Provider>
  );
}

export function useSavedInspirations() {
  const context = useContext(SavedInspirationsContext);
  if (!context) {
    throw new Error("useSavedInspirations must be used within SavedInspirationsProvider");
  }
  return context;
}
