"use client";

import AppStatusToast from "@/shared/ui/AppStatusToast";
import { profileTabsContent } from "../data/profileContent";
import { useProfileBespokeToast } from "../context/ProfileBespokeToastContext";

const content = profileTabsContent.bespoke;

/** Bespoke remove confirmation — uses shared AppStatusToast layout (top-centered). */
export function ProfileBespokeRemovedToastBanner() {
  const { toast, dismissBespokeRemovedToast } = useProfileBespokeToast();

  const undoAction =
    toast?.onUndo ? (
      <button
        type="button"
        onClick={() => {
          const undo = toast.onUndo;
          dismissBespokeRemovedToast();
          if (undo) {
            void undo();
          }
        }}
        className="shrink-0 border-b border-white pb-1 font-gill text-sm font-normal leading-110 text-white"
      >
        {content.removedUndoLabel}
      </button>
    ) : undefined;

  return (
    <AppStatusToast
      open={Boolean(toast)}
      message={content.removedToastMessage}
      action={undoAction}
    />
  );
}
