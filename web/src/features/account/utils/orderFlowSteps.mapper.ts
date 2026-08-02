import type {
  SunnyStepState,
  TrackedOrderRefundStatus,
  TrackedOrderTracking,
} from "@/services/customer/order-tracking.types";
import type { ProfileTimelineStep, TimelineStepStatus } from "../types/profileUi.types";

const TIMELINE_STATUS_BY_STEP_STATE: Record<SunnyStepState, TimelineStepStatus> = {
  COMPLETED: "completed",
  CURRENT: "current",
  PENDING: "upcoming",
};

/** Fulfilment stepper straight from `sunny_tracking` — empty when the field is absent. */
export function mapSunnyTrackingToTimeline(
  tracking: TrackedOrderTracking | null,
): ProfileTimelineStep[] {
  return (tracking?.steps ?? []).map((step, index) => ({
    step: index + 1,
    label: step.label,
    status: TIMELINE_STATUS_BY_STEP_STATE[step.state],
    ...(step.description ? { description: step.description } : {}),
    ...(step.timestamp ? { timestamp: step.timestamp } : {}),
  }));
}

/** Cancellation/return refund stepper straight from `sunny_refund`. */
export function mapSunnyRefundToTimeline(
  refund: TrackedOrderRefundStatus | null,
): ProfileTimelineStep[] {
  return (refund?.steps ?? []).map((step, index) => ({
    step: index + 1,
    label: step.label,
    status: TIMELINE_STATUS_BY_STEP_STATE[step.state],
    ...(step.timestamp ? { timestamp: step.timestamp } : {}),
  }));
}
