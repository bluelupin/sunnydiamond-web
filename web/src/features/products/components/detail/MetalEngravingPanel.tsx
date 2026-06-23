"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { ChevronDown, Info } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import { useToast } from "@/shared/hooks/use-toast";
import { appointmentFieldClassName, appointmentLabelClassName } from "@/shared/constants/appointmentForm";
import { ENGRAVING_FONTS, type EngravingSelection } from "@/features/products/constants/engraving";

type MetalEngravingPanelProps = {
  open: boolean;
  onClose: () => void;
  previewImage: string | StaticImageData;
  initialValue?: EngravingSelection | null;
  onSave: (value: EngravingSelection | null) => void;
};

const MetalEngravingPanel = ({
  open,
  onClose,
  previewImage,
  initialValue,
  onSave,
}: MetalEngravingPanelProps) => {
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [font, setFont] = useState<string>(ENGRAVING_FONTS[0]);

  useEffect(() => {
    if (!open) return;

    setText(initialValue?.text ?? "");
    setFont(initialValue?.font ?? ENGRAVING_FONTS[0]);
  }, [open, initialValue]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const handleSave = () => {
    if (!font.trim()) {
      return;
    }

    const value = text.trim() ? { text: text.trim(), font } : null;
    onSave(value);
    toast({
      title: value ? "Engraving saved" : "Engraving removed",
      description: value
        ? "Your engraving preferences have been added to this product."
        : "No engraving will be applied to this product.",
    });
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close engraving panel"
        className="absolute inset-0 bg-[#1E1E1E]/25 backdrop-blur-[10px] animate-in fade-in duration-300"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Engraving"
        className={cn(
          "absolute flex flex-col bg-white shadow-2xl",
          "inset-x-0 bottom-0 top-12 max-lg:animate-in max-lg:slide-in-from-bottom max-lg:duration-300",
          "lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:top-0 lg:w-full lg:max-w-[480px] lg:animate-in lg:slide-in-from-right lg:duration-300",
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="flex flex-col gap-6 px-4 pt-6 lg:px-8 lg:pt-8">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-larken text-24 font-light leading-110 text-darkblack">Engraving</h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close engraving panel"
                  className="inline-flex size-8 shrink-0 items-center justify-center"
                >
                  <Image
                    src="/images/navigation/menu-close.svg"
                    alt=""
                    width={24}
                    height={24}
                    aria-hidden
                  />
                </button>
              </div>
              <div className="h-px w-full bg-neutral300" aria-hidden />
            </div>

            <div className="relative h-[214px] w-full overflow-hidden bg-[#F2F2F2]">
              <Image
                src={previewImage}
                alt="Engraving preview"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 480px"
              />
            </div>

            <div className="flex flex-col gap-6 pb-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="engraving-text" className={appointmentLabelClassName}>
                  What do you want engraved?
                </label>
                <input
                  id="engraving-text"
                  type="text"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="Diya Gupta"
                  className={appointmentFieldClassName}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="engraving-font" className={appointmentLabelClassName}>
                  Font*
                </label>
                <div className="relative flex h-14 w-full items-center bg-[#F2F2F2] px-3">
                  <select
                    id="engraving-font"
                    value={font}
                    onChange={(event) => setFont(event.target.value)}
                    className="min-w-0 flex-1 appearance-none bg-transparent font-gill text-base leading-110 text-darkblack outline-none"
                  >
                    {ENGRAVING_FONTS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    strokeWidth={1.5}
                    aria-hidden
                    className="pointer-events-none shrink-0 text-darkblack"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <Info size={24} strokeWidth={1.25} aria-hidden className="shrink-0 text-darkblack" />
                  <p className="font-gill text-base font-light leading-110 text-darkblack">
                    For more options or special requests
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex w-fit border-b-[1.5px] border-darkblack pb-1 font-gill text-sm leading-110 text-darkblack"
                >
                  Contact Our Team
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0">
          <div className="pointer-events-none h-[71px] bg-gradient-to-b from-transparent to-white" aria-hidden />
          <div className="border-t border-neutral300/50 bg-white px-4 py-6 lg:px-8">
            <button
              type="button"
              onClick={handleSave}
              disabled={!font.trim()}
              className="btn-slide-up inline-flex h-14 w-full items-center justify-center bg-darkblack px-7 font-gill text-sm uppercase leading-110 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default MetalEngravingPanel;
