"use client";

import { forwardRef, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactNode;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    { label, error, helperText, isRequired = false, className = "", ...props },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div>
        {label && (
          <label className="mb-2 block text-sm font-medium text-gray-900">
            {label} {isRequired && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={`w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-black focus:ring-2 focus:ring-black focus:outline-none ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? (
              <FiEyeOff className="h-5 w-5" />
            ) : (
              <FiEye className="h-5 w-5" />
            )}
          </button>
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-2 text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
