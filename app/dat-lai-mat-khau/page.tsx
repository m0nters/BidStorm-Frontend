"use client";

import PasswordInput from "@/components/ui/PasswordInput";
import { resetPassword } from "@/lib/api/services/auth";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiArrowRight, FiLock } from "react-icons/fi";
import { toast } from "react-toastify";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Get email from sessionStorage (set by OTP verification page)
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("reset_password_email");

    if (!storedEmail) {
      toast.error("Phiên đặt lại mật khẩu không hợp lệ. Vui lòng thử lại.");
      router.push("/quen-mat-khau");
      return;
    }

    setEmail(storedEmail);
    setValue("email", storedEmail); // IMPORTANT: Set email in form for validation
  }, [router, setValue]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword(data.email, data.newPassword);

      // Get redirect URL if exists
      const redirectTo = sessionStorage.getItem("reset_password_redirect");

      // Clear all stored session data
      sessionStorage.removeItem("reset_password_email");
      sessionStorage.removeItem("reset_password_redirect");

      toast.success("Đặt lại mật khẩu thành công!", {
        autoClose: 3000,
      });

      // Redirect based on context (profile or login)
      router.push(redirectTo || "/dang-nhap");
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(
        error?.message ||
          "Đặt lại mật khẩu thất bại. Vui lòng thử lại hoặc yêu cầu mã OTP mới.",
        { autoClose: 4000 },
      );
    }
  };

  // Don't render until email is validated
  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-linear-to-br from-gray-50 to-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-black blur-3xl filter" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-gray-800 blur-3xl filter" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            {/* Header */}
            <div className="mb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black">
                <FiLock className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Đặt lại mật khẩu
              </h2>
              <p className="mt-2 text-gray-600">
                Nhập mật khẩu mới cho tài khoản{" "}
                <span className="font-semibold">{email}</span>
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              {/* New Password */}
              <PasswordInput
                id="newPassword"
                label="Mật khẩu mới"
                isRequired
                {...register("newPassword")}
                placeholder="Nhập mật khẩu mới"
                disabled={isSubmitting}
                error={errors.newPassword?.message}
                helperText="Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
                className={`${
                  errors.newPassword
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-black focus:ring-black"
                }`}
              />

              {/* Confirm Password */}
              <PasswordInput
                id="confirmPassword"
                label="Xác nhận mật khẩu"
                isRequired
                {...register("confirmPassword")}
                placeholder="Nhập lại mật khẩu mới"
                disabled={isSubmitting}
                error={errors.confirmPassword?.message}
                className={`${
                  errors.confirmPassword
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-black focus:ring-black"
                }`}
              />

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-black px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <span>Đặt lại mật khẩu</span>
                    <FiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Back to login */}
            <div className="mt-8 text-center">
              <Link
                href="/dang-nhap"
                className="text-sm text-gray-600 hover:text-black"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
