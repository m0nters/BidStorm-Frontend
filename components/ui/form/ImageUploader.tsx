"use client";

import React, { useCallback, useState } from "react";
import { FiImage, FiUpload, FiX } from "react-icons/fi";

interface ImageUploaderProps {
  onChange: (files: File[]) => void;
  error?: string;
  maxFiles?: number;
  minFiles?: number;
  maxSizeInMB?: number;
  acceptedFormats?: string[];
  disabled?: boolean;
}

export const ImageUploader = ({
  onChange,
  error,
  maxFiles = 10,
  minFiles = 3,
  maxSizeInMB = 5,
  acceptedFormats = ["image/jpeg", "image/png", "image/webp"],
  disabled = false,
}: ImageUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string>("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!acceptedFormats.includes(file.type)) {
        return `${file.name} không đúng định dạng. Chỉ chấp nhận JPG, PNG, WEBP`;
      }
      if (file.size > maxSizeInMB * 1024 * 1024) {
        return `${file.name} quá lớn. Kích thước tối đa ${maxSizeInMB}MB`;
      }
      return null;
    },
    [acceptedFormats, maxSizeInMB],
  );

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      setLocalError("");
      const fileArray = Array.from(newFiles);
      const currentTotal = files.length + fileArray.length;

      if (currentTotal > maxFiles) {
        setLocalError(`Chỉ được tải lên tối đa ${maxFiles} hình ảnh`);
        return;
      }

      const validFiles: File[] = [];
      const newPreviews: string[] = [];

      for (const file of fileArray) {
        const error = validateFile(file);
        if (error) {
          setLocalError(error);
          return;
        }

        validFiles.push(file);
        const preview = URL.createObjectURL(file);
        newPreviews.push(preview);
      }

      const updatedFiles = [...files, ...validFiles];
      const updatedPreviews = [...previews, ...newPreviews];

      setFiles(updatedFiles);
      setPreviews(updatedPreviews);
      onChange(updatedFiles);
    },
    [files, previews, maxFiles, validateFile, onChange],
  );

  const removeFile = useCallback(
    (index: number) => {
      setLocalError("");
      const updatedFiles = files.filter((_, i) => i !== index);
      const updatedPreviews = previews.filter((_, i) => i !== index);

      // Revoke the object URL to prevent memory leak
      URL.revokeObjectURL(previews[index]);

      setFiles(updatedFiles);
      setPreviews(updatedPreviews);
      onChange(updatedFiles);
    },
    [files, previews, onChange],
  );

  const handleImageDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleImageDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newFiles = [...files];
    const newPreviews = [...previews];

    // Remove dragged items
    const [draggedFile] = newFiles.splice(draggedIndex, 1);
    const [draggedPreview] = newPreviews.splice(draggedIndex, 1);

    // Insert at new position
    newFiles.splice(index, 0, draggedFile);
    newPreviews.splice(index, 0, draggedPreview);

    setFiles(newFiles);
    setPreviews(newPreviews);
    setDraggedIndex(index);
    onChange(newFiles);
  };

  const handleImageDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDropZoneDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
        e.dataTransfer.clearData();
      }
    },
    [addFiles],
  );

  const handleDropZoneDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },
    [],
  );

  const handleDropZoneDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    },
    [],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(e.target.files);
        e.target.value = ""; // Reset input
      }
    },
    [addFiles],
  );

  const displayError = error || localError;

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDrop={handleDropZoneDrop}
        onDragOver={handleDropZoneDragOver}
        onDragLeave={handleDropZoneDragLeave}
        className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? "border-black bg-gray-50"
            : displayError
              ? "border-red-500 bg-red-50"
              : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input
          type="file"
          id="image-upload"
          multiple
          accept={acceptedFormats.join(",")}
          onChange={handleFileInputChange}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          disabled={disabled || files.length >= maxFiles}
        />
        <div className="pointer-events-none space-y-4">
          <div className="flex justify-center">
            <FiUpload className="h-12 w-12 text-gray-400" />
          </div>
          <div>
            <p className="text-lg font-medium">
              Kéo thả hình ảnh vào đây hoặc nhấn để chọn
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {minFiles}-{maxFiles} hình ảnh, JPG/PNG/WEBP, tối đa {maxSizeInMB}
              MB mỗi ảnh
            </p>
            {files.length > 0 && (
              <p className="mt-2 text-sm font-medium text-gray-600">
                Đã chọn: {files.length}/{maxFiles}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Error message */}
      {displayError && (
        <p className="flex items-center gap-2 text-sm text-red-600">
          <span className="font-medium">⚠</span>
          {displayError}
        </p>
      )}

      {/* Preview grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {previews.map((preview, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => handleImageDragStart(index)}
              onDragOver={(e) => handleImageDragOver(e, index)}
              onDragEnd={handleImageDragEnd}
              className={`group relative aspect-square overflow-hidden rounded-lg border transition-colors ${
                draggedIndex === index
                  ? "border-black opacity-50"
                  : "border-gray-200 hover:border-gray-400"
              } cursor-move`}
            >
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="h-full w-full object-cover"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black opacity-0 transition-opacity duration-200 group-hover:opacity-40" />
              {/* Delete button */}
              <button
                type="button"
                onClick={() => removeFile(index)}
                disabled={disabled}
                className="absolute inset-0 flex cursor-pointer items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 disabled:cursor-not-allowed"
              >
                <div className="rounded-full bg-white p-2 hover:bg-red-600 hover:text-white">
                  <FiX className="h-5 w-5" />
                </div>
              </button>
              {/* Number badge */}
              <div className="bg-opacity-70 absolute top-2 left-2 rounded bg-black px-2 py-1 text-xs text-white">
                {index + 1}
              </div>
            </div>
          ))}

          {/* Add more images button */}
          {files.length < maxFiles && (
            <label
              htmlFor="image-upload-additional"
              className={`group relative aspect-square overflow-hidden rounded-lg border-2 border-dashed border-gray-300 transition-colors ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-gray-400 hover:bg-gray-50"}`}
            >
              <input
                type="file"
                id="image-upload-additional"
                multiple
                accept={acceptedFormats.join(",")}
                onChange={handleFileInputChange}
                className="hidden"
                disabled={disabled}
              />
              <div className="flex h-full w-full flex-col items-center justify-center text-gray-400 transition-colors group-hover:text-gray-600">
                <FiUpload className="mb-2 h-8 w-8" />
                <span className="text-sm font-medium">Thêm ảnh</span>
              </div>
            </label>
          )}
        </div>
      )}

      {/* Empty state when no files */}
      {files.length === 0 && !displayError && (
        <div className="py-8 text-center text-gray-400">
          <FiImage className="mx-auto mb-2 h-16 w-16 opacity-50" />
          <p className="text-sm">Chưa có hình ảnh nào</p>
        </div>
      )}
    </div>
  );
};
