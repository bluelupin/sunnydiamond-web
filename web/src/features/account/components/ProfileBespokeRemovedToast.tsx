"use client";

import { X } from "lucide-react";
import { profileTabsContent } from "../data/profileContent";
import { useProfileBespokeToast } from "../context/ProfileBespokeToastContext";

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
      className="mt-4 flex w-max max-w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-top-2 items-center gap-8 bg-darkblack px-4 py-3 text-white duration-300"
      role="status"
    >
      <div className="flex min-w-0 items-center gap-3">
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
        <X className="size-6" strokeWidth={1.5} aria-hidden />
      </button>
    </div>
  );
}
