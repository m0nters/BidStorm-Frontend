"use client";

import { useRef } from "react";
import { FiHash } from "react-icons/fi";

interface SectionHeadingProps {
  id: string;
  title: string;
  description?: string;
  className?: string;
}

export const SectionHeading = ({
  id,
  title,
  description,
  className = "",
}: SectionHeadingProps) => {
  const titleRef = useRef<HTMLDivElement>(null);

  const jumpToTitle = () => {
    if (titleRef.current) {
      titleRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="flex flex-col items-start" ref={titleRef}>
      <div className="group flex w-full items-center justify-start">
        <h2 id={id} className={className}>
          {title}
        </h2>
        <button
          onClick={jumpToTitle}
          className="ml-2 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100"
          aria-label="Copy link to section"
        >
          <FiHash className="h-6 w-6 text-gray-400 hover:text-gray-600" />
        </button>
      </div>
      <p className="mt-4 text-lg text-gray-600">{description}</p>
    </div>
  );
};
