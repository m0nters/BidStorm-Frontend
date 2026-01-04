"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FiCamera, FiTrash, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

interface AvatarUploadProps {
  avatarUrl?: string;
  userName: string;
  onUpload: (file: File) => Promise<void>;
  onDelete?: () => Promise<void>;
  className?: string;
}

export const AvatarUpload = ({
  avatarUrl,
  userName,
  onUpload,
  onDelete,
  className = "",
}: AvatarUploadProps) => {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await onUpload(file);
      toast.success("Cập nhật ảnh đại diện thành công");
    } catch (error: any) {
      const errorMessage = error?.message || "Không thể tải lên ảnh đại diện";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    try {
      setDeleting(true);
      await onDelete();
      toast.success("Đã xóa ảnh đại diện");
      setShowFullScreen(false);
    } catch (error: any) {
      const errorMessage = error?.message || "Không thể xóa ảnh đại diện";
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const handleCameraClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* Avatar with hover effect */}
      <div className={`relative h-20 w-20 ${className}`}>
        <div
          className="group relative h-full w-full cursor-pointer overflow-hidden rounded-full"
          onClick={() => setShowFullScreen(true)}
        >
          {/* Avatar display */}
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={userName}
              width={80}
              height={80}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300 text-gray-600">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="text-xs font-medium text-white">Xem ảnh</span>
          </div>
        </div>

        {/* Camera button */}
        <button
          onClick={handleCameraClick}
          disabled={uploading}
          className="absolute right-0 bottom-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black text-white shadow-lg transition-transform hover:scale-110 disabled:opacity-50"
        >
          {uploading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : (
            <FiCamera className="h-4 w-4" />
          )}
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Full-screen modal */}
      {showFullScreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => !imageLoading && setShowFullScreen(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button - hidden while loading */}
            {!imageLoading && (
              <button
                onClick={() => setShowFullScreen(false)}
                className="absolute -top-6 -right-12 cursor-pointer rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              >
                <FiX className="h-6 w-6" />
              </button>
            )}

            {/* Avatar image */}
            <div className="relative">
              {avatarUrl ? (
                <>
                  {/* Skeleton loader */}
                  {imageLoading && (
                    <div className="flex h-[500px] w-[500px] animate-pulse items-center justify-center rounded-lg bg-gray-800">
                      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-white"></div>
                    </div>
                  )}

                  {/* Image */}
                  <Image
                    src={avatarUrl}
                    alt={userName}
                    width={500}
                    height={500}
                    className={`max-h-[80vh] w-auto rounded-lg object-contain transition-opacity duration-300 ${
                      imageLoading ? "absolute opacity-0" : "opacity-100"
                    }`}
                    onLoad={() => setImageLoading(false)}
                  />
                </>
              ) : (
                <div className="flex max-h-[80vh] w-auto items-center justify-center rounded-lg bg-gray-300 p-4 text-gray-600">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Delete button - hidden while loading */}
              {onDelete && !imageLoading && (
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  title="Xóa ảnh đại diện"
                  className="absolute -bottom-16 left-1/2 -translate-x-1/2 cursor-pointer rounded-lg bg-red-600 p-4 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                >
                  <FiTrash className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
