"use client";

import type { Product } from "@/features/products/data/products";
import ProductAppointmentPanel from "./ProductAppointmentPanel";

type TryAtHomePanelProps = {
  open: boolean;
  onClose: () => void;
  product: Product;
};

const TryAtHomePanel = ({ open, onClose, product }: TryAtHomePanelProps) => (
  <ProductAppointmentPanel open={open} onClose={onClose} product={product} variant="try-at-home" />
);

export default TryAtHomePanel;
