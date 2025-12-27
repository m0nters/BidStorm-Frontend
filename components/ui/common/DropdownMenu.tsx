"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownMenuProps {
  value: string;
  options: DropdownOption[];
  pin?: DropdownOption;
  onChange: (value: string) => void;
  className?: string;
  canSearch?: boolean;
  isSorted?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export function DropdownMenu({
  value,
  options,
  pin,
  onChange,
  className = "",
  canSearch = false,
  isSorted = true,
  placeholder = "Chọn...",
  disabled = false,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Memoize sorted and pinned options
  const sortedOptions = useMemo(() => {
    let result = isSorted
      ? [...options].sort((a, b) => a.label.localeCompare(b.label))
      : options;

    if (pin) {
      const withoutPin = result.filter((option) => option.value !== pin.value);
      result = [pin, ...withoutPin];
    }

    return result;
  }, [options, pin, isSorted]);

  // Memoize lowercase search term
  const searchTermLower = useMemo(() => searchTerm.toLowerCase(), [searchTerm]);

  // Memoize filtered options
  const filteredOptions = useMemo(() => {
    if (!searchTermLower) return sortedOptions;
    return sortedOptions.filter((option) =>
      option.label.toLowerCase().includes(searchTermLower),
    );
  }, [sortedOptions, searchTermLower]);

  // Memoize selected option
  const selectedOption = useMemo(
    () => sortedOptions.find((option) => option.value === value),
    [sortedOptions, value],
  );

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredOptions.length === 0) return;

      switch (e.key) {
        case "Enter":
          e.preventDefault();
          if (filteredOptions[focusedIndex]) {
            handleOptionClick(filteredOptions[focusedIndex].value);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setSearchTerm("");
          setFocusedIndex(0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredOptions, focusedIndex]);

  // Memoize handlers
  const handleOptionClick = useCallback(
    (optionValue: string) => {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm("");
      setFocusedIndex(0);
    },
    [onChange],
  );

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => {
      const newIsOpen = !prev;

      if (newIsOpen) {
        const selectedIndex = filteredOptions.findIndex(
          (option) => option.value === value,
        );
        setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);

        if (canSearch) {
          setTimeout(() => {
            searchInputRef.current?.focus();
          }, 100);
        }
      } else {
        setTimeout(() => {
          setSearchTerm("");
          setFocusedIndex(0);
        }, 150);
      }

      return newIsOpen;
    });
  }, [canSearch, filteredOptions, value]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setFocusedIndex(0);
    },
    [],
  );

  // Scroll focused option into view
  useEffect(() => {
    if (isOpen && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [focusedIndex, isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-left text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 focus:border-black focus:ring-2 focus:ring-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
      >
        <div className="flex items-center justify-between">
          <span className="truncate" title={selectedOption?.label}>
            {selectedOption?.label || placeholder}
          </span>
          <FiChevronDown
            className={`ml-2 h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </button>

      {/* Dropdown Options */}
      <div
        className={`absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg transition-all duration-200 ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        {/* Search Bar */}
        {canSearch && (
          <div className="border-b border-gray-100 p-2">
            <div className="relative">
              <FiSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Tìm kiếm..."
                className="w-full rounded-lg border border-gray-200 py-2 pr-3 pl-9 text-sm transition-colors focus:border-black focus:ring-2 focus:ring-black focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}

        <div className="max-h-60 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2.5 text-sm text-gray-500">
              Không tìm thấy kết quả
            </div>
          ) : (
            filteredOptions.map((option, index) => (
              <button
                key={option.value}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                type="button"
                onClick={() => handleOptionClick(option.value)}
                className={`w-full truncate px-3 py-2.5 text-left text-sm transition-colors focus:outline-none ${
                  option.value === value
                    ? "bg-black font-medium text-white"
                    : index === focusedIndex
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-900 hover:bg-gray-50"
                }`}
                title={option.label}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
