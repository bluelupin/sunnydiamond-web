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
import { cn } from "@/shared/utils/cn";
import { invalidFieldClassName } from "@/shared/utils/formValidation";

/** Radix Select does not allow empty string values. */
const SELECT_EMPTY_VALUE = "__overlay_select_empty__";

const defaultTriggerClassName =
  "h-14 rounded-none border-0 bg-[#F2F2F2] px-3 font-gill text-base text-darkblack focus:ring-0";

type OverlaySelectFieldProps = {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: readonly string[];
  placeholder?: string;
  labelClassName?: string;
  triggerClassName?: string;
  invalid?: boolean;
  errorId?: string;
  error?: string;
};

const OverlaySelectField = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  options,
  placeholder = "-select-",
  labelClassName,
  triggerClassName,
  invalid = false,
  errorId,
  error,
}: OverlaySelectFieldProps) => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const [open, setOpen] = useState(false);
  const selectPlaceholder = placeholder.trim() || "Select";

  return (
    <div className="flex flex-col gap-2">
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
        value={value || SELECT_EMPTY_VALUE}
        onValueChange={(next) => {
          onChange(next === SELECT_EMPTY_VALUE ? "" : next);
          onBlur?.();
        }}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            onBlur?.();
          }
        }}
      >
        <SelectTrigger
          id={fieldId}
          aria-invalid={invalid || undefined}
          aria-describedby={errorId}
          className={cn(
            defaultTriggerClassName,
            !value && "text-gray600 [&>span]:text-gray600",
            invalid && invalidFieldClassName,
            triggerClassName,
          )}
        >
          <SelectValue placeholder={selectPlaceholder} />
        </SelectTrigger>
        <SelectContent
          position="popper"
          side="top"
          sideOffset={4}
          collisionPadding={16}
          data-vaul-no-drag
          className="z-[90] max-h-none overflow-visible rounded-none border-0 bg-[#F2F2F2] p-0 shadow-[0_8px_24px_rgba(0,0,0,0.12)] [&>[data-radix-select-viewport]]:max-h-[min(16rem,var(--radix-select-content-available-height))] [&>[data-radix-select-viewport]]:overflow-y-auto [&>[data-radix-select-viewport]]:overscroll-contain [&>[data-radix-select-viewport]]:p-0 [&>[data-radix-select-viewport]]:touch-pan-y"
        >
          <SelectItem value={SELECT_EMPTY_VALUE}>{selectPlaceholder}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? <FormFieldError id={errorId} message={error} /> : null}
    </div>
  );
};

export default OverlaySelectField;
