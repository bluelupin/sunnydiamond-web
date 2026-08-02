"use client";

import type { Product } from "@/features/products/data/products";
import ProductAppointmentPanel from "./ProductAppointmentPanel";

type PersonaliseProductPanelProps = {
  open: boolean;
  onClose: () => void;
  product: Product;
};

const PersonaliseProductPanel = ({ open, onClose, product }: PersonaliseProductPanelProps) => (
  <ProductAppointmentPanel open={open} onClose={onClose} product={product} variant="personalise" />
);

export default PersonaliseProductPanel;
