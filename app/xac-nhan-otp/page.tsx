"use client";

import {
  forgotPassword,
  resendEmailVerificationOtp,
  verifyEmailOtp,
  verifyResetPasswordOtp,
} from "@/services/auth";
import { verifyOtpSchema } from "@/validations/otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FiMail } from "react-icons/fi";
import { toast } from "react-toastify";

/**
 * OTP Verification Page
 *
 * Security Model:
 * - One-time access only via session-based validation
 * - Requires valid sessionStorage entry created during registration or forgot password
 * - Session expires after 15 minutes
 * - Cannot be accessed directly via URL manipulation
 * - Not a guest-guarded page but uses sessionStorage for access control
 * - Supports multiple purposes: email verification and password reset
 */

interface OtpSession {
  email: string;
  timestamp: number;
  purpose?: "email-verification" | "password-reset"; // Purpose of OTP
  redirectTo?: string; // Where to redirect after successful password reset
}

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otpSession, setOtpSession] = useState<OtpSession | null>(null);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendOtpInterval, setResendOtpInterval] = useState(60); // seconds
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Validate OTP session on mount
  useEffect(() => {
    const sessionData = sessionStorage.getItem("otp_verification_session");

    if (!sessionData) {
      toast.error(
        "Phiên xác thực không hợp lệ. Vui lòng thao tác lại quy trình xác thực OTP.",
      );
      router.push("/");
      return;
    }

    try {
      const session: OtpSession = JSON.parse(sessionData);

      // Check if session is expired (must match the backend -- 10 minutes)
      const sessionAge = Date.now() - session.timestamp;

      if (sessionAge > 10 * 60 * 1000) {
        sessionStorage.removeItem("otp_verification_session");
        toast.error(
          "Phiên xác thực đã hết hạn. Vui lòng thao tác lại quy trình xác thực OTP.",
        );
        router.push("/");
        return;
      }

      setOtpSession(session);
    } catch (error) {
      sessionStorage.removeItem("otp_verification_session");
      toast.error(
        "Phiên xác thực không hợp lệ. Vui lòng thao tác lại quy trình xác thực OTP.",
      );
      router.push("/");
    }
  }, [router]);

  // after resend OTP, start countdown, and disable resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendOtpInterval > 0) {
      timer = setInterval(() => {
        setResendOtpInterval((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendOtpInterval]);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: "",
      otpCode: "",
    },
  });

  useEffect(() => {
    // Update email in form when session is loaded
    if (otpSession?.email) {
      setValue("email", otpSession.email);
    }
  }, [otpSession, setValue]);

  useEffect(() => {
    // Focus first input on mount only if session is valid
    if (otpSession) {
      inputRefs.current[0]?.focus();
    }
  }, [otpSession]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Update form value
    const otpCode = newOtp.join("");
    setValue("otpCode", otpCode, { shouldValidate: true });

    // Move to next input if value entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (otpCode.length === 6) {
      handleSubmit(onSubmit)();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Only allow 6-digit numbers
    if (!/^\d{6}$/.test(pastedData)) {
      toast.error("Vui lòng dán mã OTP 6 chữ số hợp lệ");
      return;
    }

    const newOtp = pastedData.split("");
    setOtp(newOtp);
    setValue("otpCode", pastedData, { shouldValidate: true });

    // Focus last input
    inputRefs.current[5]?.focus();

    // Auto-submit
    handleSubmit(onSubmit)();
  };

  const onSubmit = async (data: { email: string; otpCode: string }) => {
    if (!otpSession) return;
    setIsSubmitting(true);

    try {
      const purpose = otpSession.purpose;

      // Call appropriate API based on purpose
      if (purpose === "password-reset") {
        const response = await verifyResetPasswordOtp(data);

        // Clear the session immediately on success
        sessionStorage.removeItem("otp_verification_session");

        // Store email and redirectTo for reset password page
        sessionStorage.setItem("reset_password_email", data.email);
        if (otpSession.redirectTo) {
          sessionStorage.setItem(
            "reset_password_redirect",
            otpSession.redirectTo,
          );
        }

        toast.success(
          response.message || "Xác thực thành công! Vui lòng đặt lại mật khẩu.",
          { autoClose: 3000 },
        );

        // Redirect to reset password page
        router.push("/dat-lai-mat-khau");
      } else {
        // Email verification (registration or profile)
        const response = await verifyEmailOtp(data);

        // Clear the session immediately on success
        sessionStorage.removeItem("otp_verification_session");

        toast.success(
          response.message || "Xác thực thành công! Vui lòng đăng nhập.",
          { autoClose: 3000 },
        );

        // Redirect to login
        router.push("/dang-nhap");
      }
    } catch (error: any) {
      // API errors have message/error fields from ApiErrorResponse
      const errorMessage =
        error?.message || "Xác thực thất bại. Vui lòng thử lại.";

      // Show error in toast
      toast.error(errorMessage, { autoClose: 4000 });

      // Clear OTP inputs on error
      setOtp(["", "", "", "", "", ""]);
      setValue("otpCode", "");
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const onResendOtp = async (email: string) => {
    if (!otpSession) return;

    try {
      const purpose = otpSession.purpose || "email-verification";

      // Call appropriate API based on purpose
      if (purpose === "password-reset") {
        await forgotPassword(email);
      } else {
        await resendEmailVerificationOtp(email);
      }

      // If we reach here, the request was successful
      toast.success("Mã OTP đã được gửi lại đến email của bạn.");

      // Reset timestamp on successful resend
      const resetSession = {
        ...otpSession,
        timestamp: Date.now(), // Reset timestamp
      };
      sessionStorage.setItem(
        "otp_verification_session",
        JSON.stringify(resetSession),
      );
      setOtpSession(resetSession);
    } catch (error: any) {
      console.error("Resend OTP error:", error);

      // API errors have message/error fields from ApiErrorResponse
      const errorMessage =
        error?.message || "Không thể gửi lại mã OTP. Vui lòng thử lại sau.";

      toast.error(errorMessage);
    }
  };

  // Don't render until session is validated
  if (!otpSession) {
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
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black">
                <FiMail className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Xác thực OTP</h2>
              <p className="mt-2 text-gray-600">Nhập mã OTP đã được gửi đến</p>
              <p className="mt-1 font-semibold text-gray-900">
                {otpSession.email}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* OTP Input Boxes */}
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={isSubmitting}
                    className={`h-14 w-12 rounded-lg border-2 text-center text-xl font-bold transition-all focus:outline-none ${
                      errors.otpCode
                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500"
                        : "border-gray-300 focus:border-black focus:ring-2 focus:ring-black"
                    } disabled:cursor-not-allowed disabled:bg-gray-50`}
                  />
                ))}
              </div>
              {errors.otpCode && (
                <p className="mt-2 text-center text-sm text-red-600">
                  {errors.otpCode.message}
                </p>
              )}
            </form>

            {/* Resend OTP */}
            <div className="mt-6 text-center">
              <div className="flex flex-col items-center justify-center text-sm text-gray-600">
                <p className="flex gap-2">
                  <span>Không nhận được mã?</span>
                  <button
                    type="button"
                    disabled={isSubmitting || resendOtpInterval > 0}
                    className="cursor-pointer font-semibold text-black hover:underline disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:no-underline"
                    onClick={() => {
                      onResendOtp(otpSession.email);
                      setResendOtpInterval(60);
                    }}
                  >
                    Gửi lại
                  </button>
                </p>
                {resendOtpInterval > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    Vui lòng chờ {resendOtpInterval} giây để gửi lại.
                  </p>
                )}
              </div>
            </div>

            {/* Back to login */}
            <div className="mt-4 text-center">
              <button
                onClick={() => router.back()}
                className="cursor-pointer text-sm font-semibold text-gray-800 hover:text-black hover:underline"
              >
                Xác thực sau, đưa tôi trở về trang trước
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
