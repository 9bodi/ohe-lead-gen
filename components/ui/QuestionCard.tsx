"use client";

import { useState } from "react";
import type { ProceduralQuestion } from "@/lib/questions";

interface QuestionCardProps {
  question: ProceduralQuestion;
  /** Consigne affichée au-dessus de l'énoncé (ex: "Quelle orthographe vous semble correcte ?") */
  prompt: string;
  /** Callback appelée quand l'utilisateur a choisi (après un court délai de feedback visuel) */
  onAnswer: (choiceText: string) => void;
}

export function QuestionCard({ question, prompt, onAnswer }: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(text: string) {
    if (selected) return; // évite le double-clic
    setSelected(text);
    setTimeout(() => {
      onAnswer(text);
      setSelected(null);
    }, 350);
  }

  // L'énoncé contient ___ (triple underscore) à remplacer par un trait souligné
  const parts = question.statement.split("___");

  return (
    <div className="flex flex-col">
      {/* Consigne */}
      <p
        className="text-[13px] text-ohe-muted m-0"
        style={{ letterSpacing: "0.04em" }}
      >
        {prompt}
      </p>

      {/* Énoncé */}
      <h2 className="m-0 mt-3.5 text-[44px] leading-[1.18] font-normal tracking-[-0.012em] font-serif italic text-balance max-w-[760px]">
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < parts.length - 1 && (
              <span
                className="inline-block border-b-2 border-ohe-accent align-[-2px] mx-2"
                style={{ minWidth: 180, height: 36 }}
              />
            )}
          </span>
        ))}
      </h2>

      {/* Choix de réponse — grille 2x2 (ou 2x3 si 5 choix) */}
      <div className="mt-auto pt-10 grid grid-cols-2 gap-3 max-w-[760px]">
        {question.choices.map((choice, idx) => {
          const isSelected = selected === choice.text;
          const isUnknown = choice.unknown === true;
          const keyNumber = idx + 1;

          return (
            <button
              key={choice.text}
              type="button"
              onClick={() => handleSelect(choice.text)}
              disabled={!!selected}
              className={`
                flex items-center gap-4 px-5 py-[18px] rounded-[10px] border text-left transition-colors
                ${
                  isSelected
                    ? "bg-ohe-accent text-ohe-accent-ink border-ohe-accent"
                    : isUnknown
                    ? "bg-ohe-panel text-ohe-muted border-ohe-line hover:border-ohe-muted"
                    : "bg-ohe-panel text-ohe-ink border-ohe-line hover:border-ohe-accent"
                }
                ${selected && !isSelected ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {/* Petit numéro discret (utile pour le clavier potentiel) */}
              <span
                className={`
                  inline-grid place-items-center w-[26px] h-[26px] rounded-md text-[11px] font-semibold tracking-[0.08em] shrink-0
                  ${isSelected ? "border border-ohe-accent-ink opacity-100" : "border border-ohe-line opacity-85"}
                `}
              >
                {keyNumber}
              </span>
              {/* Texte du choix */}
              <span
                className={
                  isUnknown
                    ? "text-sm italic"
                    : "font-serif italic text-xl"
                }
              >
                {choice.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
