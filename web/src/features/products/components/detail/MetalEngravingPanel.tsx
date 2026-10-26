"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { StaticImageData } from "next/image";
import AppStatusToast, { appStatusToastDurationMs } from "@/shared/ui/AppStatusToast";
import { appointmentFieldClassName, appointmentLabelClassName } from "@/shared/constants/appointmentForm";
import {
  ENGRAVING_CHARSET_MESSAGE,
  ENGRAVING_FONT_REQUIRED_MESSAGE,
  ENGRAVING_TEXT_PATTERN,
  ENGRAVING_TEXT_REQUIRED_MESSAGE,
  ENGRAVING_TEXT_SANITIZE_PATTERN,
  clampEngravingText,
  resolveEngravingFonts,
  type EngravingSelection,
} from "@/features/products/constants/engraving";
import FormFieldError from "@/shared/ui/FormFieldError";
import InlineCustomSelect from "@/shared/ui/InlineCustomSelect";
import { cn } from "@/shared/utils/cn";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { RIGHT_PANEL_HEADER_PADDING_CLASS } from "@/shared/ui/rightPanel";
import { RightPanelCloseButton } from "@/shared/ui/RightPanelCloseButton";
import EngravingFontStyles from "./EngravingFontStyles";
import EngravingPreviewImage from "./EngravingPreviewImage";
import { resolveEngravingFontFamilyStyle } from "@/features/products/constants/engravingFontAssets";
import { DetailDarkButton, DetailTextLink } from "./shared";
import { ProductDetailSidePanelShell } from "./ProductDetailSidePanelShell";
import { useUiPlatform } from "@/shared/hooks/use-ui-platform";

type MetalEngravingPanelProps = {
  open: boolean;
  onClose: () => void;
  previewImage?: string | StaticImageData;
  categorySlug?: string | null;
  fonts?: readonly string[];
  maxCharacters: number;
  initialValue?: EngravingSelection | null;
  onSave: (value: EngravingSelection | null) => void | Promise<void>;
};

