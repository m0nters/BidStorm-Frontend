import { z } from "zod";

export const createReviewSchema = z.object({
  productId: z
    .number({
      error: (issue) =>
        issue.input === undefined ? "ID sản phẩm là bắt buộc" : undefined, // fallback to default for wrong type (e.g., string)
    })
    .int("ID sản phẩm phải là số nguyên"),

  rating: z
    .number({
      error: (issue) =>
        issue.input === undefined ? "Đánh giá là bắt buộc" : undefined,
    })
    .refine((val) => val === 1 || val === -1, {
      message: "Đánh giá phải là 1 (tích cực) hoặc -1 (tiêu cực)",
    }),

  comment: z
    .string()
    .max(1000, { message: "Bình luận không được vượt quá 1000 ký tự" })
    .optional(),
});

export const updateReviewSchema = z.object({
  rating: z
    .number({
      error: (issue) =>
        issue.input === undefined ? "Đánh giá là bắt buộc" : undefined,
    })
    .refine((val) => val === 1 || val === -1, {
      message: "Đánh giá phải là 1 (tích cực) hoặc -1 (tiêu cực)",
    }),

  comment: z
    .string()
    .max(1000, { message: "Bình luận không được vượt quá 1000 ký tự" })
    .optional(),
});

export type CreateReviewFormData = z.infer<typeof createReviewSchema>;
export type UpdateReviewFormData = z.infer<typeof updateReviewSchema>;
