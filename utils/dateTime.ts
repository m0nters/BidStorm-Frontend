/**
 * Format full date time for tooltips hover
 */
export const formatFullDateTime = (
  date: Date | string,
  locale = "vi-VN",
): string => {
  return new Date(date).toLocaleString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

/**
 * Logic:
 * - "Vừa xong" for < 1 minute
 * - "X phút trước" for < 1 hour
 * - "X giờ trước" for < 1 day
 * - "X ngày trước" for < 7 days
 * - "7 tháng 12 22:06" for >= 7 days
 * - "9 tháng 2 năm 2024 14:25" if different year
 */
export const formatDateForFeed = (
  date: Date | string,
  locale = "vi-VN",
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = diffSec / 60;
  const diffHour = diffMin / 60;
  const diffDay = diffHour / 24;

  // Relative formatting (< 7 days)
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (diffSec < 60) return "Vừa xong";
  if (diffMin < 60) return rtf.format(-Math.round(diffMin), "minute");
  if (diffHour < 24) return rtf.format(-Math.round(diffHour), "hour");
  if (diffDay < 7) return rtf.format(-Math.round(diffDay), "day");

  // ≥ 7 days → absolute date
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  };

  // Add year only when it's not the current year
  if (dateObj.getFullYear() !== now.getFullYear()) {
    options.year = "numeric";
  }

  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(dateObj);
};

/**
 * Format time remaining for product auctions
 * - Shows relative time (minutes/hours/days) for products ending within 3 days
 * - Shows absolute date for products ending after 3 days
 */
export const formatTimeRemaining = (
  endTime: Date | string,
  locale = "vi-VN",
): string => {
  const endDate = typeof endTime === "string" ? new Date(endTime) : endTime;
  const now = new Date();
  const diffInDays = Math.floor(
    (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays <= 3) {
    // Show relative time for products ending within 3 days
    if (diffInDays < 1) {
      const diffInHours = Math.floor(
        (endDate.getTime() - now.getTime()) / (1000 * 60 * 60),
      );
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor(
          (endDate.getTime() - now.getTime()) / (1000 * 60),
        );
        return `${diffInMinutes} phút nữa`;
      } else {
        return `${diffInHours} giờ nữa`;
      }
    } else {
      return `${diffInDays} ngày nữa`;
    }
  } else {
    return endDate.toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
};

/**
 * Real-time countdown calculator for product cards
 * Returns formatted time string and urgency status
 * - Shows "Đã kết thúc" if time is up
 * - Shows countdown in days, hours:minutes:seconds, or minutes:seconds format
 * - Marks as urgent if less than 24 hours remaining
 */
export const calculateCountdown = (
  endTime: Date | string,
): { timeLeft: string; isUrgent: boolean } => {
  const endDate = typeof endTime === "string" ? new Date(endTime) : endTime;
  const now = new Date().getTime();
  const endTimestamp = endDate.getTime();
  const difference = endTimestamp - now;

  if (difference <= 0) {
    return { timeLeft: "Đã kết thúc", isUrgent: false };
  }

  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  // Mark as urgent if less than 24 hours
  const isUrgent = hours < 24;

  let timeLeft: string;
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    timeLeft = `${days} ngày`;
  } else if (hours > 0) {
    timeLeft = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  } else {
    timeLeft = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  return { timeLeft, isUrgent };
};