const MetalEngravingPanel = ({
  open,
  onClose,
  previewImage,
  categorySlug,
  fonts,
  maxCharacters,
  initialValue,
  onSave,
}: MetalEngravingPanelProps) => {
  const availableFonts = useMemo(() => resolveEngravingFonts(fonts), [fonts]);
  // Fontless products save text-only engravings — "" means no font selection.
  const requiresFont = availableFonts.length > 0;
  const [text, setText] = useState("");
  const [font, setFont] = useState("");
  const [charsetError, setCharsetError] = useState(false);
  const [textRequiredError, setTextRequiredError] = useState(false);
  const [fontRequiredError, setFontRequiredError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusToastMessage, setStatusToastMessage] = useState<string | null>(null);
  const statusToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissStatusToast = useCallback(() => {
    if (statusToastTimeoutRef.current) {
      clearTimeout(statusToastTimeoutRef.current);
      statusToastTimeoutRef.current = null;
    }
    setStatusToastMessage(null);
  }, []);

  const showStatusToast = useCallback(
    (message: string) => {
      dismissStatusToast();
      setStatusToastMessage(message);
      statusToastTimeoutRef.current = setTimeout(() => {
        setStatusToastMessage(null);
        statusToastTimeoutRef.current = null;
      }, appStatusToastDurationMs);
    },
    [dismissStatusToast],
  );

  useEffect(() => {
    return () => {
      if (statusToastTimeoutRef.current) {
        clearTimeout(statusToastTimeoutRef.current);
      }
    };
  }, []);

  const wasOpenRef = useRef(false);

  useEffect(() => {
    const justOpened = open && !wasOpenRef.current;
    wasOpenRef.current = open;

    if (!justOpened) {
      return;
    }

    setText(clampEngravingText(initialValue?.text ?? "", maxCharacters));
    setFont(initialValue?.font ?? "");
    setCharsetError(false);
    setTextRequiredError(false);
    setFontRequiredError(false);
    setIsSaving(false);
  }, [open, initialValue, availableFonts, maxCharacters]);

  const handleTextChange = (value: string) => {
    // Mirror server charset validation: strip disallowed chars, flag the attempt inline.
    const isValid = ENGRAVING_TEXT_PATTERN.test(value);
    setCharsetError(!isValid);
    if (value.trim()) {
      setTextRequiredError(false);
    }
    const sanitized = isValid ? value : value.replace(ENGRAVING_TEXT_SANITIZE_PATTERN, "");
    setText(clampEngravingText(sanitized, maxCharacters));
  };

  const handleFontChange = (value: string) => {
    setFont(value);
    if (value.trim()) {
      setFontRequiredError(false);
    }
  };

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    const trimmedText = clampEngravingText(text.trim(), maxCharacters);
    const trimmedFont = font.trim();
    let hasValidationError = false;

    if (!trimmedText) {
      setTextRequiredError(true);
      hasValidationError = true;
    }

    if (requiresFont && !trimmedFont) {
      setFontRequiredError(true);
      hasValidationError = true;
    }

    if (hasValidationError) {
      return;
    }

    if (!ENGRAVING_TEXT_PATTERN.test(text)) {
      setCharsetError(true);
      return;
    }

    const value: EngravingSelection = { text: trimmedText, font: trimmedFont };

    setIsSaving(true);

    try {
      await Promise.resolve(onSave(value));
    } catch {
      return;
    } finally {
      setIsSaving(false);
    }

    showStatusToast("Engraving saved");
    onClose();
  };

  const isSaveDisabled =
    isSaving || !text.trim() || (requiresFont && !font.trim());

  const { windows } = useUiPlatform();
  return (
    <>
      <EngravingFontStyles />
      <ProductDetailSidePanelShell
        open={open}
        onClose={onClose}
        overlayAriaLabel="Close engraving panel"
        dialogAriaLabel="Engraving"
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto DrawerVerticleScrollbar">
            <div className={cn("flex flex-col gap-6 pb-10", RIGHT_PANEL_HEADER_PADDING_CLASS)}>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">Engraving</h2>
                  <RightPanelCloseButton onClick={onClose} aria-label="Close engraving panel" />
                </div>
                <div className="h-px w-full bg-neutral300" aria-hidden />
              </div>

              <div className="flex flex-col gap-6">
                <EngravingPreviewImage
                  previewImage={previewImage}
                  categorySlug={categorySlug}
                  text={text}
                  font={font}
                />

                <div className="flex flex-col gap-2">
                  <label htmlFor="engraving-text" className={appointmentLabelClassName}>
                    Type here* (Up to {maxCharacters} characters)
                  </label>
                  <input
                    id="engraving-text"
                    type="text"
                    value={text}
                    maxLength={maxCharacters}
                    onChange={(event) => handleTextChange(event.target.value)}
                    placeholder="Enter"
                    aria-invalid={charsetError || textRequiredError || undefined}
                    aria-describedby={
                      charsetError || textRequiredError ? "engraving-text-error" : undefined
                    }
                    className={appointmentFieldClassName}
                  />
                  <FormFieldError
                    id="engraving-text-error"
                    message={
                      charsetError
                        ? ENGRAVING_CHARSET_MESSAGE
                        : textRequiredError
                          ? ENGRAVING_TEXT_REQUIRED_MESSAGE
                          : undefined
                    }
                  />
                </div>

                {requiresFont ? (
                  <div className="flex flex-col gap-2">
                    <p className="font-gill text-base leading-normal tracking-normal text-darkblack">Font*</p>
                    <InlineCustomSelect
                      id="engraving-font"
                      label="Font*"
                      labelClassName="sr-only"
                      value={font}
                      onChange={handleFontChange}
                      options={availableFonts}
                      placeholder="Select"
                      invalid={fontRequiredError}
                      errorId="engraving-font-error"
                      triggerClassName="rounded-none border-0 bg-aboutInactive px-3 text-base text-darkblack"
                      placeholderClassName="font-normal text-gray600"
                      listClassName="bg-aboutInactive"
                      optionClassName="text-base"
                      getOptionStyle={resolveEngravingFontFamilyStyle}
                    />
                    <FormFieldError
                      id="engraving-font-error"
                      message={fontRequiredError ? ENGRAVING_FONT_REQUIRED_MESSAGE : undefined}
                    />
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(!windows && "-translate-y-[2px]", "shrink-0 text-darkblack")}>
                      <path d="M9.375 9.375C9.54076 9.375 9.69973 9.44085 9.81694 9.55806C9.93415 9.67527 10 9.83424 10 10V13.125C10 13.2908 10.0658 13.4497 10.1831 13.5669C10.3003 13.6842 10.4592 13.75 10.625 13.75" stroke="#0A0A0A" strokeWidth="0.9375" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9.6875 7.34375C10.119 7.34375 10.4688 6.99397 10.4688 6.5625C10.4688 6.13103 10.119 5.78125 9.6875 5.78125C9.25603 5.78125 8.90625 6.13103 8.90625 6.5625C8.90625 6.99397 9.25603 7.34375 9.6875 7.34375Z" fill="#0A0A0A" />
                      <path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z" stroke="#0A0A0A" strokeWidth="0.9375" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="font-gill text-base font-light leading-110 text-darkblack">
                      For more options or special requests,
                    </p>
                  </div>
                  <DetailTextLink href="/contact">
                    Contact Our Team
                  </DetailTextLink>
                </div>
              </div>
            </div>
          </div>

          <PanelFooter contentClassName="flex flex-col items-center gap-4">
            <DetailDarkButton
              onClick={handleSave}
              disabled={isSaveDisabled}
              className="w-full uppercase disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Saving.." : "Save"}
            </DetailDarkButton>
          </PanelFooter>
        </div>
      </ProductDetailSidePanelShell>
      <AppStatusToast open={Boolean(statusToastMessage)} message={statusToastMessage ?? ""} />
    </>
  );
};

export default MetalEngravingPanel;
