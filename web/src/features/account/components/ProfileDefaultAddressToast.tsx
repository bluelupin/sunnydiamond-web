"use client";

import { X } from "lucide-react";
import { toast } from "sonner";
import { profileTabsContent } from "../data/profileContent";

type ShowDefaultAddressChangedToastOptions = {
  onUndo?: () => Promise<void>;
};

export function showDefaultAddressChangedToast({
  onUndo,
}: ShowDefaultAddressChangedToastOptions) {
  const content = profileTabsContent.addresses;

  toast.custom(
    (id) => (
      <div
        className="flex w-full min-w-[320px] max-w-[480px] items-center gap-8 bg-darkblack px-4 py-3 text-white shadow-lg"
        role="status"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <p className="font-gill text-sm font-normal leading-110 text-white">
            {content.defaultAddressChangedMessage}
          </p>
          {onUndo ? (
            <button
              type="button"
              onClick={() => {
                toast.dismiss(id);
                void onUndo();
              }}
              className="shrink-0 border-b border-white pb-1 font-gill text-sm font-normal leading-110 text-white"
            >
              {content.defaultAddressUndoLabel}
            </button>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => toast.dismiss(id)}
          className="shrink-0 text-white"
          aria-label="Dismiss notification"
        >
          <X className="size-6" strokeWidth={1.5} aria-hidden />
        </button>
      </div>
    ),
    { duration: 8000, className: "!bg-transparent !border-0 !p-0 !shadow-none" },
  );
}
