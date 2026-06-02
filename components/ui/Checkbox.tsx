"use client";

import { ChangeEvent } from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Texte du label à droite (peut être du JSX riche) */
  children: React.ReactNode;
  /** Erreur affichée en rouge sous la case */
  error?: string;
  /** Désactive le clic */
  disabled?: boolean;
}

export function Checkbox({
  checked,
  onChange,
  children,
  error,
  disabled = false,
}: CheckboxProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.checked);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label
        className={`
          flex items-start gap-3
          ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
        `}
      >
        {/* Input natif caché pour l'accessibilité */}
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only peer"
        />
        {/* Case visuelle */}
        <span
          className={`
            flex-shrink-0 mt-0.5 grid place-items-center
            w-[18px] h-[18px] rounded
            border-[1.5px] transition-colors
            ${
              checked
                ? "bg-ohe-accent border-ohe-accent text-ohe-accent-ink"
                : error
                ? "bg-transparent border-red-600"
                : "bg-transparent border-ohe-accent peer-hover:bg-ohe-accent-soft"
            }
          `}
          aria-hidden
        >
          {checked && (
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 5.5L4.5 8L9 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <span className="text-[13px] leading-[1.55] text-ohe-muted select-none">
          {children}
        </span>
      </label>
      {error && (
        <div className="text-xs text-red-600 ml-[30px]">
          {error}
        </div>
      )}
    </div>
  );
}
