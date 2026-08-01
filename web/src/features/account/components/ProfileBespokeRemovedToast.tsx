"use client";

import { X } from "lucide-react";
import { profileTabsContent } from "../data/profileContent";
import { useProfileBespokeToast } from "../context/ProfileBespokeToastContext";

/** Figma 1480:19151 — bespoke remove confirmation snackbar */
export function ProfileBespokeRemovedToastBanner() {
  const { toast, dismissBespokeRemovedToast } = useProfileBespokeToast();
  const content = profileTabsContent.bespoke;

  if (!toast) {
    return null;
  }

  const handleUndo = () => {
    dismissBespokeRemovedToast();
    void toast.onUndo?.();
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 flex animate-in fade-in slide-in-from-bottom-2 items-center gap-4 bg-darkblack px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] text-white duration-300"
      role="status"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <p className="font-gill text-sm font-normal leading-110 text-white">
          {content.removedToastMessage}
        </p>
        {toast.onUndo ? (
          <button
            type="button"
            onClick={handleUndo}
            className="shrink-0 border-b border-white pb-1 font-gill text-sm font-normal leading-110 text-white"
          >
            {content.removedUndoLabel}
          </button>
        ) : null}
      </div>
      <button
        type="button"
        onClick={dismissBespokeRemovedToast}
        className="shrink-0 text-white"
        aria-label="Dismiss notification"
      >
        <X className="size-5" strokeWidth={1.5} aria-hidden />
      </button>
    </div>
  );
}
