"use client";

import { resendEmailVerificationOtp } from "@/lib/api/services/auth";
import { updateProfile } from "@/lib/api/services/profile";
import {
  UpdateProfileFormData,
  updateProfileSchema,
} from "@/lib/validations/profile";
import { UserProfileResponse } from "@/types/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiCalendar,
  FiCheckCircle,
  FiMail,
  FiMapPin,
  FiUser,
  FiXCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";

interface ProfileInfoSectionProps {
  profile: UserProfileResponse | null;
  onProfileUpdate: () => void;
}

export function ProfileInfoSection({
  profile,
  onProfileUpdate,
}: ProfileInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: profile?.fullName || "",
      email: profile?.email || "",
      address: profile?.address || "",
      birthDate: profile?.birthDate || "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName,
        email: profile.email,
        address: profile.address || "",
        birthDate: profile.birthDate || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: UpdateProfileFormData) => {
    try {
      // Only send non-empty fields
      const updateData: UpdateProfileFormData = {
        fullName: data.fullName,
        email: data.email,
        address: data.address,
        birthDate: data.birthDate,
      };

      await updateProfile(updateData);
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
      onProfileUpdate(); // refresh back to view mode with updated info
    } catch (error: any) {
      console.error("Update profile error:", error);
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật thông tin");
    }
  };

  const handleVerifyEmail = async () => {
    if (!profile?.email) return;

    setIsSendingOtp(true);
    try {
      await resendEmailVerificationOtp(profile.email);

      // Create OTP session for verification page
      sessionStorage.setItem(
        "otp_verification_session",
        JSON.stringify({
          email: profile.email,
          timestamp: Date.now(),
        }),
      );

      toast.success("Mã OTP đã được gửi đến email của bạn.");

      // Redirect to OTP verification page
      router.push("/xac-nhan-otp");
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      toast.error(
        error?.message || "Không thể gửi mã OTP. Vui lòng thử lại sau.",
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="cursor-pointer rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-gray-800"
          >
            Chỉnh sửa
          </button>
        )}
      </div>

      {isEditing ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Họ tên
            </label>
            <input
              type="text"
              {...register("fullName")}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-black focus:ring-2 focus:ring-black focus:outline-none"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-black focus:ring-2 focus:ring-black focus:outline-none"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Địa chỉ
            </label>
            <input
              type="text"
              {...register("address")}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-black focus:ring-2 focus:ring-black focus:outline-none"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">
                {errors.address.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Ngày sinh
            </label>
            <input
              type="date"
              {...register("birthDate")}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-black focus:ring-2 focus:ring-black focus:outline-none"
            />
            {errors.birthDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.birthDate.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                reset();
              }}
              className="cursor-pointer rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:border-black"
            >
              Hủy
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <FiUser className="h-4 w-4" />
                Họ tên
              </div>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                {profile?.fullName}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <FiMail className="h-4 w-4" />
                Email
              </div>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                {profile?.email}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <FiMapPin className="h-4 w-4" />
                Địa chỉ
              </div>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                {profile?.address || "Chưa cập nhật"}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <FiCalendar className="h-4 w-4" />
                Ngày sinh
              </div>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                {profile?.birthDate
                  ? new Date(profile.birthDate).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "Chưa cập nhật"}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <FiCheckCircle className="h-4 w-4" />
                Trạng thái email
              </div>
              <p className="mt-2 text-lg">
                {profile?.emailVerified ? (
                  <span className="inline-flex items-center gap-2 font-semibold text-green-600">
                    <FiCheckCircle className="h-5 w-5" />
                    Đã xác thực
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 font-semibold text-red-600">
                    <FiXCircle className="h-5 w-5" />
                    Chưa xác thực
                    <button
                      onClick={handleVerifyEmail}
                      disabled={isSendingOtp}
                      className="translate-y-px cursor-pointer text-xs text-gray-500 hover:underline disabled:opacity-50"
                    >
                      {isSendingOtp ? "Đang gửi..." : "Xác thực ngay"}
                    </button>
                  </span>
                )}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <FiCalendar className="h-4 w-4" />
                Ngày tham gia
              </div>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : ""}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
