"use client";

import { useMemo, useState } from "react";
import {
  CartOutlineButton,
  CartPrimaryLink,
} from "@/features/cart/components/CartFlowUi";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { useToast } from "@/shared/hooks/use-toast";
import { profileTabsContent } from "../data/profileContent";
import {
  getMockAppointmentsByFilter,
  PROFILE_PREVIEW_MOCK_WHEN_EMPTY,
} from "../data/profileMockData";
import { useCustomerAppointments } from "../hooks/useCustomerAppointments";
import type { AppointmentFilterKey } from "../types/profileUi.types";
import { mapCustomerAppointmentToProfileUi } from "../utils/profileDisplayMappers";
import { ProfileAppointmentCard } from "./ProfileAppointmentCard";
import { ProfileAppointmentCancelDialog } from "./ProfileAppointmentCancelDialog";
import {
  ProfileEmptyState,
  ProfileFilterChips,
} from "./profileUi";

const content = profileTabsContent.appointments;

const FILTER_OPTIONS: { key: AppointmentFilterKey; label: string }[] = [
  { key: "video_call", label: content.filters.videoCall },
  { key: "try_at_home", label: content.filters.tryAtHome },
  { key: "store_visit", label: content.filters.storeVisit },
];

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

  const appointments = useMemo(() => {
    if (data && data.appointments.length > 0) {
      return data.appointments.map(mapCustomerAppointmentToProfileUi);
    }

    if (PROFILE_PREVIEW_MOCK_WHEN_EMPTY) {
      return getMockAppointmentsByFilter(activeFilter);
    }

    return [];
  }, [data, activeFilter]);

  const filteredAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.type === activeFilter),
    [appointments, activeFilter],
  );

  const usingMockData =
    PROFILE_PREVIEW_MOCK_WHEN_EMPTY && (!data || data.appointments.length === 0);

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

  if (isLoading) {
    return <AppointmentsSkeleton />;
  }

  if (error) {
    return (
      <p className="font-gill text-sm font-light leading-110 text-red-700" role="alert">
        {error}
      </p>
    );
  }

  if (!usingMockData && (!data || data.appointments.length === 0)) {
    return (
      <div className="flex flex-col gap-6">
        <ProfileEmptyState
          title={content.emptyTitle}
          description={
            <>
              <span className="block">{content.emptyDescription}</span>
              <span className="mt-2 block">{content.emptyDescriptionSecondary}</span>
            </>
          }
          action={
            <CartPrimaryLink href={content.emptyCtaHref} className="w-full max-w-xs">
              {content.emptyCta}
            </CartPrimaryLink>
          }
        />
      </div>
    );
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

      {!usingMockData && data && data.totalPages > 1 ? (
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
