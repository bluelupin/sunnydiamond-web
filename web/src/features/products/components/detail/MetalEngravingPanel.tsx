"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { Info } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/shared/hooks/use-toast";
import { appointmentFieldClassName, appointmentLabelClassName } from "@/shared/constants/appointmentForm";
import { ENGRAVING_FONTS, type EngravingSelection } from "@/features/products/constants/engraving";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { ProductDetailSidePanelShell } from "./ProductDetailSidePanelShell";

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

  return (
    <ProductDetailSidePanelShell
      open={open}
      onClose={onClose}
      overlayAriaLabel="Close engraving panel"
      dialogAriaLabel="Engraving"
    >
      <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 px-4 pt-6 lg:px-6 lg:pt-10">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">Engraving</h2>
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

            <div className="h-214 w-full overflow-hidden bg-aboutInactive">
              <Image
                src={previewImage}
                alt="Engraving preview"
                width={480}
                height={214}
                className="h-full w-full object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 480px"
              />
            </div>

            <div className="flex flex-col gap-6 pb-72">
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
                <Select value={font} onValueChange={setFont}>
                  <SelectTrigger
                    id="engraving-font"
                    className="h-14 rounded-none border-0 bg-aboutInactive px-3 font-gill text-base text-darkblack focus:ring-0"
                  >
                    <SelectValue placeholder="-select-" />
                  </SelectTrigger>
                  <SelectContent className="z-[80]">
                    {ENGRAVING_FONTS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  className="text-link-underline inline-flex w-fit border-b-[1.5px] border-darkblack pb-1 font-gill text-sm leading-110 text-darkblack"
                >
                  Contact Our Team
                </Link>
              </div>
            </div>
          </div>
        </div>

        <PanelFooter>
          <button
            type="button"
            onClick={handleSave}
            disabled={!font.trim()}
            className="border border-darkblack btn-dark-slide inline-flex h-14 w-full items-center justify-center px-7 font-gill text-sm uppercase leading-110 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save
          </button>
        </PanelFooter>
      </div>
    </ProductDetailSidePanelShell>
  );
};

export default MetalEngravingPanel;
