import { cn } from "@/shared/utils/cn";

type FormRadioButtonIconProps = {
  checked: boolean;
  className?: string;
};

/** Figma Radio Button — gold500 selected, gray600 unselected outline */
const FormRadioButtonIcon = ({ checked, className }: FormRadioButtonIconProps) => {
  if (checked) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        aria-hidden
      >
        <circle cx="12" cy="12" r="9.25" stroke="#C5A156" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="5" fill="#C5A156" />
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
      <circle cx="12" cy="12" r="9.25" stroke="#999999" strokeWidth="1.5" />
    </svg>
  );
};

export default FormRadioButtonIcon;
