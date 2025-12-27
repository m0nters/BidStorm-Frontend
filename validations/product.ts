import { z } from "zod";

/**
 * Create product validation schema
 * Matches backend CreateProductWithFilesRequest validation rules
 */
export const createProductSchema = z.object({
  categoryId: z
    .string()
    .min(1, "Danh mục là bắt buộc")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, "Danh mục không hợp lệ"),

  title: z
    .string()
    .min(1, "Tiêu đề là bắt buộc")
    .min(10, "Tiêu đề phải có ít nhất 10 ký tự")
    .max(255, "Tiêu đề không được vượt quá 255 ký tự")
    .trim(),

  description: z
    .string()
    .min(1, "Mô tả là bắt buộc")
    .min(50, "Mô tả phải có ít nhất 50 ký tự")
    .trim(),

  startingPrice: z
    .string()
    .min(1, "Giá khởi điểm là bắt buộc")
    .transform((val) => parseFloat(val))
    .refine(
      (val) => !isNaN(val) && val >= 0.01,
      "Giá khởi điểm phải lớn hơn 0",
    ),

  priceStep: z
    .string()
    .min(1, "Bước giá là bắt buộc")
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val >= 0.01, "Bước giá phải lớn hơn 0"),

  buyNowPrice: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    })
    .refine(
      (val) => val === undefined || val >= 0.01,
      "Giá mua ngay phải lớn hơn 0",
    ),

  endTime: z
    .string()
    .min(1, "Thời gian kết thúc là bắt buộc")
    .refine(
      (date) => {
        const endDate = new Date(date);
        return endDate > new Date();
      },
      { message: "Thời gian kết thúc phải ở tương lai" },
    ),

  autoExtend: z.boolean(),

  allowUnratedBidders: z.boolean(),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;

/**
 * Image validation for file upload
 * 3-10 files, JPG/PNG/WEBP, max 5MB each
 */
export const validateProductImages = (files: File[]): string | null => {
  if (files.length < 3) {
    return "Vui lòng tải lên ít nhất 3 hình ảnh";
  }
  if (files.length > 10) {
    return "Không được tải lên quá 10 hình ảnh";
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  for (const file of files) {
    if (!allowedTypes.includes(file.type)) {
      return `Tệp ${file.name} không đúng định dạng. Chỉ chấp nhận JPG, PNG, WEBP`;
    }
    if (file.size > maxSize) {
      return `Tệp ${file.name} quá lớn. Kích thước tối đa 5MB`;
    }
  }

  return null;
};
