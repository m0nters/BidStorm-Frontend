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

export default function ImageGallery({
  images,
  title,
  isNew,
  isEnded,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [magnifierOffset, setMagnifierOffset] = useState({ left: 0, top: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const elem = e.currentTarget;
    const { top, left, width, height } = elem.getBoundingClientRect();

    // Calculate mouse position relative to the image (for background position)
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    // Get actual cursor position for positioning the magnifier
    const cursorX = e.clientX - left;
    const cursorY = e.clientY - top;

    // Calculate magnifier position with edge detection
    const magnifierWidth = 256; // 64 * 4 (w-64 = 16rem = 256px)
    const magnifierHeight = 256;
    const offsetX = 20;
    const offsetY = 80;

    let magnifierLeft = cursorX + offsetX;
    let magnifierTop = cursorY - offsetY;

    // Adjust if too close to right edge
    if (magnifierLeft + magnifierWidth > width) {
      magnifierLeft = cursorX - magnifierWidth - offsetX;
    }

    // Adjust if too close to top edge
    if (magnifierTop < 0) {
      magnifierTop = cursorY + offsetX;
    }

    // Adjust if too close to bottom edge
    if (magnifierTop + magnifierHeight > height) {
      magnifierTop = height - magnifierHeight;
    }

    setMagnifierPosition({ x, y });
    setCursorPosition({ x: cursorX, y: cursorY });
    // Store adjusted magnifier position
    setMagnifierOffset({ left: magnifierLeft, top: magnifierTop });
  };

  return (
    <div className="relative overflow-visible rounded-lg bg-white shadow-sm">
      {/* Main Image */}
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-t-lg bg-gray-100">
        <div className="relative">
          <img
            src={images[selectedImage]?.imageUrl || "/placeholder.jpg"}
            alt={title}
            className="max-h-fit w-auto"
            onMouseEnter={() => setShowMagnifier(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setShowMagnifier(false)}
          />

          {/* Magnifier Rectangle - positioned relative to image */}
          {showMagnifier && !isEnded && (
            <div
              className="pointer-events-none absolute z-10 border-2 border-white bg-white/30 shadow-lg"
              style={{
                width: "80px",
                height: "80px",
                left: `${cursorPosition.x}px`,
                top: `${cursorPosition.y}px`,
                transform: "translate(-50%, -50%)",
              }}
            />
          )}

          {/* Magnified View - Positioned relative to image */}
          {showMagnifier && !isEnded && (
            <div
              className="pointer-events-none absolute z-50 hidden h-64 w-64 overflow-hidden rounded-lg border-2 border-gray-300 bg-white shadow-2xl lg:block"
              style={{
                left: `${magnifierOffset.left}px`,
                top: `${magnifierOffset.top}px`,
                backgroundImage: `url(${images[selectedImage]?.imageUrl})`,
                backgroundSize: "800%",
                backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                backgroundRepeat: "no-repeat",
              }}
            />
          )}
        </div>

        {/* Badges */}
        {isNew && (
          <div className="absolute top-4 left-4 rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white">
            MỚI
          </div>
        )}
        {isEnded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="rounded-lg bg-white px-6 py-3">
              <p className="text-lg font-bold text-gray-900">
                Đấu giá đã kết thúc
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-6 gap-2 border-t p-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square cursor-pointer overflow-hidden rounded bg-gray-100 transition-all ${
                selectedImage === index
                  ? "ring-2 ring-blue-500"
                  : "hover:ring-2 hover:ring-blue-300"
              }`}
            >
              <Image
                src={image.imageUrl}
                alt={`${title} - ${image.displayOrder}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
