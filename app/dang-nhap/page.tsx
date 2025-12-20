"use client";

import { GuestGuard } from "@/components/auth/";
import { PasswordInput } from "@/components/ui/form/";
import { login } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";
import { LoginFormData, loginSchema } from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { FiArrowRight, FiMail } from "react-icons/fi";
import { toast } from "react-toastify";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  return (
    <GuestGuard redirectTo={redirectTo || "/"}>
      <LoginPageContent />
    </GuestGuard>
  );
}

function LoginPageContent() {
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data);

      // Store access token in memory via zustand
      // This will trigger GuestGuard to redirect automatically
      setAuth(response.user, response.accessToken);

      toast.success("Đăng nhập thành công!");
    } catch (error: any) {
      console.error("Login error:", error);

      const errorMessage =
        error?.message ||
        error?.error ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";

      toast.error(errorMessage);
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
        {/* Right Side - Login Form */}
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Đăng nhập</h2>
              <p className="mt-2 text-gray-600">Nhập thông tin để tiếp tục</p>
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
                  Email
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

              {/* Password */}
              <PasswordInput
                id="password"
                label="Mật khẩu"
                {...register("password")}
                placeholder="password123"
                disabled={isSubmitting}
                error={errors.password?.message}
                className={`${
                  errors.password
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-black focus:ring-black"
                }`}
              />

              {/* Forgot password */}
              <div className="flex items-center justify-end">
                <Link
                  href="/quen-mat-khau"
                  className="text-sm font-medium text-gray-700 hover:text-black"
                >
                  Quên mật khẩu?
                </Link>
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
                    <span>Đang đăng nhập...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng nhập</span>
                    <FiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Register link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <Link
                  href="/dang-ky"
                  className="font-semibold text-black hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
