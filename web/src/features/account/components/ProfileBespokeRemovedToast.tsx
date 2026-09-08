"use client";

import AppStatusToast, { AppStatusToastAction } from "@/shared/ui/AppStatusToast";
import { profileTabsContent } from "../data/profileContent";
import { useProfileBespokeToast } from "../context/ProfileBespokeToastContext";

const content = profileTabsContent.bespoke;

/** Bespoke remove confirmation — uses shared AppStatusToast layout (top-centered). */
export function ProfileBespokeRemovedToastBanner() {
  const { toast, dismissBespokeRemovedToast } = useProfileBespokeToast();

  const undoAction =
    toast?.onUndo ? (
      <AppStatusToastAction
        onClick={() => {
          const undo = toast.onUndo;
          dismissBespokeRemovedToast();
          if (undo) {
            void undo();
          }
        }}
      >
        {content.removedUndoLabel}
      </AppStatusToastAction>
    ) : undefined;

  return (
    <AppStatusToast
      open={Boolean(toast)}
      message={content.removedToastMessage}
      action={undoAction}
    />
  );
}
