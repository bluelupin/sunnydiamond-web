import { cn } from "@/shared/utils/cn";

/** Figma 4903:141308 / Icons Redirect — showroom address row */
export function StoreLocatorAddressIcon({ className }: { className?: string }) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("size-6 shrink-0", className)}
    >
      <path
        d="M11.2541 12.7421L3.53381 10.5859C3.38249 10.5395 3.24971 10.4465 3.15449 10.3201C3.05926 10.1936 3.00646 10.0403 3.00365 9.8821C3.00084 9.72386 3.04817 9.56878 3.13885 9.43907C3.22953 9.30935 3.35892 9.21165 3.5085 9.15994L20.0085 3.03994C20.1409 2.99493 20.2832 2.9878 20.4194 3.01937C20.5556 3.05095 20.6802 3.11996 20.7793 3.21863C20.8783 3.31729 20.9478 3.44168 20.98 3.57775C21.0121 3.71382 21.0055 3.85616 20.961 3.98869L14.841 20.4887C14.7893 20.6383 14.6916 20.7677 14.5619 20.8584C14.4322 20.949 14.2771 20.9964 14.1188 20.9935C13.9606 20.9907 13.8073 20.9379 13.6809 20.8427C13.5545 20.7475 13.4614 20.6147 13.4151 20.4634L11.2541 12.7421Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Figma 4903:141311 / Icons Device (4453:2166 → 4453:2167) — showroom phone row */
export function StoreLocatorPhoneIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn("relative inline-flex size-6 shrink-0 overflow-clip text-darkblack", className)}
      aria-hidden
    >
      <span className="absolute bottom-[10.42%] left-1/4 right-1/4 top-[8.33%]">
        <span className="absolute inset-[-2.56%_-4.17%]">
          <svg
            viewBox="0 0 13 20.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block size-full max-w-none"
            preserveAspectRatio="none"
          >
            <path
              d="M12.5 18.5V2C12.5 1.17157 11.8284 0.5 11 0.5H2C1.17157 0.5 0.5 1.17157 0.5 2V18.5C0.5 19.3284 1.17157 20 2 20H11C11.8284 20 12.5 19.3284 12.5 18.5Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.5 4.8125C7.01777 4.8125 7.4375 4.39277 7.4375 3.875C7.4375 3.35723 7.01777 2.9375 6.5 2.9375C5.98223 2.9375 5.5625 3.35723 5.5625 3.875C5.5625 4.39277 5.98223 4.8125 6.5 4.8125Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </span>
    </span>
  );
}
