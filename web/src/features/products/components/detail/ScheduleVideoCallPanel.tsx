"use client";

import type { Product } from "@/features/products/data/products";
import ProductAppointmentPanel from "./ProductAppointmentPanel";

type ScheduleVideoCallPanelProps = {
  open: boolean;
  onClose: () => void;
  product: Product;
};

const ScheduleVideoCallPanel = ({ open, onClose, product }: ScheduleVideoCallPanelProps) => (
  <ProductAppointmentPanel
    open={open}
    onClose={onClose}
    product={product}
    variant="schedule-video-call"
  />
);

export default ScheduleVideoCallPanel;
