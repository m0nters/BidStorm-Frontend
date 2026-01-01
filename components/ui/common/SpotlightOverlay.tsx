"use client";

import { RefObject, useEffect, useState } from "react";

interface SpotlightOverlayProps {
  targetRef: RefObject<HTMLElement>;
  isVisible: boolean;
  onDismiss: () => void;
  padding?: number;
}

export const SpotlightOverlay = ({
  targetRef,
  isVisible,
  onDismiss,
  padding = 8,
}: SpotlightOverlayProps) => {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (isVisible && targetRef.current) {
      const updateRect = () => {
        setRect(targetRef.current?.getBoundingClientRect() || null);
      };

      updateRect();
      window.addEventListener("resize", updateRect);
      window.addEventListener("scroll", updateRect);

      return () => {
        window.removeEventListener("resize", updateRect);
        window.removeEventListener("scroll", updateRect);
      };
    }
  }, [isVisible, targetRef]);

  if (!isVisible || !rect) return null;

  return (
    <div
      className="fixed inset-0 z-50 cursor-pointer bg-black/70 transition-opacity duration-300"
      onClick={onDismiss}
      style={{
        clipPath: `polygon(
          0 0,
          100% 0,
          100% 100%,
          0 100%,
          0 0,
          ${rect.left - padding}px ${rect.top - padding}px,
          ${rect.left - padding}px ${rect.bottom + padding}px,
          ${rect.right + padding}px ${rect.bottom + padding}px,
          ${rect.right + padding}px ${rect.top - padding}px,
          ${rect.left - padding}px ${rect.top - padding}px
        )`,
      }}
    />
  );
};
