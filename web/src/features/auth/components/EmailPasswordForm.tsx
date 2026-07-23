"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FormFieldError from "@/shared/ui/FormFieldError";
import { FormInput } from "@/shared/ui/FormInput";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { runPostLoginSync } from "../services/postLoginSync";

type LoginFormValues = {
  email: string;
  password: string;
};

const EmailPasswordForm = ({ nextUrl }: { nextUrl: string }) => {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        toast.error(data?.error ?? "Sign-in failed. Please try again.");
        setSubmitting(false);
        return;
      }

      await runPostLoginSync();
      // Full navigation so all providers reboot with the authenticated session.
      window.location.assign(nextUrl);
    } catch {
      toast.error("Sign-in failed. Please try again.");
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4" noValidate>
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
          autoComplete="current-password"
          {...register("password", { required: "Password is required" })}
        />
        <FormFieldError message={errors.password?.message} className="mt-1.5 text-xs" />
      </div>

      <PrimaryButton type="submit" disabled={submitting} className="mt-2 w-full">
        {submitting ? "Signing in…" : "Sign in"}
      </PrimaryButton>
    </form>
  );
};

export default EmailPasswordForm;
