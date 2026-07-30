"use client";

import { useMemo, useState } from "react";
import type { StaticImageData } from "next/image";
import {
  CartOutlineButton,
} from "@/features/cart/components/CartFlowUi";
import { useMagentoWishlistProducts } from "@/hooks/magento/useMagentoWishlistProducts";
import { useToast } from "@/shared/hooks/use-toast";
import { profileTabsContent } from "../data/profileContent";
import { useCustomerAppointments } from "../hooks/useCustomerAppointments";
import type { AppointmentFilterKey } from "../types/profileUi.types";
import { mapCustomerAppointmentToProfileUi } from "../utils/profileDisplayMappers";
import { ProfileAppointmentCard } from "./ProfileAppointmentCard";
import { ProfileAppointmentCancelDialog } from "./ProfileAppointmentCancelDialog";
import { ProfileAppointmentsEmptyState } from "./ProfileAppointmentsEmptyState";
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

function AppointmentsSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading appointments">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="h-64 animate-pulse bg-gray300 p-6" />
      ))}
    </div>
  );
}

const ProfileAppointmentsSection = () => {
  const { toast } = useToast();
  const { data, isLoading, error, page, setPage } = useCustomerAppointments(true);
  const [activeFilter, setActiveFilter] = useState<AppointmentFilterKey>("video_call");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

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

  const filteredAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.type === activeFilter),
    [appointments, activeFilter],
  );

  const handleReschedule = () => {
    toast({
      title: content.cancelDialog.unavailableTitle,
      description: content.cancelDialog.unavailableDescription,
    });
    setCancelDialogOpen(false);
  };

  const handleConfirmCancel = () => {
    toast({
      title: content.cancelDialog.unavailableTitle,
      description: content.cancelDialog.unavailableDescription,
    });
    setCancelDialogOpen(false);
  };

  if (isLoading || (appointmentSkus.length > 0 && isProductImagesLoading)) {
    return <AppointmentsSkeleton />;
  }

  if (error) {
    return (
      <p className="font-gill text-sm font-light leading-110 text-red-700" role="alert">
        {error}
      </p>
    );
  }

  if (!data || data.appointments.length === 0) {
    return <ProfileAppointmentsEmptyState />;
  }

  return (
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
  );
};

export default ProfileAppointmentsSection;
