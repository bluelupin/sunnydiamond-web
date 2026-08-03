"use client";

import FormFieldError from "@/shared/ui/FormFieldError";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { careersFormLabelClassName } from "@/features/careers/constants/careersApplicationForm";
import { cn } from "@/shared/utils/cn";
import { invalidFieldClassName } from "@/shared/utils/formValidation";

/** Radix Select does not allow empty string values — maps cleared selection to this sentinel. */
export const CAREERS_SELECT_EMPTY_VALUE = "__careers_select_empty__";

/** Matches CareersJobFilterFields / MetalEngravingPanel font dropdown trigger styling. */
export const careersSelectTriggerClassName =
  "h-14 rounded-none border-0 bg-aboutInactive px-3 font-gill text-base text-darkblack focus:ring-0";

type CareersSelectFieldProps = {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: readonly string[];
  error?: string;
  placeholder?: string;
  labelClassName?: string;
  className?: string;
};

const CareersSelectField = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  options,
  error,
  placeholder = "Select",
  labelClassName = careersFormLabelClassName,
  className,
}: CareersSelectFieldProps) => {
  const selectPlaceholder = placeholder.trim() || "Select";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <Select
        value={value || CAREERS_SELECT_EMPTY_VALUE}
        onValueChange={(next) => {
          onChange(next === CAREERS_SELECT_EMPTY_VALUE ? "" : next);
          onBlur?.();
        }}
        onOpenChange={(open) => {
          if (!open) {
            onBlur?.();
          }
        }}
      >
        <SelectTrigger
          id={id}
          className={cn(careersSelectTriggerClassName, error && invalidFieldClassName)}
        >
          <SelectValue placeholder={selectPlaceholder} />
        </SelectTrigger>
        <SelectContent className="z-[80]">
          <SelectItem value={CAREERS_SELECT_EMPTY_VALUE}>{selectPlaceholder}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? <FormFieldError message={error} /> : null}
    </div>
  );
};

export default CareersSelectField;
