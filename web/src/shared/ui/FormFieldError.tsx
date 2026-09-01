import { forwardRef, type HTMLAttributes } from "react";
import FormFieldErrorIcon from "@/assets/Icons/FormFieldErrorIcon";
import { cn } from "@/shared/utils/cn";
import { formFieldErrorClassName } from "@/shared/utils/formValidation";

type FormFieldErrorProps = HTMLAttributes<HTMLDivElement> & {
  message?: string;
};

/** Figma 2556:26733 — error message row with icon */
const FormFieldError = forwardRef<HTMLDivElement, FormFieldErrorProps>(
  ({ id, message, className, ...props }, ref) => {
    if (!message) {
      return null;
    }

    return (
      <div
        ref={ref}
        id={id}
        role="alert"
        className={cn("flex items-center gap-2 text-[#F91616]", className)}
        {...props}
      >
        <span className="inline-flex h-[calc(0.875rem*1.1)] shrink-0 items-center">
          <FormFieldErrorIcon className="size-4 shrink-0" />
        </span>
        <p className={cn(formFieldErrorClassName, "min-w-0 translate-y-0.5")}>{message}</p>
      </div>
    );
  },
);

FormFieldError.displayName = "FormFieldError";

export default FormFieldError;
