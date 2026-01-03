import { z } from "zod";

export const updateSystemConfigSchema = z.object({
  value: z
    .string()
    .min(1, "Giá trị không được để trống")
    .max(255, "Giá trị không được vượt quá 255 ký tự"),
});

export const submitUpgradeRequestSchema = z.object({
  reason: z.string().max(500, "Lý do không được vượt quá 500 ký tự").optional(),
});

export type UpdateSystemConfigRequest = z.infer<
  typeof updateSystemConfigSchema
>;
export type SubmitUpgradeRequestRequest = z.infer<
  typeof submitUpgradeRequestSchema
>;
