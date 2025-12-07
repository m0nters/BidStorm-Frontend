export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const formatTimeLeft = (
  endTime: Date
): { text: string; isUrgent: boolean } => {
  const now = new Date();
  const diff = endTime.getTime() - now.getTime();

  if (diff <= 0) {
    return { text: "Ended", isUrgent: false };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const isUrgent = diff < 3 * 24 * 60 * 60 * 1000; // less than 3 days

  if (days > 0) {
    return { text: `${days}d ${hours}h`, isUrgent };
  } else if (hours > 0) {
    return { text: `${hours}h ${minutes}m`, isUrgent };
  } else if (minutes > 0) {
    return { text: `${minutes}m ${seconds}s`, isUrgent };
  } else {
    return { text: `${seconds}s`, isUrgent: true };
  }
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else {
    return `${days} days ago`;
  }
};
