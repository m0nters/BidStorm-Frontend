export const formatPrice = (
  price: number,
  currency: string = "VND",
): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
  }).format(price);
};
