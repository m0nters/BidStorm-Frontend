"use client";

import { useState } from "react";
import { FiCheck, FiLink } from "react-icons/fi";

interface SectionHeadingProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const SectionHeading = ({
  id,
  children,
  className = "",
}: SectionHeadingProps) => {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative inline-block">
      <h2 id={id} className={className}>
        {children}
      </h2>
      <button
        onClick={copyLink}
        className={`absolute top-1/2 -right-8 -translate-y-1/2 cursor-pointer ${copied ? "opacity-100" : "opacity-0"} transition-opacity group-hover:opacity-100`}
        aria-label="Copy link to section"
      >
        {copied ? (
          <FiCheck className="h-6 w-6 text-green-600" />
        ) : (
          <FiLink className="h-6 w-6 text-gray-400 hover:text-gray-600" />
        )}
      </button>
    </div>
  );
};
