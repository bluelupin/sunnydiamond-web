import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, label, placeholder, ...props }, ref) => {
    const generatedId = useId();
    const inputId = props.id || generatedId;

    return (
      <div className="w-full">
        {label ? (
          <label htmlFor={inputId} className="block font-body text-xs tracking-widest uppercase text-muted-foreground mb-1.5">
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          placeholder={placeholder}
          aria-label={!label ? placeholder : undefined}
          className={cn(
            "w-full border border-input bg-background px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, label, placeholder, ...props }, ref) => {
    const generatedId = useId();
    const inputId = props.id || generatedId;

    return (
      <div className="w-full">
        {label ? (
          <label htmlFor={inputId} className="block font-body text-xs tracking-widest uppercase text-muted-foreground mb-1.5">
            {label}
          </label>
        ) : null}
        <textarea
          ref={ref}
          id={inputId}
          placeholder={placeholder}
          aria-label={!label ? placeholder : undefined}
          className={cn(
            "w-full border border-input bg-background px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
FormTextarea.displayName = "FormTextarea";

export { FormInput, FormTextarea };
