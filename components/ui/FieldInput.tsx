"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface FieldInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Préfixe affiché à gauche de l'input (ex: "+33" pour le téléphone) */
  prefix?: string;
  /** Erreur de validation à afficher en dessous */
  error?: string;
}

export const FieldInput = forwardRef<HTMLInputElement, FieldInputProps>(
  function FieldInput({ prefix, error, className = "", ...props }, ref) {
    return (
      <div className="flex flex-col">
        <div
          className={`
            flex items-center gap-2.5 px-0 py-2 border-b transition-colors
            ${error ? "border-red-600" : "border-ohe-line focus-within:border-ohe-accent"}
          `}
        >
          {prefix && (
            <span className="text-ohe-muted text-sm select-none">{prefix}</span>
          )}
          <input
            ref={ref}
            className={`
              flex-1 border-none outline-none bg-transparent
              text-lg text-ohe-ink font-sans
              placeholder:text-ohe-muted/50
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <div className="mt-1.5 text-xs text-red-600">
            {error}
          </div>
        )}
      </div>
    );
  }
);
