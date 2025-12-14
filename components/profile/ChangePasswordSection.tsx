"use client";

import PasswordInput from "@/components/ui/PasswordInput";
import { forgotPassword } from "@/lib/api/services/auth";
import { changePassword } from "@/lib/api/services/profile";
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from "@/lib/validations/profile";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export function ChangePasswordSection() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      const { confirmPassword, ...changePasswordData } = data;
      await changePassword(changePasswordData);
      toast.success("Đổi mật khẩu thành công!");
      reset();
    } catch (error: any) {
      console.error("Change password error:", error);
      toast.error(error.message || "Có lỗi xảy ra khi đổi mật khẩu");
    }
  };

  const handleForgotPassword = async () => {
    if (!user?.email) {
      toast.error("Không tìm thấy email của bạn.");
      return;
    }

    setIsSendingOtp(true);
    try {
      await forgotPassword(user.email);

      // Create OTP session for password reset verification with redirectTo
      sessionStorage.setItem(
        "otp_verification_session",
        JSON.stringify({
          email: user.email,
          timestamp: Date.now(),
          purpose: "password-reset",
          redirectTo: "/tai-khoan?tab=doi-mat-khau", // Redirect back to change password tab
        }),
      );

      toast.success("Mã OTP đã được gửi đến email của bạn.", {
        autoClose: 3000,
      });

      // Redirect to OTP verification page
      router.push("/xac-nhan-otp");
    } catch (error: any) {
      console.error("Forgot password error:", error);
      toast.error(error?.message || "Gửi mã OTP thất bại. Vui lòng thử lại.", {
        autoClose: 4000,
      });
      setIsSendingOtp(false);
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Đổi mật khẩu</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex max-w-md flex-col space-y-4"
      >
        <PasswordInput
          label="Mật khẩu hiện tại"
          placeholder="Nhập mật khẩu hiện tại"
          {...register("oldPassword")}
          error={errors.oldPassword?.message}
        />

        <PasswordInput
          label="Mật khẩu mới"
          placeholder="Nhập mật khẩu mới"
          {...register("newPassword")}
          error={errors.newPassword?.message}
          helperText="Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
        />

        <PasswordInput
          label="Xác nhận mật khẩu mới"
          placeholder="Nhập lại mật khẩu mới"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
          helperText="Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
        />

        {/* Forgot password? */}
        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={isSendingOtp}
          className="cursor-pointer text-left text-sm font-medium text-blue-600 hover:underline disabled:opacity-50"
        >
          {isSendingOtp ? "Đang gửi OTP..." : "Quên mật khẩu?"}
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
        </button>
      </form>
    </div>
  );
}
