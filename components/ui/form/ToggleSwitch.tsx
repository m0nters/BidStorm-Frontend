"use client";

interface ToggleSwitchProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
}

export const ToggleSwitch = ({
  id,
  label,
  description,
  checked,
  onChange,
  disabled = false,
  error,
}: ToggleSwitchProps) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <label
            htmlFor={id}
            className={`text-sm font-medium ${
              disabled ? "text-gray-400" : "text-gray-900"
            } ${error ? "text-red-600" : ""}`}
          >
            {label}
          </label>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          id={id}
          onClick={() => !disabled && onChange(!checked)}
          disabled={disabled}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-none ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${
            checked
              ? error
                ? "bg-red-600"
                : "bg-black"
              : error
                ? "bg-red-200"
                : "bg-gray-200"
          } `}
        >
          <span className="sr-only">{label}</span>
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${checked ? "translate-x-6" : "translate-x-1"} `}
          />
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
