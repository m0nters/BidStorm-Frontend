"use client";

import { RoleGuard } from "@/components/auth";
import { DropdownMenu } from "@/components/ui/common/DropdownMenu";
import {
  ImageUploader,
  NumberInput,
  RichTextEditor,
} from "@/components/ui/form";
import { ToggleSwitch } from "@/components/ui/form/ToggleSwitch";
import { getParentCategories, getSubCategories } from "@/services/categories";
import { getAutoExtendByMin, getAutoExtendTriggerMin } from "@/services/config";
import { createProduct } from "@/services/products";
import { CategoryResponse } from "@/types/category";
import {
  createProductSchema,
  validateProductImages,
} from "@/validations/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiFile, FiFolder } from "react-icons/fi";
import { toast } from "react-toastify";

export default function CreateProductPage() {
  const router = useRouter();
  const [parentCategories, setParentCategories] = useState<CategoryResponse[]>(
    [],
  );
  const [subCategories, setSubCategories] = useState<CategoryResponse[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [autoExtendTriggerMin, setAutoExtendTriggerMin] = useState<number>(10);
  const [autoExtendByMin, setAutoExtendByMin] = useState<number>(10);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      autoExtend: true,
      allowUnratedBidders: false,
    },
  });

  useEffect(() => {
    const loadParentCategories = async () => {
      try {
        const data = await getParentCategories();
        setParentCategories(data);
      } catch (error) {
        console.error("Failed to load parent categories:", error);
        toast.error("Không thể tải danh mục cha");
      }
    };

    const loadConfigValues = async () => {
      try {
        const [triggerMin, extendByMin] = await Promise.all([
          getAutoExtendTriggerMin(),
          getAutoExtendByMin(),
        ]);
        setAutoExtendTriggerMin(triggerMin);
        setAutoExtendByMin(extendByMin);
      } catch (error) {
        console.error("Failed to load config values:", error);
        // Keep default values if fetch fails
      }
    };

    loadParentCategories();
    loadConfigValues();
  }, []);

  const handleParentCategoryChange = async (parentId: string) => {
    setSelectedParentId(parentId);
    setSelectedCategoryId("");
    setValue("categoryId", ""); // Clear form value
    setSubCategories([]);

    if (!parentId) return;

    setLoadingSubCategories(true);
    try {
      const data = await getSubCategories(parseInt(parentId, 10));
      setSubCategories(data);
    } catch (error) {
      console.error("Failed to load sub-categories:", error);
      toast.error("Không thể tải danh mục con");
    } finally {
      setLoadingSubCategories(false);
    }
  };

  const handleSubCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setValue("categoryId", categoryId); // Sync with form
  };

  const handleImageChange = (files: File[]) => {
    setImages(files);
    const error = validateProductImages(files);
    setImageError(error || "");
  };

  const onSubmit = async (data: any) => {
    // Validate images
    const error = validateProductImages(images);
    if (error) {
      setImageError(error);
      toast.error(error);
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert form data to API request format
      const productRequest = {
        ...data,
        endTime: new Date(data.endTime).toISOString(),
      };

      const response = await createProduct(productRequest, images);
      toast.success("Đăng sản phẩm thành công!");
      router.push(`/san-pham/${response.slug}`);
    } catch (error: any) {
      console.error("Failed to create product:", error);
      toast.error(
        error?.message || "Đăng sản phẩm thất bại. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RoleGuard allowedRoles={["SELLER"]} redirectTo="/403">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Info */}
          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Thông tin cơ bản</h2>
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Tiêu đề <span className="text-red-600">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  {...register("title")}
                  className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập tiêu đề sản phẩm (tối thiểu 10 ký tự)"
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Mô tả <span className="text-red-600">*</span>
                </label>
                <span className="mb-2 block text-xs text-gray-500">
                  Lưu ý: Kiểm tra kỹ mô tả trước khi đăng bán sản phẩm (nội
                  dung, lỗi chính tả,...), bạn sẽ không thể chỉnh sửa hay thay
                  thế phần này trong tương lai mà chỉ có thể bổ sung mới vào.
                </span>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Mô tả chi tiết sản phẩm (tối thiểu 50 ký tự)"
                      error={errors.description?.message}
                      disabled={isSubmitting}
                    />
                  )}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Category Selection */}
          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Danh mục</h2>
            <div className="space-y-4">
              {/* Parent Category */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FiFolder className="h-4 w-4" />
                  Danh mục cha <span className="text-red-600">*</span>
                </label>
                <DropdownMenu
                  value={selectedParentId}
                  onChange={handleParentCategoryChange}
                  options={parentCategories.map((cat) => ({
                    value: cat.id.toString(),
                    label: cat.name,
                  }))}
                  placeholder="-- Chọn danh mục cha --"
                  canSearch
                  disabled={isSubmitting}
                />
              </div>

              {/* Sub Category */}
              {selectedParentId && (
                <div>
                  <label
                    htmlFor="categoryId"
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
                  >
                    <FiFile className="h-4 w-4" />
                    Danh mục con <span className="text-red-600">*</span>
                  </label>
                  {loadingSubCategories ? (
                    <div className="flex items-center justify-center rounded-lg border border-gray-300 bg-gray-50 py-3">
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
                      <span className="text-sm text-gray-600">Đang tải...</span>
                    </div>
                  ) : subCategories.length > 0 ? (
                    <>
                      <input type="hidden" {...register("categoryId")} />
                      <DropdownMenu
                        value={selectedCategoryId}
                        onChange={handleSubCategoryChange}
                        options={subCategories.map((cat) => ({
                          value: cat.id.toString(),
                          label: cat.name,
                        }))}
                        placeholder="-- Chọn danh mục con --"
                        canSearch
                        disabled={isSubmitting}
                      />
                    </>
                  ) : (
                    <div className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                      Danh mục này không có danh mục con
                    </div>
                  )}
                </div>
              )}

              {errors.categoryId && (
                <p className="text-sm text-red-600">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          </section>

          {/* Images */}
          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-semibold">
              Hình ảnh <span className="text-red-600">*</span>
            </h2>
            <p className="mb-4 text-sm text-gray-500">
              (Hình ảnh đầu tiên sẽ được hiển thị làm ảnh đại diện)
            </p>
            <ImageUploader
              onChange={handleImageChange}
              error={imageError}
              maxFiles={10}
              minFiles={3}
              maxSizeInMB={5}
              acceptedFormats={["image/jpeg", "image/png", "image/webp"]}
              disabled={isSubmitting}
            />
          </section>

          {/* Pricing */}
          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Giá cả</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Starting Price */}
              <div>
                <label
                  htmlFor="startingPrice"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Giá khởi điểm (₫) <span className="text-red-600">*</span>
                </label>
                <Controller
                  name="startingPrice"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      id="startingPrice"
                      value={field.value}
                      onChange={field.onChange}
                      error={!!errors.startingPrice}
                      placeholder="0"
                      disabled={isSubmitting}
                    />
                  )}
                />
                {errors.startingPrice && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.startingPrice.message}
                  </p>
                )}
              </div>

              {/* Price Step */}
              <div>
                <label
                  htmlFor="priceStep"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Bước giá (₫) <span className="text-red-600">*</span>
                </label>
                <Controller
                  name="priceStep"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      id="priceStep"
                      value={field.value}
                      onChange={field.onChange}
                      error={!!errors.priceStep}
                      placeholder="0"
                      disabled={isSubmitting}
                    />
                  )}
                />
                {errors.priceStep && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.priceStep.message}
                  </p>
                )}
              </div>

              {/* Buy Now Price */}
              <div className="md:col-span-2">
                <label
                  htmlFor="buyNowPrice"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Giá mua ngay (₫){" "}
                  <span className="text-xs text-gray-500">(Tùy chọn)</span>
                </label>
                <Controller
                  name="buyNowPrice"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      id="buyNowPrice"
                      value={field.value}
                      onChange={field.onChange}
                      error={!!errors.buyNowPrice}
                      placeholder="Để trống nếu không áp dụng"
                      disabled={isSubmitting}
                    />
                  )}
                />
                {errors.buyNowPrice && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.buyNowPrice.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Auction Settings */}
          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Cài đặt đấu giá</h2>
            <div className="space-y-6">
              {/* End Time */}
              <div>
                <label
                  htmlFor="endTime"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Thời gian kết thúc <span className="text-red-600">*</span>
                </label>
                <input
                  id="endTime"
                  type="datetime-local"
                  {...register("endTime")}
                  className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none ${
                    errors.endTime ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isSubmitting}
                />
                {errors.endTime && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.endTime.message}
                  </p>
                )}
              </div>

              {/* Auto Extend */}
              <Controller
                name="autoExtend"
                control={control}
                render={({ field }) => (
                  <ToggleSwitch
                    id="autoExtend"
                    label="Tự động gia hạn"
                    description={`Gia hạn thêm ${autoExtendByMin} phút nếu có người đặt giá trong ${autoExtendTriggerMin} phút cuối`}
                    checked={field.value}
                    onChange={field.onChange}
                    error={errors.autoExtend?.message}
                    disabled={isSubmitting}
                  />
                )}
              />

              {/* Allow Unrated Bidders */}
              <Controller
                name="allowUnratedBidders"
                control={control}
                render={({ field }) => (
                  <ToggleSwitch
                    id="allowUnratedBidders"
                    label="Cho phép người chưa có đánh giá"
                    description="Cho phép người dùng chưa có đánh giá hoặc có đánh giá dưới 80% tham gia đấu giá"
                    checked={field.value}
                    onChange={field.onChange}
                    error={errors.allowUnratedBidders?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
          </section>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="cursor-pointer rounded-lg border border-gray-300 px-6 py-3 font-medium transition-colors hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer rounded-lg bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isSubmitting ? "Đang đăng..." : "Đăng sản phẩm"}
            </button>
          </div>
        </form>
      </div>
    </RoleGuard>
  );
}
