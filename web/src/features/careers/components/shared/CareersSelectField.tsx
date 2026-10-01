"use client";

import { useId, useState } from "react";
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
  triggerClassName?: string;
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
  triggerClassName,
  className,
}: CareersSelectFieldProps) => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const [open, setOpen] = useState(false);
  const selectPlaceholder = placeholder.trim() || "Select";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={fieldId}
        className={labelClassName}
        onClick={(event) => {
          event.preventDefault();
          setOpen(true);
        }}
      >
        {label}
      </label>
      <Select
        open={open}
        value={value || CAREERS_SELECT_EMPTY_VALUE}
        onValueChange={(next) => {
          onChange(next === CAREERS_SELECT_EMPTY_VALUE ? "" : next);
          onBlur?.();
        }}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) {
            onBlur?.();
          }
        }}
      >
        <SelectTrigger
          id={fieldId}
          className={cn(
            careersSelectTriggerClassName,
            (!value || value === CAREERS_SELECT_EMPTY_VALUE) &&
              "text-gray600 [&>span]:text-gray600",
            error && invalidFieldClassName,
            triggerClassName,
          )}
        >
          <SelectValue placeholder={selectPlaceholder} />
        </SelectTrigger>
        <SelectContent
          position="popper"
          collisionPadding={12}
          data-vaul-no-drag
          className="z-[90] flex max-h-[min(24rem,var(--radix-select-content-available-height))] flex-col [&>[data-radix-select-viewport]]:min-h-0 [&>[data-radix-select-viewport]]:overscroll-contain [&>[data-radix-select-viewport]]:touch-pan-y"
        >
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
