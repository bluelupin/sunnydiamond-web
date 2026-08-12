"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import AppStatusToast, { appStatusToastDurationMs } from "@/shared/ui/AppStatusToast";
import { profileTabsContent } from "../data/profileContent";

const content = profileTabsContent.addresses;

/** Longer than the default status toast so users have time to undo. */
const defaultAddressToastDurationMs = appStatusToastDurationMs * 2;

type ShowDefaultAddressChangedToastOptions = {
  onUndo?: () => Promise<void>;
};

export function useProfileDefaultAddressToast() {
  const [open, setOpen] = useState(false);
  const [undoAction, setUndoAction] = useState<ReactNode>(undefined);
  const undoHandlerRef = useRef<(() => Promise<void>) | undefined>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setOpen(false);
    setUndoAction(undefined);
    undoHandlerRef.current = undefined;
  }, []);

  const showDefaultAddressChangedToast = useCallback(
    ({ onUndo }: ShowDefaultAddressChangedToastOptions = {}) => {
      dismiss();
      undoHandlerRef.current = onUndo;

      setUndoAction(
        onUndo ? (
          <button
            type="button"
            onClick={() => {
              const undo = undoHandlerRef.current;
              dismiss();
              if (undo) {
                void undo();
              }
            }}
            className="shrink-0 border-b border-white pb-1 font-gill text-sm font-normal leading-110 text-white"
          >
            {content.defaultAddressUndoLabel}
          </button>
        ) : undefined,
      );

      setOpen(true);
      timeoutRef.current = setTimeout(dismiss, defaultAddressToastDurationMs);
    },
    [dismiss],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const toast = (
    <AppStatusToast
      open={open}
      message={content.defaultAddressChangedMessage}
      action={undoAction}
    />
  );

  return { showDefaultAddressChangedToast, toast };
}
