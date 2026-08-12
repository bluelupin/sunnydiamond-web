"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { Info } from "lucide-react";
import Link from "next/link";
import AppStatusToast, { appStatusToastDurationMs } from "@/shared/ui/AppStatusToast";
import { appointmentFieldClassName, appointmentLabelClassName } from "@/shared/constants/appointmentForm";
import { resolveEngravingFonts, clampEngravingText, type EngravingSelection } from "@/features/products/constants/engraving";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import EngravingPreviewImage from "./EngravingPreviewImage";
import { DetailDarkButton } from "./shared";
import { ProductDetailSidePanelShell } from "./ProductDetailSidePanelShell";

type MetalEngravingPanelProps = {
  open: boolean;
  onClose: () => void;
  previewImage?: string | StaticImageData;
  productImage?: string | StaticImageData;
  fonts?: readonly string[];
  maxCharacters: number;
  initialValue?: EngravingSelection | null;
  onSave: (value: EngravingSelection | null) => void;
};

const MetalEngravingPanel = ({
  open,
  onClose,
  previewImage,
  productImage,
  fonts,
  maxCharacters,
  initialValue,
  onSave,
}: MetalEngravingPanelProps) => {
  const availableFonts = useMemo(() => resolveEngravingFonts(fonts), [fonts]);
  const [text, setText] = useState("");
  const [font, setFont] = useState<string>(availableFonts[0]);
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

  useEffect(() => {
    if (!open) return;

    setText(clampEngravingText(initialValue?.text ?? "", maxCharacters));
    setFont(initialValue?.font ?? availableFonts[0]);
  }, [open, initialValue, availableFonts, maxCharacters]);

  const handleTextChange = (value: string) => {
    setText(clampEngravingText(value, maxCharacters));
  };

  const handleSave = () => {
    if (!font.trim()) {
      return;
    }

    const trimmedText = clampEngravingText(text.trim(), maxCharacters);
    const value = trimmedText ? { text: trimmedText, font } : null;
    onSave(value);
    showStatusToast(value ? "Engraving saved" : "Engraving removed");
    onClose();
  };

  return (
    <>
      <ProductDetailSidePanelShell
        open={open}
        onClose={onClose}
        overlayAriaLabel="Close engraving panel"
        dialogAriaLabel="Engraving"
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-6 px-6 pt-10">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">Engraving</h2>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close engraving panel"
                    className="inline-flex size-6 shrink-0 items-center justify-center"
                  >
                    <Image
                      src="/icons/menu-close.svg"
                      alt=""
                      width={24}
                      height={24}
                      aria-hidden
                    />
                  </button>
                </div>
                <div className="h-px w-full bg-neutral300" aria-hidden />
              </div>

              <div className="flex flex-col gap-6">
                <EngravingPreviewImage
                  previewImage={previewImage}
                  productImage={productImage}
                  text={text}
                  font={font}
                />

                <div className="flex flex-col gap-2">
                  <label htmlFor="engraving-text" className={appointmentLabelClassName}>
                    Type here (Up to {maxCharacters} characters)
                  </label>
                  <input
                    id="engraving-text"
                    type="text"
                    value={text}
                    maxLength={maxCharacters}
                    onChange={(event) => handleTextChange(event.target.value)}
                    placeholder="Enter"
                    className={appointmentFieldClassName}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="engraving-font" className={appointmentLabelClassName}>
                    Font*
                  </label>
                  <Select value={font} onValueChange={setFont}>
                    <SelectTrigger
                      id="engraving-font"
                      className="h-14 rounded-none border-0 bg-aboutInactive px-3 font-gill text-base text-darkblack focus:ring-0"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="z-[80]">
                      {availableFonts.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Info size={20} strokeWidth={1.25} aria-hidden className="shrink-0 text-darkblack" />
                    <p className="font-gill text-base font-light leading-110 text-darkblack">
                      For more options or special requests,
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="text-link-underline inline-flex border-b border-darkblack pb-1 font-gill text-sm uppercase leading-110 text-darkblack"
                  >
                    Contact Our Team
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <PanelFooter contentClassName="flex flex-col items-center gap-4">
            <p className="text-center font-gill text-sm font-light leading-normal tracking-normal text-neutral500">
              Our representative will get in touch with you soon
            </p>
            <DetailDarkButton
              onClick={handleSave}
              disabled={!font.trim()}
              className="w-full uppercase disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save
            </DetailDarkButton>
          </PanelFooter>
        </div>
      </ProductDetailSidePanelShell>
      <AppStatusToast open={Boolean(statusToastMessage)} message={statusToastMessage ?? ""} />
    </>
  );
};

export default MetalEngravingPanel;
