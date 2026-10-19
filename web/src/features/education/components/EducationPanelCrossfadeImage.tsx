"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";

type Layer = { src: string; alt: string };

type EducationPanelCrossfadeImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  durationMs?: number;
};

/**
 * Crossfades between image URLs when the slider selection changes (Four Cs panel media).
 */
const EducationPanelCrossfadeImage = ({
  src,
  alt,
  className = "object-contain",
  sizes = "200px",
  durationMs = 300,
}: EducationPanelCrossfadeImageProps) => {
  const [activeLayer, setActiveLayer] = useState<0 | 1>(0);
  const [layers, setLayers] = useState<[Layer, Layer]>([
    { src, alt },
    { src, alt },
  ]);
  const activeLayerRef = useRef(activeLayer);
  const layersRef = useRef(layers);

  activeLayerRef.current = activeLayer;
  layersRef.current = layers;

  useEffect(() => {
    const current = layersRef.current[activeLayerRef.current];
    if (current.src === src && current.alt === alt) {
      return;
    }

    const inactiveLayer: 0 | 1 = activeLayerRef.current === 0 ? 1 : 0;
    setLayers((prev) => {
      const next: [Layer, Layer] = [...prev];
      next[inactiveLayer] = { src, alt };
      return next;
    });

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setActiveLayer(inactiveLayer);
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [src, alt]);

  return (
    <>
      {layers.map((layer, index) => (
        <Image
          key={`layer-${index}`}
          src={layer.src}
          alt={index === activeLayer ? layer.alt : ""}
          fill
          aria-hidden={index !== activeLayer}
          className={cn(
            className,
            "absolute inset-0 ease-in-out transition-opacity",
            index === activeLayer ? "z-10 opacity-100" : "z-0 opacity-0",
          )}
          style={{ transitionDuration: `${durationMs}ms` }}
          sizes={sizes}
        />
      ))}
    </>
  );
};

export default EducationPanelCrossfadeImage;
