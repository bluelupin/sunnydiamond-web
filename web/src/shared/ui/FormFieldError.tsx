import { cn } from "@/shared/utils/cn";
import { formFieldErrorClassName } from "@/shared/utils/formValidation";

type FormFieldErrorProps = {
  id?: string;
  message?: string;
  className?: string;
};

const FormFieldError = ({ id, message, className }: FormFieldErrorProps) => {
  if (!message) {
    return null;
  }

  return (
    <p id={id} role="alert" className={cn(formFieldErrorClassName, className)}>
      {message}
    </p>
  );
};

export default FormFieldError;
