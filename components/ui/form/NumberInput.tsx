"use client";

import { forwardRef, useState } from "react";

interface NumberInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> {
  value?: string | number;
  onChange?: (value: string) => void;
  error?: boolean;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, onChange, error, className, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(() => {
      if (!value) return "";
      const numValue = typeof value === "string" ? parseFloat(value) : value;
      return isNaN(numValue) ? "" : formatNumber(numValue.toString());
    });

    const formatNumber = (val: string) => {
      // Remove all non-digits
      const digits = val.replace(/\D/g, "");
      if (!digits) return "";

      // Add dots as thousand separators
      return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Remove all dots to get raw number
      const rawValue = inputValue.replace(/\./g, "");

      // Format for display
      const formatted = formatNumber(rawValue);
      setDisplayValue(formatted);

      // Pass raw value to form
      if (onChange) {
        onChange(rawValue);
      }
    };

    return (
      <input
        {...props}
        ref={ref}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none ${
          error ? "border-red-500" : "border-gray-300"
        } ${className || ""}`}
      />
    );
  },
);

NumberInput.displayName = "NumberInput";
