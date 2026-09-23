"use client";

import { ProfileAddressToast } from "./ProfileAddressToast";
import { profileTabsContent } from "../data/profileContent";
import { useProfileBespokeToast } from "../context/ProfileBespokeToastContext";

const content = profileTabsContent.bespoke;

/** Bespoke remove confirmation — Figma 4210:54478 (message, UNDO, close). */
export function ProfileBespokeRemovedToastBanner() {
  const { toast, dismissBespokeRemovedToast } = useProfileBespokeToast();

  const handleUndo = toast?.onUndo
    ? () => {
        const undo = toast.onUndo;
        dismissBespokeRemovedToast();
        if (undo) {
          void undo();
        }
      }
    : undefined;

  return (
    <ProfileAddressToast
      open={Boolean(toast)}
      message={content.removedToastMessage}
      undoLabel={toast?.onUndo ? content.removedUndoLabel : undefined}
      onUndo={handleUndo}
      onDismiss={dismissBespokeRemovedToast}
    />
  );
}
