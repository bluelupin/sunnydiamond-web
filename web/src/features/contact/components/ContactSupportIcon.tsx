"use client";

import { cn } from "@/shared/utils/cn";

const ICON_BOX_CLASS = "relative size-6 shrink-0 overflow-clip";

type ContactSupportIconProps = {
  name: "phone" | "email";
  className?: string;
};

export function ContactSupportIcon({ name, className }: ContactSupportIconProps) {
  if (name === "phone") {
    return (
      <span className={cn(ICON_BOX_CLASS, className)} aria-hidden>
        <span className="absolute left-[calc(50%-0.38px)] top-[calc(50%-0.38px)] size-[17.25px] -translate-x-1/2 -translate-y-1/2">
          <span className="absolute inset-[-3.26%]">
            <img
              src="/images/contact/icon-phone.svg"
              alt=""
              className="block size-full max-w-none"
            />
          </span>
        </span>
      </span>
    );
  }

  return (
    <span className={cn(ICON_BOX_CLASS, className)} aria-hidden>
      <span className="absolute inset-[21.88%_12.5%]">
        <span className="absolute inset-[-4.17%_-3.13%]">
          <img
            src="/images/contact/icon-email.svg"
            alt=""
            className="block size-full max-w-none"
          />
        </span>
      </span>
    </span>
  );
}
