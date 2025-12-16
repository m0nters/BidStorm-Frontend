import { z } from "zod";

/**
 * OTP verification schema
 */
export const verifyOtpSchema = z.object({
  email: z.email("Email phải hợp lệ").min(1, "Email là bắt buộc"),
  otpCode: z
    .string()
    .length(6, "Mã OTP phải có 6 chữ số")
    .regex(/^\d{6}$/, "Mã OTP chỉ được chứa số"),
});

export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
