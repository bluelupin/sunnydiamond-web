"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useToast } from "@/shared/hooks/use-toast";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useCustomerProfileContact } from "@/shared/hooks/use-customer-profile-contact";
import AppointmentGenericFields from "./AppointmentGenericFields";
import { appointmentFieldKey, appointmentFieldKind, appointmentFormErrors, appointmentSubmission } from "../utils/appointmentGenericForm";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { RIGHT_PANEL_HEADER_PADDING_CLASS } from "@/shared/ui/rightPanel";
import { RightPanelCloseButton } from "@/shared/ui/RightPanelCloseButton";
import { ProductDetailSidePanelShell } from "@/features/products/components/detail/ProductDetailSidePanelShell";
import { fetchGenericFormByTag, createGenericSubmission } from "@/services/forms/generic-form.service";
import type { NormalizedGenericForm } from "@/services/forms/generic-form.types";

const APPOINTMENT_FORM_TAG = "book-an-appointment";

type BookAnAppointmentPanelProps = {
  variant?: "embedded" | "page" | "modal";
  open?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  showBack?: boolean;
  showClose?: boolean;
};

const BookAnAppointmentPanel = ({
  variant = "embedded",
  open = true,
  onBack,
  onClose,
  showBack = true,
  showClose = true,
}: BookAnAppointmentPanelProps) => {
  const { toast } = useToast();
  const { status } = useAuth();
  const panelActive = variant !== "modal" || open;
  const { contact: profileContact } = useCustomerProfileContact(panelActive && status === "authenticated");
  const appliedProfileRef = useRef(false);
  const editedFieldsRef = useRef(new Set<string>());
  const [prefillResetCount, setPrefillResetCount] = useState(0);
  const [cmsForm, setCmsForm] = useState<NormalizedGenericForm | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [countryCodes, setCountryCodes] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [loadError, setLoadError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [now, setNow] = useState(() => new Date());
  const errors = cmsForm ? appointmentFormErrors(cmsForm, values, countryCodes, now) : {};

  useEffect(() => {
    if (!panelActive) {
      appliedProfileRef.current = false;
      return;
    }
    if (status !== "authenticated" || !cmsForm || !profileContact || appliedProfileRef.current) return;
    appliedProfileRef.current = true;
    const defaults: Record<string, string> = {};
    const phoneCodes: Record<string, string> = {};
    cmsForm.fields.forEach((field, index) => {
      const key = appointmentFieldKey(field, index);
      if (editedFieldsRef.current.has(key)) return;
      const kind = appointmentFieldKind(field);
      const value = kind === "name" ? profileContact.fullName : kind === "email" ? profileContact.email : kind === "phone" ? profileContact.phone : undefined;
      if (value?.trim()) defaults[key] = value.trim();
      if (kind === "phone" && value?.trim() && profileContact.countryCode?.trim()) phoneCodes[key] = profileContact.countryCode.trim();
    });
    setValues((current) => {
      const updated = { ...current };
      Object.entries(defaults).forEach(([key, value]) => {
        if (!current[key]?.trim()) updated[key] = value;
      });
      return updated;
    });
    setCountryCodes((current) => ({ ...phoneCodes, ...current }));
  }, [panelActive, status, cmsForm, profileContact, prefillResetCount]);

  useEffect(() => {
    if (!panelActive) {
      return;
    }

    const controller = new AbortController();

    void (async () => {
      try {
        const form = await fetchGenericFormByTag(APPOINTMENT_FORM_TAG, controller.signal);
        if (controller.signal.aborted) return;
        if (!form || !form.fields.length) throw new Error("Appointment form is unavailable. Please try again.");
        setCmsForm(form);
        setLoadError("");
      } catch {
        if (!controller.signal.aborted) setLoadError("Unable to load the appointment form. Please try again.");
      }
    })();

    return () => controller.abort();
  }, [panelActive, loadAttempt]);

  useEffect(() => {
    if (!panelActive) return;
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, [panelActive]);

  const handleClear = () => {
    appliedProfileRef.current = true;
    cmsForm?.fields.forEach((field, index) => editedFieldsRef.current.add(appointmentFieldKey(field, index)));
    setValues({});
    setCountryCodes({});
    setSubmitted(false);
    setTouched({});
  };

  const handleSubmit = async () => {
    if (!cmsForm || loadError || submittingRef.current) return;
    setSubmitted(true);
    setNow(new Date());
    if (Object.keys(appointmentFormErrors(cmsForm, values, countryCodes)).length) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      await createGenericSubmission(appointmentSubmission(cmsForm, values, countryCodes, window.location.pathname));
      toast({
        title: "Appointment requested",
        description: "Our representative will get in touch with you soon.",
      });
      // A successful submission starts a fresh form with the customer's profile details.
      // Clear All intentionally suppresses autofill, so use a separate reset here.
      editedFieldsRef.current.clear();
      appliedProfileRef.current = false;
      setValues({});
      setCountryCodes({});
      setSubmitted(false);
      setTouched({});
      setPrefillResetCount((count) => count + 1);
      onClose?.();
    } catch (error) {
      toast({ title: "Unable to request appointment", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  if (variant === "modal" && !open) {
    return null;
  }

  const formContent = (
    <form className="contents" noValidate onSubmit={(event) => { event.preventDefault(); void handleSubmit(); }}>
      <div className="min-h-0 flex-1 overflow-y-auto DrawerVerticleScrollbar">
        <div
          className={cn(
            variant === "page"
              ? "mx-auto w-full max-w-[480px] px-4 pt-8 lg:px-8 lg:pt-10"
              : RIGHT_PANEL_HEADER_PADDING_CLASS,
          )}
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-2">
                {showBack ? (
                  <button
                    type="button"
                    onClick={onBack ?? onClose}
                    aria-label="Go back"
                    className="inline-flex size-6 shrink-0 items-center justify-center"
                  >
                    <ChevronLeft size={24} strokeWidth={1.25} aria-hidden className="text-darkblack" />
                  </button>
                ) : null}
                <h1 className="font-larken text-2xl font-light leading-110 text-darkblack">
                  {cmsForm?.formName ?? "Book an Appointment"}
                </h1>
              </div>
              {showClose ? (
                <RightPanelCloseButton
                  onClick={() => onClose?.()}
                  aria-label="Close"
                />
              ) : null}
            </div>
            <div className="h-px w-full bg-neutral300" aria-hidden />
          </div>

          <div className="mt-[22px] flex flex-col gap-6 pb-72">
            {loadError ? (
              <div role="alert" className="font-gill text-sm">
                <p>{loadError}</p>
                <button type="button" className="mt-3 underline" onClick={() => { setLoadError(""); setCmsForm(null); setLoadAttempt((attempt) => attempt + 1); }}>Try again</button>
              </div>
            ) : !cmsForm ? <p role="status" className="font-gill text-sm">Loading appointment form...</p> : (
              <AppointmentGenericFields form={cmsForm} values={values} codes={countryCodes}
                errors={Object.fromEntries(Object.entries(errors).filter(([key]) => submitted || touched[key]))}
                disabled={isSubmitting} now={now}
                onBlur={(key) => setTouched((current) => ({ ...current, [key]: true }))}
                onCodeChange={(key, code) => {
                  editedFieldsRef.current.add(key);
                  setCountryCodes((current) => ({ ...current, [key]: code }));
                }}
                onChange={(key, value) => {
                  editedFieldsRef.current.add(key);
                  setValues((current) => {
                  const updated = { ...current, [key]: value };
                  const field = cmsForm.fields.find((item, index) => appointmentFieldKey(item, index) === key);
                  if (field && appointmentFieldKind(field) === "date") cmsForm.fields.forEach((item, index) => {
                    if (appointmentFieldKind(item) === "slot") updated[appointmentFieldKey(item, index)] = "";
                  });
                  return updated;
                  });
                }}
              />
            )}
          </div>
        </div>
      </div>

      <PanelFooter
        contentClassName={cn(
          "flex flex-col items-center gap-4",
          variant === "page" && "mx-auto w-full max-w-[480px]",
        )}
      >
        <p className="text-center font-gill text-sm font-light leading-normal tracking-[0.252px] text-neutral500">
          Our representative will get in touch with you soon
        </p>
        <div className="flex w-full flex-col items-center gap-4 md:flex-row md:items-stretch md:gap-6">
          <button
            type="button"
            onClick={handleClear}
            disabled={isSubmitting}
            className="btn-border-slide order-2 flex h-14 w-full min-w-0 items-center justify-center border border-neutral300 px-7 py-5 font-gill text-sm font-normal uppercase leading-110 text-darkblack md:order-1 md:flex-1 md:whitespace-nowrap"
          >
            Clear All
          </button>
          <button
            type="submit"
            disabled={!cmsForm || Boolean(loadError) || isSubmitting}
            className="order-1 flex h-14 w-full max-w-[343px] min-w-0 items-center justify-center bg-darkblack px-7 py-5 font-gill text-sm font-normal uppercase leading-110 text-white disabled:cursor-not-allowed disabled:opacity-50 md:order-2 md:max-w-none md:flex-[1.35] md:whitespace-nowrap"
          >
            Book an Appointment
          </button>
        </div>
      </PanelFooter>
    </form>
  );

  if (variant === "embedded") {
    return (
      <div
        className="absolute inset-0 flex flex-col bg-white"
        role="dialog"
        aria-modal="true"
        aria-label="Book an appointment"
      >
        {formContent}
      </div>
    );
  }

  if (variant === "page") {
    return (
      <div className="flex min-h-[calc(100vh-64px)] flex-col bg-white pb-8">
        {formContent}
      </div>
    );
  }

  return (
    <ProductDetailSidePanelShell
      open={open}
      onClose={onClose ?? (() => undefined)}
      overlayAriaLabel="Close book an appointment"
      dialogAriaLabel="Book an appointment"
      overlayClassName="bg-[rgba(0,0,0,0.3)] backdrop-blur-[9px]"
    >
      {formContent}
    </ProductDetailSidePanelShell>
  );
};

export default BookAnAppointmentPanel;
