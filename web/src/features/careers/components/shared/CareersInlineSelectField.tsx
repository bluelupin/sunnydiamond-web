"use client";

import {
  appointmentFieldClassName,
  appointmentLabelClassName,
} from "@/shared/constants/appointmentForm";
import FormFieldError from "@/shared/ui/FormFieldError";
import InlineCustomSelect from "@/shared/ui/InlineCustomSelect";
import { cn } from "@/shared/utils/cn";

type CareersInlineSelectFieldProps = {
  id: string;
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
  allowClearSelection?: boolean;
  listPlacement?: "portaled" | "inline";
};

const CareersInlineSelectField = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  options,
  error,
  placeholder = "Select",
  labelClassName = appointmentLabelClassName,
  triggerClassName = appointmentFieldClassName,
  className,
  allowClearSelection = true,
  listPlacement = "inline",
}: CareersInlineSelectFieldProps) => {
  const errorId = `${id}-error`;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <InlineCustomSelect
        id={id}
        label={label}
        value={value}
        options={options}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        labelClassName={labelClassName}
        triggerClassName={triggerClassName}
        placeholderClassName="font-normal text-gray600"
        invalid={Boolean(error)}
        errorId={error ? errorId : undefined}
        listPlacement={listPlacement}
        allowClearSelection={allowClearSelection}
      />
      {error ? <FormFieldError id={errorId} message={error} /> : null}
    </div>
  );
};

export default CareersInlineSelectField;
