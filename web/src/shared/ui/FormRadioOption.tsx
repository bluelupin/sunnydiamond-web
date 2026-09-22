"use client";

import FormRadioButtonIcon from "@/assets/Icons/FormRadioButtonIcon";
import { cn } from "@/shared/utils/cn";

type FormRadioOptionProps = {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onSelect: (value: string) => void;
  labelClassName?: string;
  className?: string;
};

const FormRadioOption = ({
  name,
  value,
  label,
  checked,
  disabled = false,
  onSelect,
  labelClassName,
  className,
}: FormRadioOptionProps) => {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-2 font-gill text-base leading-110",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <span className="relative inline-flex size-6 shrink-0 items-center justify-center">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={() => onSelect(value)}
          className="absolute inset-0 m-0 cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed"
        />
        <FormRadioButtonIcon checked={checked} className="size-6" />
      </span>
      <span className={cn("font-light", labelClassName)}>{label}</span>
    </label>
  );
};

export default FormRadioOption;
