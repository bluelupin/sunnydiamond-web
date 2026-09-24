"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ProfileSectionEmptyStateContextValue = {
  isEmpty: boolean;
  setEmpty: (isEmpty: boolean) => void;
  resetEmpty: () => void;
};

const ProfileSectionEmptyStateContext =
  createContext<ProfileSectionEmptyStateContextValue | null>(null);

export function ProfileSectionEmptyStateProvider({ children }: { children: ReactNode }) {
  const [isEmpty, setIsEmpty] = useState(false);

  const setEmpty = useCallback((next: boolean) => {
    setIsEmpty(next);
  }, []);

  const resetEmpty = useCallback(() => {
    setIsEmpty(false);
  }, []);

  const value = useMemo(
    () => ({ isEmpty, setEmpty, resetEmpty }),
    [isEmpty, setEmpty, resetEmpty],
  );

  return (
    <ProfileSectionEmptyStateContext.Provider value={value}>
      {children}
    </ProfileSectionEmptyStateContext.Provider>
  );
}

/** Hide the mobile section heading while an empty state is visible. */
export function useProfileSectionEmptyState(isEmpty: boolean) {
  const context = useContext(ProfileSectionEmptyStateContext);

  useEffect(() => {
    if (!context || !isEmpty) {
      return;
    }

    context.setEmpty(true);

    return () => {
      context.setEmpty(false);
    };
  }, [context, isEmpty]);
}

export function useProfileSectionIsEmpty() {
  return useContext(ProfileSectionEmptyStateContext)?.isEmpty ?? false;
}

export function useResetProfileSectionEmptyState() {
  return useContext(ProfileSectionEmptyStateContext)?.resetEmpty;
}
