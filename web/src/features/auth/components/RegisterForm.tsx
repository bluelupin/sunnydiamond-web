"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FormFieldError from "@/shared/ui/FormFieldError";
import { FormInput } from "@/shared/ui/FormInput";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { runPostLoginSync } from "../services/postLoginSync";

type RegisterFormValues = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterForm = ({ nextUrl }: { nextUrl: string }) => {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>();

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: values.firstname,
          lastname: values.lastname,
          email: values.email,
          password: values.password,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; loggedIn?: boolean; error?: string }
        | null;

      if (!response.ok || !data?.ok) {
        toast.error(data?.error ?? "Registration failed. Please try again.");
        setSubmitting(false);
        return;
      }

      if (data.loggedIn) {
        await runPostLoginSync();
        window.location.assign(nextUrl);
        return;
      }

      toast.success("Account created. Please sign in.");
      window.location.assign(`/login?next=${encodeURIComponent(nextUrl)}`);
    } catch {
      toast.error("Registration failed. Please try again.");
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4" noValidate>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="w-full">
          <FormInput
            label="First name"
            autoComplete="given-name"
            {...register("firstname", { required: "First name is required" })}
          />
          <FormFieldError message={errors.firstname?.message} className="mt-1.5 text-xs" />
        </div>
        <div className="w-full">
          <FormInput
            label="Last name"
            autoComplete="family-name"
            {...register("lastname", { required: "Last name is required" })}
          />
          <FormFieldError message={errors.lastname?.message} className="mt-1.5 text-xs" />
        </div>
      </div>

      <div>
        <FormInput
          label="Email"
          type="email"
          autoComplete="email"
          {...register("email", { required: "Email is required" })}
        />
        <FormFieldError message={errors.email?.message} className="mt-1.5 text-xs" />
      </div>

      <div>
        <FormInput
          label="Password"
          type="password"
          autoComplete="new-password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Password must be at least 8 characters" },
          })}
        />
        <FormFieldError message={errors.password?.message} className="mt-1.5 text-xs" />
      </div>

      <div>
        <FormInput
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === watch("password") || "Passwords do not match",
          })}
        />
        <FormFieldError message={errors.confirmPassword?.message} className="mt-1.5 text-xs" />
      </div>

      <PrimaryButton type="submit" disabled={submitting} className="mt-2 w-full">
        {submitting ? "Creating account…" : "Create account"}
      </PrimaryButton>
    </form>
  );
};

export default RegisterForm;
