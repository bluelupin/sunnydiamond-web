import { cn } from "@/shared/utils/cn";

export type GiftingPanelCheckboxCheckedFill = "gold" | "black";

type GiftingPanelCheckboxIconProps = {
  checked: boolean;
  className?: string;
  /** Checked box fill — default gold matches gifting/cart panels. */
  checkedFill?: GiftingPanelCheckboxCheckedFill;
};

const CHECKED_FILL_COLORS: Record<
  GiftingPanelCheckboxCheckedFill,
  { box: string; checkmark: string }
> = {
  gold: { box: "#C5A156", checkmark: "#0A0A0A" },
  black: { box: "#0A0A0A", checkmark: "#FFFFFF" },
};

const GiftingPanelCheckboxIcon = ({
  checked,
  className,
  checkedFill = "gold",
}: GiftingPanelCheckboxIconProps) => {
  if (checked) {
    const colors = CHECKED_FILL_COLORS[checkedFill];

    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        aria-hidden
      >
        <path
          d="M19.5 3.75H4.5C4.08579 3.75 3.75 4.08579 3.75 4.5V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V4.5C20.25 4.08579 19.9142 3.75 19.5 3.75Z"
          fill={colors.box}
          stroke={colors.box}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.25 12.75L10.5 15L15.75 9.75"
          stroke={colors.checkmark}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path
        d="M19.5 3.75H4.5C4.08579 3.75 3.75 4.08579 3.75 4.5V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V4.5C20.25 4.08579 19.9142 3.75 19.5 3.75Z"
        stroke="#999999"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default GiftingPanelCheckboxIcon;
