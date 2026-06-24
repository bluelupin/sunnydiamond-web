export type RingSizeChartRow = {
  circumference: string;
  diameter: string;
  size: string;
};

export const RING_SIZE_CHART_ROWS: RingSizeChartRow[] = [
  { circumference: "46.3 mm", diameter: "15 mm", size: "4" },
  { circumference: "49 mm", diameter: "15.8 mm", size: "5" },
  { circumference: "51.3 mm", diameter: "16.6 mm", size: "6" },
  { circumference: "53.8 mm", diameter: "17.4 mm", size: "7" },
  { circumference: "62.1 mm", diameter: "18.2 mm", size: "8" },
];

export const RING_SIZE_CHART_IMAGES = {
  videoPoster: "/images/products/ring-size/video-poster.png",
  circumferenceHeader: "/images/products/ring-size/circumference-header.png",
  diameterHeader: "/images/products/ring-size/diameter-header.png",
} as const;
