"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FormFieldError from "@/shared/ui/FormFieldError";
import { FormInput } from "@/shared/ui/FormInput";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { runPostLoginSync } from "../services/postLoginSync";

type Step = "phone" | "otp" | "details";

type PhoneValues = { phone: string };
type DetailsValues = { firstname: string; lastname: string; email: string };

const INDIAN_PHONE_PATTERN = /^(\+91|91|0)?[6-9]\d{9}$/;

const PhoneOtpForm = ({ nextUrl }: { nextUrl: string }) => {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  const phoneForm = useForm<PhoneValues>();
  const detailsForm = useForm<DetailsValues>();

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setInterval(() => setResendIn((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [resendIn]);

  const requestOtp = async (targetPhone: string): Promise<boolean> => {
    const response = await fetch("/api/auth/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: targetPhone }),
    });
    const data = (await response.json().catch(() => null)) as
      | { ok?: boolean; resendAfterSeconds?: number; error?: string }
      | null;

    if (!response.ok || !data?.ok) {
      toast.error(data?.error ?? "Could not send OTP. Please try again.");
      return false;
    }

    setResendIn(data.resendAfterSeconds ?? 60);
    return true;
  };

  const finishLogin = async () => {
    await runPostLoginSync();
    window.location.assign(nextUrl);
  };

  const verifyOtp = async (details?: DetailsValues) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          otp,
          ...(details
            ? {
                email: details.email,
                firstName: details.firstname,
                lastName: details.lastname,
              }
            : {}),
        }),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; registrationRequired?: boolean; error?: string }
        | null;

      if (!response.ok || !data?.ok) {
        toast.error(data?.error ?? "OTP verification failed.");
        setSubmitting(false);
        return;
      }

      if (data.registrationRequired) {
        setStep("details");
        setSubmitting(false);
        return;
      }

      await finishLogin();
    } catch {
      toast.error("OTP verification failed.");
      setSubmitting(false);
    }
  };

  const onPhoneSubmit = phoneForm.handleSubmit(async ({ phone: rawPhone }) => {
    const trimmed = rawPhone.replace(/[\s-]/g, "");
    setSubmitting(true);
    try {
      if (await requestOtp(trimmed)) {
        setPhone(trimmed);
        setOtp("");
        setStep("otp");
      }
    } finally {
      setSubmitting(false);
    }
  });

  if (step === "phone") {
    return (
      <form onSubmit={onPhoneSubmit} className="flex w-full flex-col gap-4" noValidate>
        <div>
          <FormInput
            label="Mobile number"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="10-digit mobile number"
            {...phoneForm.register("phone", {
              required: "Mobile number is required",
              pattern: {
                value: INDIAN_PHONE_PATTERN,
                message: "Enter a valid Indian mobile number",
              },
            })}
          />
          <FormFieldError
            message={phoneForm.formState.errors.phone?.message}
            className="mt-1.5 text-xs"
          />
        </div>
        <PrimaryButton type="submit" disabled={submitting} className="w-full">
          {submitting ? "Sending OTP…" : "Continue with OTP"}
        </PrimaryButton>
      </form>
    );
  }

  if (step === "otp") {
    return (
      <div className="flex w-full flex-col items-center gap-4">
        <p className="font-body text-sm text-muted-foreground">
          Enter the 6-digit code sent to {phone}
        </p>
        <FormInput
          aria-label="One-time password"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={otp}
          onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
          className="max-w-[200px] text-center text-lg tracking-[0.5em]"
        />
        <PrimaryButton
          type="button"
          disabled={submitting || otp.length !== 6}
          onClick={() => void verifyOtp()}
          className="w-full"
        >
          {submitting ? "Verifying…" : "Verify"}
        </PrimaryButton>
        <div className="flex items-center gap-4 font-body text-xs text-muted-foreground">
          <button
            type="button"
            disabled={resendIn > 0 || submitting}
            onClick={() => void requestOtp(phone)}
            className="uppercase tracking-widest disabled:opacity-50"
          >
            {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend OTP"}
          </button>
          <button
            type="button"
            onClick={() => setStep("phone")}
            className="uppercase tracking-widest"
          >
            Change number
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={detailsForm.handleSubmit((values) => void verifyOtp(values))}
      className="flex w-full flex-col gap-4"
      noValidate
    >
      <p className="font-body text-sm text-muted-foreground">
        Almost done — tell us a little about yourself.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="w-full">
          <FormInput
            label="First name"
            autoComplete="given-name"
            {...detailsForm.register("firstname", { required: "First name is required" })}
          />
          <FormFieldError
            message={detailsForm.formState.errors.firstname?.message}
            className="mt-1.5 text-xs"
          />
        </div>
        <div className="w-full">
          <FormInput
            label="Last name"
            autoComplete="family-name"
            {...detailsForm.register("lastname", { required: "Last name is required" })}
          />
          <FormFieldError
            message={detailsForm.formState.errors.lastname?.message}
            className="mt-1.5 text-xs"
          />
        </div>
      </div>
      <div>
        <FormInput
          label="Email"
          type="email"
          autoComplete="email"
          {...detailsForm.register("email", { required: "Email is required" })}
        />
        <FormFieldError
          message={detailsForm.formState.errors.email?.message}
          className="mt-1.5 text-xs"
        />
      </div>
      <PrimaryButton type="submit" disabled={submitting} className="w-full">
        {submitting ? "Creating account…" : "Create account"}
      </PrimaryButton>
    </form>
  );
};

export default PhoneOtpForm;
