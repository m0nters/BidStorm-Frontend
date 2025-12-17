"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageGalleryProps {
  images: Array<{
    id: number;
    imageUrl: string;
    displayOrder: number;
  }>;
  title: string;
  isNew?: boolean;
  isEnded?: boolean;
}

export function ImageGallery({
  images,
  title,
  isNew,
  isEnded,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 }); // %, for background position
  const [magnifierRectPosition, setMagnifierRectPosition] = useState({
    x: 0,
    y: 0,
  });

  const [magnifierViewPosition, setMagnifierViewPosition] = useState({
    left: 0,
    top: 0,
  }); // Store adjusted magnifier position when near edges

  // mangnifier rectangle size
  const magnifierRectWidth = 80;
  const magnifierRectHeight = 80;

  // magnifier view size
  const magnifierViewWidth = 256;
  const magnifierViewHeight = 256;

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const elem = e.currentTarget;
    const { top, left, width, height } = elem.getBoundingClientRect();

    // Calculate mouse position relative to the image in pixels for position the
    // magnifier rectangle
    let cursorX = e.clientX - left;
    let cursorY = e.clientY - top;

    if (cursorX - magnifierRectWidth / 2 < 0) cursorX = magnifierRectWidth / 2;
    if (cursorY - magnifierRectHeight / 2 < 0)
      cursorY = magnifierRectHeight / 2;
    if (cursorX + magnifierRectWidth / 2 > width)
      cursorX = width - magnifierRectWidth / 2;
    if (cursorY + magnifierRectHeight / 2 > height)
      cursorY = height - magnifierRectHeight / 2;

    // ==================================
    // Calculate mouse position relative to the image in percentage for
    // background zoom position
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    // ==================================
    // default magnifier view position: bottom right relative to the mouse, so
    // we don't care if it nears left or top edge
    const offsetX = 40;
    const offsetY = 0;

    let magnifierLeft = cursorX + offsetX;
    let magnifierTop = cursorY - offsetY;

    // Adjust if too close to right edge, move the magnifier to left side
    if (magnifierLeft + magnifierViewWidth > width) {
      magnifierLeft = cursorX - magnifierViewWidth - offsetX;
    }

    // Adjust if too close to bottom edge
    if (magnifierTop + magnifierViewHeight > height) {
      magnifierTop = height - magnifierViewHeight;
    }

    setMagnifierPosition({ x, y });
    setMagnifierRectPosition({ x: cursorX, y: cursorY });
    setMagnifierViewPosition({ left: magnifierLeft, top: magnifierTop });
  };

  return (
    <div className="relative overflow-visible rounded-lg bg-white shadow-sm">
      {/* Main Image and Thumbnail Gallery */}
      <div className="flex gap-4 overflow-hidden rounded-lg bg-gray-100 p-4">
        {/* Thumbnail Gallery - Vertical on left */}
        {images.length > 1 && (
          <div className="flex flex-col gap-2">
            {images.map((image, index) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className={`relative h-20 w-20 cursor-pointer overflow-hidden rounded bg-gray-50 transition-all ${
                  selectedImage === index
                    ? "ring-2 ring-blue-500"
                    : "hover:ring-2 hover:ring-blue-300"
                }`}
              >
                <Image
                  src={image.imageUrl}
                  alt={`${title}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Main Image */}
        <div className="relative flex flex-1 items-center justify-center overflow-visible">
          <img
            src={images[selectedImage]?.imageUrl || "/placeholder.jpg"}
            alt={title}
            onMouseEnter={() => setShowMagnifier(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setShowMagnifier(false)}
          />

          {/* Magnifier Rectangle - positioned follow the mouse, bounded by the image */}
          {showMagnifier && !isEnded && (
            <div
              className="pointer-events-none absolute border-2 border-white bg-white/30 shadow-lg"
              style={{
                width: `${magnifierRectWidth}px`,
                height: `${magnifierRectHeight}px`,
                left: `${magnifierRectPosition.x}px`,
                top: `${magnifierRectPosition.y}px`,
                transform: "translate(-50%, -50%)",
              }}
            />
          )}

          {/* Magnified View - positioned relative to magnifier rectangle, bounded by the image */}
          {showMagnifier && !isEnded && (
            <div
              className="pointer-events-none absolute hidden overflow-hidden rounded-lg border-2 border-gray-300 bg-white shadow-2xl lg:block"
              style={{
                left: `${magnifierViewPosition.left}px`,
                top: `${magnifierViewPosition.top}px`,
                width: `${magnifierViewWidth}px`,
                height: `${magnifierViewHeight}px`,
                backgroundImage: `url(${images[selectedImage]?.imageUrl})`,
                backgroundSize: "800%",
                backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                backgroundRepeat: "no-repeat",
              }}
            />
          )}

          {/* Badges - positioned relative to image wrapper */}
          {isNew && (
            <div className="pointer-events-none absolute top-0 left-0 h-32 w-32 overflow-hidden">
              <div className="absolute top-7 -left-9 w-40 -rotate-45 transform bg-linear-to-r from-red-600 to-red-400 py-2 text-center text-xs font-bold tracking-wider text-white uppercase shadow-lg">
                Mới
              </div>
            </div>
          )}
        </div>
        {isEnded && (
          <div className="absolute inset-0 z-30 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm">
            <div className="rounded-xl bg-white px-8 py-4 shadow-2xl">
              <p className="text-xl font-bold text-gray-900">
                Đấu giá đã kết thúc
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
