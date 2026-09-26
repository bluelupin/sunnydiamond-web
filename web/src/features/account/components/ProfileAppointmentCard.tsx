"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import RingsTabIcon from "@/assets/Icons/PLP/RingsTabIcon";
import RightArrow from "@/assets/Icons/RightArrow";
import {
  DetailDarkButton,
  DetailOutlineButton,
  DetailTextLink,
} from "@/features/products/components/detail/shared";
import { useHorizontalCarouselSwipe } from "@/features/products/hooks/useHorizontalCarouselSwipe";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { profileTabsContent } from "../data/profileContent";
import type { ProfileAppointmentUi } from "../types/profileUi.types";
import { cn } from "@/shared/utils/cn";
import { productNameDisplayClassName } from "@/shared/utils/productNameDisplay";
import { ProfileCard, ProfileInfoNote } from "./profileUi";
import { useUiPlatform } from "@/shared/hooks/use-ui-platform";

const sectionTitleClassName =
  "font-larken md:text-2xl text-xl font-light leading-110 text-darkblack";

const sectionCardClassName = "flex flex-col gap-4 bg-white p-4 lg:p-6";

/** Figma desktop: 3 tiles; mobile uses PDP-style 1-up slider. */
const PRODUCT_GALLERY_DESKTOP_VISIBLE = 3;
const PRODUCT_GALLERY_TILE_PX = 176;
const PRODUCT_GALLERY_GAP_PX = 40;

type ProfileAppointmentCardProps = {
  appointment: ProfileAppointmentUi;
  onReschedule: () => void;
  onCancel: () => void;
};

function ProductGalleryTile({
  product,
}: {
  product: ProfileAppointmentUi["products"][number];
}) {
  return (
    <div className="flex w-[176px] shrink-0 flex-col items-start gap-1.5">
      <div className="relative h-[135px] w-[176px] overflow-hidden">
        {product.imageSrc ? (
          <Image
            src={product.imageSrc}
            alt={product.name}
            fill
            className="object-contain"
            sizes="176px"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <RingsTabIcon className="size-12 text-darkblack" />
          </div>
        )}
      </div>
      <p
        className={cn(
          "max-w-full truncate font-gill text-base font-normal leading-110 tracking-[0.01em] text-darkblack",
          productNameDisplayClassName,
        )}
      >
        {product.name}
      </p>
    </div>
  );
}

