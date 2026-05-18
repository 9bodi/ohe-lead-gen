"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ALL_QUESTIONS, TEST_DURATION_SECONDS, type Question } from "@/lib/questions";

// === Types ===

export type Answer = {
  questionId: string;
  /** Clé de la réponse choisie (A, B, C, D) — null si timeout sans réponse */
  choiceKey: string | null;
  /** Temps mis pour répondre, en ms */
  answeredInMs: number;
};

export type TestStatus = "running" | "completed";

export type UseTestState = {
  /** Toutes les questions du test (mémo) */
  questions: Question[];
  /** Index de la question courante (0-based) */
  currentIndex: number;
  /** Question courante (raccourci) */
  currentQuestion: Question;
  /** Toutes les réponses données jusqu'ici */
  answers: Answer[];
  /** Statut du test */
  status: TestStatus;
  /** Secondes restantes sur le timer global */
  secondsRemaining: number;
  /** Durée totale du test (sec) */
  totalSeconds: number;
  /** Timestamp de démarrage (utile pour computer la durée finale) */
  startedAt: number;
  /** Choisir une réponse pour la question courante et passer à la suivante */
  answerAndNext: (choiceKey: string) => void;
  /** Réinitialiser entièrement le test (pour le bouton "Quitter") */
  reset: () => void;
};

// === Hook principal ===

export function useTest(): UseTestState {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [status, setStatus] = useState<TestStatus>("running");
  const [secondsRemaining, setSecondsRemaining] = useState(TEST_DURATION_SECONDS);
  const [startedAt] = useState(() => Date.now());

  // Timestamp d'affichage de la question courante (pour mesurer answeredInMs)
  const questionStartRef = useRef(Date.now());

  // Tick du timer global (toutes les secondes)
  useEffect(() => {
    if (status !== "running") return;

    const interval = setInterval(() => {
      setSecondsRemaining((s) => {
        if (s <= 1) {
          // Timeout global — on termine le test
          clearInterval(interval);
          setStatus("completed");
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  // Reset du timestamp à chaque changement de question
  useEffect(() => {
    questionStartRef.current = Date.now();
  }, [currentIndex]);

  const currentQuestion = ALL_QUESTIONS[currentIndex];

  const answerAndNext = useCallback(
    (choiceKey: string) => {
      const now = Date.now();
      const answeredInMs = now - questionStartRef.current;

      const newAnswer: Answer = {
        questionId: currentQuestion.id,
        choiceKey,
        answeredInMs,
      };

      setAnswers((prev) => [...prev, newAnswer]);

      // Passer à la question suivante, ou terminer si dernière
      if (currentIndex >= ALL_QUESTIONS.length - 1) {
        setStatus("completed");
      } else {
        setCurrentIndex((i) => i + 1);
      }
    },
    [currentIndex, currentQuestion]
  );

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setAnswers([]);
    setStatus("running");
    setSecondsRemaining(TEST_DURATION_SECONDS);
    questionStartRef.current = Date.now();
  }, []);

  const questions = useMemo(() => ALL_QUESTIONS, []);

  return {
    questions,
    currentIndex,
    currentQuestion,
    answers,
    status,
    secondsRemaining,
    totalSeconds: TEST_DURATION_SECONDS,
    startedAt,
    answerAndNext,
    reset,
  };
}
