"use client";

import CategoryFilter from "@/components/ui/category/CategoryFilter";
import { ConfirmDialog, Pagination } from "@/components/ui/common";
import { DropdownMenu } from "@/components/ui/common/DropdownMenu";
import { useDebounce } from "@/hooks/useDebounce";
import { deleteProduct } from "@/services/admin";
import { getAllCategories } from "@/services/categories";
import { searchProducts } from "@/services/products";
import { CategoryResponse, ProductListResponse } from "@/types";
import { formatPrice } from "@/utils/price";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

export const ProductManagement = () => {
  const [products, setProducts] = useState<ProductListResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"active" | "ended" | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await searchProducts({
        page: currentPage,
        size: 20,
        categoryId: categoryFilter ? Number(categoryFilter) : undefined,
        keyword: debouncedSearchQuery.trim() || undefined,
        status: statusFilter,
      });

      setProducts(data.content);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải danh sách danh mục");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, categoryFilter, statusFilter, debouncedSearchQuery]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteClick = (productId: number) => {
    setProductToDelete(productId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setShowDeleteConfirm(false);
    try {
      await deleteProduct(productToDelete);
      toast.success("Xóa sản phẩm thành công");
      await fetchProducts();
    } catch (error: any) {
      toast.error(error?.message || "Không thể xóa sản phẩm");
    } finally {
      setProductToDelete(null);
    }
  };

  const getStatusBadge = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const hasEnded = now >= end;

    if (hasEnded) {
      return (
        <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
          Đã kết thúc
        </span>
      );
    }

    return (
      <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
        Đang đấu giá
      </span>
    );
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Quản lý sản phẩm</h2>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Category Filter Sidebar */}
        <div className="lg:col-span-3">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <CategoryFilter
              categories={categories}
              categoryId={categoryFilter}
              onCategoryChange={setCategoryFilter}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9">
          {/* Filters */}
          <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
            {/* Status Filter */}
            <div className="mb-4 flex items-center gap-4">
              <label className="text-sm font-medium">Trạng thái:</label>
              <DropdownMenu
                value={statusFilter}
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "active", label: "Còn hạn" },
                  { value: "ended", label: "Đã kết thúc" },
                ]}
                onChange={(value) =>
                  setStatusFilter(value as "active" | "ended" | "all")
                }
                isSorted={false}
                className="w-48"
              />
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Tìm kiếm:</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên sản phẩm hoặc người bán..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-black focus:outline-none"
              />
            </div>
          </div>

          {/* Products Table */}
          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-black"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-lg bg-white py-12 text-center">
              <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
            </div>
          ) : (
            <div className="overflow-visible rounded-lg bg-white shadow-sm">
              <div className="overflow-x-auto overflow-y-visible">
                <table className="w-full">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Sản phẩm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Người bán
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Giá hiện tại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Lượt đấu giá
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="group relative max-w-xs">
                            <Link
                              href={`/san-pham/${product.slug}`}
                              className="font-medium hover:underline"
                            >
                              {product.title}
                            </Link>
                            <div className="text-sm text-gray-500">
                              ID: {product.id}
                            </div>

                            {/* Hover Image Preview */}
                            {product.thumbnailUrl && (
                              <div className="pointer-events-none absolute -top-16 left-full z-50 ml-4 hidden w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg group-hover:block">
                                <Image
                                  src={product.thumbnailUrl}
                                  alt={product.title}
                                  width={192}
                                  height={192}
                                  className="h-48 w-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {product.sellerName}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          {formatPrice(product.currentPrice)}
                        </td>
                        <td className="-translate-x-3 px-6 py-4 text-center text-sm">
                          {product.bidCount}
                        </td>
                        <td className="-translate-x-2 px-6 py-4 text-center text-sm">
                          <div className="flex justify-center">
                            {getStatusBadge(product.endTime)}
                          </div>
                        </td>
                        <td className="translate-x-4 px-6 py-4 text-sm">
                          <button
                            onClick={() => handleDeleteClick(product.id)}
                            className="-translate-x-4 cursor-pointer rounded-lg p-2 transition-colors hover:bg-red-50"
                            title="Xóa sản phẩm"
                          >
                            <FiTrash2 className="text-red-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {!loading && products.length > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage + 1}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page - 1)}
                isFirst={currentPage === 0}
                isLast={currentPage === totalPages - 1}
              />
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">
              <strong>Cảnh báo:</strong> Xóa sản phẩm sẽ xóa vĩnh viễn sản phẩm,
              tất cả hình ảnh, lượt đấu giá, bình luận và yêu thích liên quan.
              Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Xác nhận xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm này? Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn và không thể khôi phục."
        confirmText="Xóa sản phẩm"
        cancelText="Hủy"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setProductToDelete(null);
        }}
      />
    </div>
  );
};
