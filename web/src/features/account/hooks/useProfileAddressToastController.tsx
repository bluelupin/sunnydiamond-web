"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ProfileAddressToast,
  profileAddressToastDurationMs,
  profileAddressToastWithUndoDurationMs,
} from "../components/ProfileAddressToast";
import { profileTabsContent } from "../data/profileContent";

const content = profileTabsContent.addresses;

type ShowProfileAddressToastOptions = {
  onUndo?: () => void | Promise<void>;
};

/** Address-module toast controller — UNDO is shown only when `onUndo` is provided. */
export function useProfileAddressToastController() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showUndo, setShowUndo] = useState(false);
  const undoCallbackRef = useRef<(() => void | Promise<void>) | undefined>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setOpen(false);
    setMessage("");
    setShowUndo(false);
    undoCallbackRef.current = undefined;
  }, []);

  const handleUndo = useCallback(() => {
    const undo = undoCallbackRef.current;
    undoCallbackRef.current = undefined;
    dismiss();

    if (undo) {
      void undo();
    }
  }, [dismiss]);

  const show = useCallback(
    (nextMessage: string, options?: ShowProfileAddressToastOptions) => {
      const trimmed = nextMessage.trim();
      if (!trimmed) {
        return;
      }

      dismiss();
      undoCallbackRef.current = options?.onUndo;
      setMessage(trimmed);
      setShowUndo(Boolean(options?.onUndo));
      setOpen(true);

      const duration = options?.onUndo
        ? profileAddressToastWithUndoDurationMs
        : profileAddressToastDurationMs;

      timeoutRef.current = setTimeout(dismiss, duration);
    },
    [dismiss],
  );

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const node = (
    <ProfileAddressToast
      open={open}
      message={message}
      undoLabel={showUndo ? content.defaultAddressUndoLabel : undefined}
      onUndo={showUndo ? handleUndo : undefined}
      onDismiss={dismiss}
    />
  );

  return { show, dismiss, node };
}
