"use client";

import { forgotPassword } from "@/lib/api/services/auth";
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FiArrowRight, FiMail } from "react-icons/fi";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data.email);

      // Create OTP session for password reset verification
      sessionStorage.setItem(
        "otp_verification_session",
        JSON.stringify({
          email: data.email,
          timestamp: Date.now(),
          attempts: 0,
          purpose: "password-reset", // Distinguish from email verification
        }),
      );

      toast.success("Mã OTP đã được gửi đến email của bạn.", {
        autoClose: 3000,
      });

      // Redirect to OTP verification page
      router.push("/xac-nhan-otp");
    } catch (error: any) {
      console.error("Forgot password error:", error);
      toast.error(
        error?.message ||
          "Không thể gửi mã OTP. Vui lòng kiểm tra lại email hoặc thử lại sau.",
        { autoClose: 4000 },
      );
    }
  };

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
              <h2 className="text-3xl font-bold text-gray-900">
                Quên mật khẩu
              </h2>
              <p className="mt-2 text-gray-600">
                Nhập email để nhận mã xác thực đặt lại mật khẩu
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={`block w-full rounded-lg border py-3 pr-4 pl-10 transition-all focus:ring-2 focus:outline-none ${
                      errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-black focus:ring-black"
                    }`}
                    placeholder="your.email@example.com"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-black px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <span>Gửi mã xác thực</span>
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