function ProductGallery({ products }: { products: ProfileAppointmentUi["products"] }) {
  const isMobile = useIsMobile();
  const visibleCount = isMobile ? 1 : PRODUCT_GALLERY_DESKTOP_VISIBLE;
  const maxIndex = Math.max(0, products.length - visibleCount);
  const showSlider = products.length > visibleCount;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [products]);

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  const goToNext = useCallback(() => {
    setActiveIndex((current) => (current >= maxIndex ? 0 : current + 1));
  }, [maxIndex]);

  const goToPrevious = useCallback(() => {
    setActiveIndex((current) => (current <= 0 ? maxIndex : current - 1));
  }, [maxIndex]);

  const { swipeProps } = useHorizontalCarouselSwipe({
    slideCount: showSlider ? maxIndex + 1 : 1,
    onNext: goToNext,
    onPrevious: goToPrevious,
    enabled: showSlider,
  });

  if (products.length === 0) {
    return null;
  }

  const visibleProducts = products.slice(activeIndex, activeIndex + visibleCount);
  const viewportMaxWidth =
    PRODUCT_GALLERY_TILE_PX * visibleCount +
    PRODUCT_GALLERY_GAP_PX * Math.max(0, visibleCount - 1);

  return (
    <div className="flex w-full flex-col gap-3">
      <div
        className={cn(
          "flex w-full items-center touch-pan-y select-none",
          showSlider ? "justify-between" : "justify-center",
        )}
        {...swipeProps}
      >
        <div className={cn("flex min-w-0", showSlider ? "flex-1 justify-center" : "justify-center")}>
          <div className="flex gap-10" style={{ maxWidth: viewportMaxWidth }}>
            {visibleProducts.map((product, index) => (
              <ProductGalleryTile
                key={`${product.id}-${activeIndex + index}`}
                product={product}
              />
            ))}
          </div>
        </div>
        {showSlider ? (
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next products"
            className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack"
          >
            <RightArrow className="size-6" />
          </button>
        ) : null}
      </div>

      {showSlider && isMobile ? (
        <div className="flex h-0.5 w-full">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <div
              key={index}
              className={cn(
                "h-0.5 min-w-0 flex-1",
                index === activeIndex ? "bg-darkblack" : "bg-neutral300",
              )}
              aria-hidden
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ProfileAppointmentPersonalDetails({
  title,
  name,
  phone,
  email,
}: {
  title: string;
  name: string;
  phone: string;
  email: string;
}) {
  return (
    <div className={sectionCardClassName}>
      <h4 className={sectionTitleClassName}>{title}</h4>
      <div className="flex w-full flex-col gap-2 font-gill text-base leading-110 text-darkblack">
        <p className="font-normal">{name}</p>
        <div className="font-light sm:space-y-2 space-y-1">
          {phone ? <p>{phone}</p> : null}
          {email ? <p>{email}</p> : null}
        </div>
      </div>
    </div>
  );
}

function ProfileAppointmentNote({
  title,
  note,
  purposeOfVisit,
  yourRequirement,
  purposeLabel,
  requirementLabel,
}: {
  title: string;
  note: string;
  purposeOfVisit?: string;
  yourRequirement?: string;
  purposeLabel?: string;
  requirementLabel?: string;
}) {
  const hasStructuredNote = Boolean(purposeOfVisit || yourRequirement);

  return (
    <div className={sectionCardClassName}>
      <h4 className={sectionTitleClassName}>{title}</h4>
      {hasStructuredNote ? (
        <div className="flex flex-col gap-4 font-gill text-base leading-110 text-darkblack">
          {purposeOfVisit ? (
            <div className="flex flex-col gap-2">
              <p className="font-normal">{purposeLabel ?? "Purpose of Visit"}</p>
              <p className="font-light">{purposeOfVisit}</p>
            </div>
          ) : null}
          {yourRequirement ? (
            <div className="flex flex-col gap-2">
              <p className="font-normal">{requirementLabel ?? "Your Requirement"}</p>
              <p className="font-light whitespace-pre-line">{yourRequirement}</p>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="font-gill text-base md:font-light font-normal leading-110 whitespace-pre-line text-darkblack">
          {note}
        </p>
      )}
    </div>
  );
}

function ProfileAppointmentAddress({
  title,
  address,
}: {
  title: string;
  address: NonNullable<ProfileAppointmentUi["appointmentAddress"]>;
}) {
  const cityStatePincode = [address.city, address.state, address.pincode]
    .filter((part): part is string => Boolean(part))
    .join(", ");

  return (
    <div className={sectionCardClassName}>
      <h4 className={sectionTitleClassName}>{title}</h4>
      <div className="flex flex-col gap-1 font-gill text-base font-light leading-110 text-darkblack">
        {address.addressLine1 ? <p>{address.addressLine1}</p> : null}
        {address.addressLine2 ? <p>{address.addressLine2}</p> : null}
        {cityStatePincode ? <p>{cityStatePincode}</p> : null}
      </div>
    </div>
  );
}

function ProfileAppointmentStoreVisit({
  title,
  storeVisit,
  directionsLabel,
}: {
  title: string;
  storeVisit: NonNullable<ProfileAppointmentUi["storeVisit"]>;
  directionsLabel: string;
}) {
  return (
    <div className={sectionCardClassName}>
      <h4 className={sectionTitleClassName}>{title}</h4>

      <div className="flex flex-col gap-2 font-gill text-base leading-110 text-darkblack">
        {storeVisit.city ? <p className="font-normal">{storeVisit.city}</p> : null}
        <div className="font-light">
          {storeVisit.lines.map((line, index) => (
            <p key={`${index}-${line}`}>{line}</p>
          ))}
        </div>
      </div>

      {storeVisit.directionsHref ? (
        <DetailTextLink
          href={storeVisit.directionsHref}
          className="mt-2 text-sm uppercase"
          {...(storeVisit.directionsHref.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {directionsLabel}
        </DetailTextLink>
      ) : null}
    </div>
  );
}

function ProfileAppointmentBookingDetails({
  dateLabel,
  timeLabel,
  bookingDate,
  bookingTime,
}: {
  dateLabel: string;
  timeLabel: string;
  bookingDate: string;
  bookingTime: string;
}) {
  const content = profileTabsContent.appointments;

  return (
    <div className={sectionCardClassName}>
      <h4 className={sectionTitleClassName}>{content.bookingDetailsTitle}</h4>

      <div className="grid w-full sm:grid-cols-2 grid-cols-1 gap-4 font-gill text-base leading-110 text-darkblack">
        <div className="flex min-w-0 flex-col gap-2">
          <p className="font-normal">{dateLabel}</p>
          <p className="font-normal">{bookingDate}</p>
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <p className="font-normal">{timeLabel}</p>
          <p className="font-normal">{bookingTime}</p>
        </div>
      </div>
    </div>
  );
}

export function ProfileAppointmentCard({
  appointment,
  onReschedule,
  onCancel,
}: ProfileAppointmentCardProps) {
  const content = profileTabsContent.appointments;
  const notesText =
    typeof appointment.notes === "string"
      ? appointment.notes.trim()
      : String(appointment.notes ?? "").trim();
  const purposeOfVisit = appointment.purposeOfVisit?.trim() ?? "";
  const yourRequirement = appointment.yourRequirement?.trim() ?? notesText;
  const showNoteSection = Boolean(purposeOfVisit || yourRequirement || notesText);
  const { windows } = useUiPlatform();
  const canAddPiece =
    appointment.canCancel &&
    (appointment.type === "store_visit" || appointment.type === "video_call");
  return (
    <ProfileCard className="relative flex flex-col gap-6 !py-6 md:!px-6 px-4">
      <div className={cn("absolute left-0 top-0 bg-mauve300 px-3 py-2 font-gill text-base font-normal whitespace-nowrap text-darkblack")}>
        <span className={cn(!windows && "-translate-y-0.5")}>{appointment.typeLabel}</span>
      </div>

      {appointment.products.length > 0 ? (
        <ProductGallery products={appointment.products} />
      ) : (
        null
      )}

      {canAddPiece ? (
        <DetailTextLink href={content.addPieceHref} className="self-center">
          {content.addPieceLabel}
        </DetailTextLink>
      ) : null}

      <ProfileAppointmentPersonalDetails
        title={content.personalDetailsTitle}
        name={appointment.customerName}
        phone={appointment.customerPhone}
        email={appointment.customerEmail}
      />

      {appointment.appointmentAddress ? (
        <ProfileAppointmentAddress
          title={content.appointmentAddressTitle}
          address={appointment.appointmentAddress}
        />
      ) : null}

      {appointment.storeVisit ? (
        <ProfileAppointmentStoreVisit
          title={content.storeVisitTitle}
          storeVisit={appointment.storeVisit}
          directionsLabel={content.getDirectionsLabel}
        />
      ) : null}

      <ProfileAppointmentBookingDetails
        dateLabel={content.bookingDateLabel}
        timeLabel={content.bookingTimeLabel}
        bookingDate={appointment.bookingDate}
        bookingTime={appointment.bookingTime}
      />

      {showNoteSection ? (
        <ProfileAppointmentNote
          title={content.notesLabel}
          note={notesText}
          purposeOfVisit={
            appointment.type === "store_visit" ? purposeOfVisit || undefined : undefined
          }
          yourRequirement={
            appointment.type === "store_visit" ? yourRequirement || undefined : undefined
          }
          purposeLabel={content.purposeOfVisitLabel}
          requirementLabel={content.yourRequirementLabel}
        />
      ) : null}

      <div className="flex flex-col gap-4">
        <div
          className={cn(
            "grid gap-4 md:gap-6",
            !appointment.rescheduleLimitReached && "md:grid-cols-2",
          )}
        >
          <DetailOutlineButton
            type="button"
            className="w-full disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onCancel}
            disabled={!appointment.canCancel}
          >
            {content.cancelLabel}
          </DetailOutlineButton>
          {appointment.rescheduleLimitReached ? null : (
            <DetailDarkButton
              type="button"
              className="w-full disabled:cursor-not-allowed disabled:opacity-50"
              onClick={onReschedule}
              disabled={!appointment.canReschedule}
            >
              {content.rescheduleLabel}
            </DetailDarkButton>
          )}
        </div>

        {appointment.rescheduleLimitReached ? (
          <ProfileInfoNote>{content.rescheduleLimitNote}</ProfileInfoNote>
        ) : appointment.canReschedule && appointment.rescheduleNote ? (
          <ProfileInfoNote>{appointment.rescheduleNote}</ProfileInfoNote>
        ) : null}
      </div>
    </ProfileCard>
  );
}
