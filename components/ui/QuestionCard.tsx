"use client";

import { useState } from "react";
import type { Question } from "@/lib/questions";

interface QuestionCardProps {
  question: Question;
  /** Callback appelée quand l'utilisateur a choisi (après le petit délai de confirmation) */
  onAnswer: (choiceKey: string) => void;
}

export function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);

  // Quand on clique : on sélectionne visuellement, puis on valide après 450ms
  // (Effet de feedback visuel "ma réponse est bien prise en compte")
  function handleSelect(key: string) {
    if (selected) return; // évite double clic
    setSelected(key);
    setTimeout(() => {
      onAnswer(key);
      setSelected(null);
    }, 450);
  }

  // Rendu de l'énoncé avec remplacement de <__> par un trait souligné
  const statementParts = question.statement.split("<__>");

  return (
    <div className="flex flex-col">
      {/* Eyebrow catégorie */}
      <div className="ohe-eyebrow text-ohe-accent inline-flex items-center gap-3">
        <span className="opacity-65">✱</span>
        <span>{question.category}</span>
      </div>

      {/* Prompt + énoncé */}
      <div className="mt-10">
        <p className="text-[13px] text-ohe-muted m-0" style={{ letterSpacing: "0.04em" }}>
          {question.prompt}
        </p>
        <h2
          className="m-0 mt-3.5 text-[44px] leading-[1.18] font-normal tracking-[-0.012em] font-serif italic text-balance max-w-[720px]"
        >
          {statementParts.map((part, i) => (
            <span key={i}>
              {part}
              {i < statementParts.length - 1 && (
                <span
                  className="inline-block border-b-2 border-ohe-accent align-[-2px] mx-2"
                  style={{ minWidth: 200, height: 36 }}
                />
              )}
            </span>
          ))}
        </h2>
      </div>

      {/* Choix de réponse — grid 2x2 */}
      <div className="mt-auto pt-10 grid grid-cols-2 gap-3 max-w-[720px]">
        {question.choices.map((choice) => {
          const isSelected = selected === choice.key;
          const isUnknown = "unknown" in choice && choice.unknown;

          return (
            <button
              key={choice.key}
              type="button"
              onClick={() => handleSelect(choice.key)}
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
              <span
                className={`
                  inline-grid place-items-center w-[26px] h-[26px] rounded-md text-[11px] font-semibold tracking-[0.08em]
                  ${isSelected ? "border border-ohe-accent-ink opacity-100" : "border border-ohe-line opacity-85"}
                `}
              >
                {choice.key}
              </span>
              <span
                className={
                  isUnknown
                    ? "text-sm"
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
