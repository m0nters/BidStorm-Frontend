"use client";

import { GuestGuard } from "@/components/auth/GuestGuard";
import PasswordInput from "@/components/ui/PasswordInput";
import { register } from "@/lib/api/services/auth";
import { RegisterFormData, registerSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import {
  FiArrowRight,
  FiCalendar,
  FiMail,
  FiMapPin,
  FiUser,
} from "react-icons/fi";
import { toast } from "react-toastify";

export default function RegisterPage() {
  return (
    <GuestGuard>
      <RegisterPageContent />
    </GuestGuard>
  );
}

function RegisterPageContent() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string>("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const {
    register: formRegister,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      address: "",
      birthDate: "",
      recaptchaToken: "",
    },
  });

  const onRecaptchaChange = (token: string | null) => {
    setValue("recaptchaToken", token || "", { shouldValidate: true });
  };

  const onSubmit = async (data: RegisterFormData) => {
    setApiError("");

    try {
      // Exclude confirmPassword from API request
      const { confirmPassword, ...registerData } = data;
      const response = await register(registerData);

      // Show success message
      toast.success(
        response.message ||
          "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
        { autoClose: 5000 },
      );

      router.push("/dang-nhap");
    } catch (error: any) {
      console.error("Register error:", error);

      // Handle API error response
      const errorMessage =
        error?.message ||
        error?.error ||
        "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.";
      setApiError(errorMessage);

      // Reset reCAPTCHA on error
      recaptchaRef.current?.reset();
      setValue("recaptchaToken", "");
    }
  };

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-white">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <p className="text-red-800">
            reCAPTCHA site key is not configured. Contact the admin immediately
            if you see this.
          </p>
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
        {/* Registration Form */}
        <div className="mx-auto w-full max-w-2xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Đăng ký</h2>
              <p className="mt-2 text-gray-600">
                Tạo tài khoản để bắt đầu đấu giá
              </p>
            </div>

            {apiError && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-800">{apiError}</p>
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    {...formRegister("fullName")}
                    className={`block w-full rounded-lg border py-3 pr-4 pl-10 transition-all focus:ring-2 focus:outline-none ${
                      errors.fullName
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-black focus:ring-black"
                    }`}
                    placeholder="Nguyễn Văn A"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

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
                    {...formRegister("email")}
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

              {/* Password */}
              <PasswordInput
                id="password"
                label="Mật khẩu"
                {...formRegister("password")}
                placeholder="••••••••"
                disabled={isSubmitting}
                error={errors.password?.message}
                helperText="Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
                className={`${
                  errors.password
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-black focus:ring-black"
                }`}
              />

              {/* Confirm Password */}
              <PasswordInput
                id="confirmPassword"
                label="Xác nhận mật khẩu"
                {...formRegister("confirmPassword")}
                placeholder="••••••••"
                disabled={isSubmitting}
                error={errors.confirmPassword?.message}
                className={`${
                  errors.confirmPassword
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-black focus:ring-black"
                }`}
              />

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Địa chỉ
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiMapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="address"
                    type="text"
                    {...formRegister("address")}
                    className={`block w-full rounded-lg border py-3 pr-4 pl-10 transition-all focus:ring-2 focus:outline-none ${
                      errors.address
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-black focus:ring-black"
                    }`}
                    placeholder="123 Đường ABC, Quận 1, TP.HCM"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Birth Date */}
              <div>
                <label
                  htmlFor="birthDate"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Ngày sinh
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="birthDate"
                    type="date"
                    {...formRegister("birthDate")}
                    className={`block w-full rounded-lg border py-3 pr-4 pl-10 transition-all focus:ring-2 focus:outline-none ${
                      errors.birthDate
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-black focus:ring-black"
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.birthDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.birthDate.message}
                  </p>
                )}
              </div>

              {/* reCAPTCHA */}
              <div>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={siteKey}
                  onChange={onRecaptchaChange}
                />
                {errors.recaptchaToken && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.recaptchaToken.message}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-black px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Đang đăng ký...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng ký</span>
                    <FiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Login link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link
                  href="/dang-nhap"
                  className="font-semibold text-black hover:underline"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
