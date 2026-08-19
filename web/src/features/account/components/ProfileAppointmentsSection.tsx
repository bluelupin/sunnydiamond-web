"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { StaticImageData } from "next/image";
import {
  CartOutlineButton,
} from "@/features/cart/components/CartFlowUi";
import { useMagentoWishlistProducts } from "@/hooks/magento/useMagentoWishlistProducts";
import AppStatusToast, { appStatusToastDurationMs } from "@/shared/ui/AppStatusToast";
import { profileTabsContent } from "../data/profileContent";
import { useCustomerAppointments } from "../hooks/useCustomerAppointments";
import type { AppointmentFilterKey } from "../types/profileUi.types";
import { mapCustomerAppointmentToProfileUi } from "../utils/profileDisplayMappers";
import { ProfileAppointmentCard } from "./ProfileAppointmentCard";
import { ProfileAppointmentCancelDialog } from "./ProfileAppointmentCancelDialog";
import { ProfileAppointmentsEmptyState } from "./ProfileAppointmentsEmptyState";
import { ProfileAppointmentsListingSkeleton } from "./ProfileAppointmentsListingSkeleton";
import {
  ProfileFilterChips,
} from "./profileUi";

const content = profileTabsContent.appointments;

const FILTER_OPTIONS: { key: AppointmentFilterKey; label: string }[] = [
  { key: "video_call", label: content.filters.videoCall },
  { key: "try_at_home", label: content.filters.tryAtHome },
  { key: "store_visit", label: content.filters.storeVisit },
];

function listingImageUrl(image: string | StaticImageData): string {
  return typeof image === "string" ? image : image.src;
}

const ProfileAppointmentsSection = () => {
  const { data, isLoading, error, page, setPage } = useCustomerAppointments(true);
  const [activeFilter, setActiveFilter] = useState<AppointmentFilterKey | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [statusToastMessage, setStatusToastMessage] = useState<string | null>(null);
  const statusToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissStatusToast = useCallback(() => {
    if (statusToastTimeoutRef.current) {
      clearTimeout(statusToastTimeoutRef.current);
      statusToastTimeoutRef.current = null;
    }
    setStatusToastMessage(null);
  }, []);

  const showAppointmentUpdatesToast = useCallback(() => {
    dismissStatusToast();
    setStatusToastMessage(content.cancelDialog.unavailableToastMessage);
    statusToastTimeoutRef.current = setTimeout(() => {
      setStatusToastMessage(null);
      statusToastTimeoutRef.current = null;
    }, appStatusToastDurationMs);
  }, [dismissStatusToast]);

  useEffect(() => {
    return () => {
      if (statusToastTimeoutRef.current) {
        clearTimeout(statusToastTimeoutRef.current);
      }
    };
  }, []);
  const appointmentSkus = useMemo(
    () =>
      (data?.appointments ?? [])
        .map((appointment) => {
          const productId = appointment.productId;
          if (typeof productId === "string") {
            return productId.trim();
          }
          if (productId == null) {
            return "";
          }
          return String(productId).trim();
        })
        .filter(Boolean),
    [data],
  );

  const { products: magentoProducts, isLoading: isProductImagesLoading } =
    useMagentoWishlistProducts(appointmentSkus);

  const productImageBySku = useMemo(() => {
    const images: Record<string, string> = {};

    for (const product of magentoProducts) {
      const sku = product.sku?.trim();
      if (!sku) {
        continue;
      }

      images[sku] = listingImageUrl(product.primaryImage);
    }

    return images;
  }, [magentoProducts]);

  const appointments = useMemo(() => {
    if (!data?.appointments.length) {
      return [];
    }

    return data.appointments
      .map((appointment) =>
        mapCustomerAppointmentToProfileUi(appointment, productImageBySku),
      )
      .filter((appointment): appointment is NonNullable<typeof appointment> => appointment != null);
  }, [data, productImageBySku]);

  const filteredAppointments = useMemo(() => {
    if (activeFilter === null) {
      return appointments;
    }

    return appointments.filter((appointment) => appointment.type === activeFilter);
  }, [appointments, activeFilter]);

  const handleReschedule = () => {
    showAppointmentUpdatesToast();
    setCancelDialogOpen(false);
  };

  const handleConfirmCancel = () => {
    showAppointmentUpdatesToast();
    setCancelDialogOpen(false);
  };

  const statusToast = (
    <AppStatusToast open={Boolean(statusToastMessage)} message={statusToastMessage ?? ""} />
  );

  if (isLoading || (appointmentSkus.length > 0 && isProductImagesLoading)) {
    return (
      <>
        {statusToast}
        <ProfileAppointmentsListingSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <>
        {statusToast}
        <p className="font-gill text-sm font-light leading-110 text-red-700" role="alert">
          {error}
        </p>
      </>
    );
  }

  if (!data || data.appointments.length === 0) {
    return (
      <>
        {statusToast}
        <ProfileAppointmentsEmptyState />
      </>
    );
  }

  return (
    <>
      {statusToast}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="shrink-0 font-gill text-base font-normal leading-110 text-darkblack">
            {content.filterLabel}
          </p>
          <ProfileFilterChips
            options={FILTER_OPTIONS}
            activeKey={activeFilter}
            onChange={setActiveFilter}
            scrollOnMobile
          />
        </div>

        {filteredAppointments.length === 0 ? (
          <p className="font-gill text-base font-light leading-110 text-neutral500">
            {content.emptyFilterMessage}
          </p>
        ) : (
          <ul className="flex flex-col gap-6">
            {filteredAppointments.map((appointment) => (
              <li key={appointment.id}>
                <ProfileAppointmentCard
                  appointment={appointment}
                  onReschedule={handleReschedule}
                  onCancel={() => {
                    setCancelDialogOpen(true);
                  }}
                />
              </li>
            ))}
          </ul>
        )}

        {data && data.totalPages > 1 ? (
          <div className="flex items-center justify-between gap-4 pt-2">
            <CartOutlineButton
              type="button"
              className="w-auto min-w-[120px]"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </CartOutlineButton>
            <p className="font-gill text-sm font-light leading-110 text-neutral500">
              Page {data.currentPage} of {data.totalPages}
            </p>
            <CartOutlineButton
              type="button"
              className="w-auto min-w-[120px]"
              disabled={page >= data.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </CartOutlineButton>
          </div>
        ) : null}

        <ProfileAppointmentCancelDialog
          open={cancelDialogOpen}
          onOpenChange={setCancelDialogOpen}
          onReschedule={handleReschedule}
          onConfirmCancel={handleConfirmCancel}
        />
      </div>
    </>
  );
};

export default ProfileAppointmentsSection;
