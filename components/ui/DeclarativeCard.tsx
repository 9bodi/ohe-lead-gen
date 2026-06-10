"use client";

import { useState } from "react";
import type { DeclarativeQuestion } from "@/lib/questions";

interface DeclarativeCardProps {
  question: DeclarativeQuestion;
  onAnswer: (answer: "yes" | "no") => void;
}

export function DeclarativeCard({ question, onAnswer }: DeclarativeCardProps) {
  const [selected, setSelected] = useState<"yes" | "no" | null>(null);

  function handleSelect(value: "yes" | "no") {
    if (selected) return;
    setSelected(value);
    setTimeout(() => {
      onAnswer(value);
      setSelected(null);
    }, 350);
  }

  return (
    <div className="flex flex-col">
      {/* Énoncé en grand */}
      <h2 className="m-0 text-[28px] sm:text-[36px] lg:text-[44px] leading-[1.25] lg:leading-[1.18] font-normal tracking-[-0.012em] text-balance max-w-[760px]">
        {question.statement}
      </h2>

      {/* Deux boutons côte à côte */}
      <div className="mt-auto pt-10 lg:pt-12 grid grid-cols-2 gap-3 sm:gap-4 max-w-[640px]">
        {(["yes", "no"] as const).map((value) => {
          const isSelected = selected === value;
          const label = value === "yes" ? "Plutôt oui" : "Plutôt non";

          return (
            <button
              key={value}
              type="button"
              onClick={() => handleSelect(value)}
              disabled={!!selected}
              className={`
                px-4 py-6 sm:px-6 sm:py-7 rounded-[12px] border-2 transition-colors
                ${
                  isSelected
                    ? "bg-ohe-accent text-ohe-accent-ink border-ohe-accent"
                    : "bg-ohe-panel text-ohe-ink border-ohe-line hover:border-ohe-accent"
                }
                ${selected && !isSelected ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              <span className="text-[20px] sm:text-[24px] lg:text-[28px] leading-none font-medium">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
