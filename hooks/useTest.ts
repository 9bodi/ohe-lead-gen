"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BLOCK_1,
  BLOCK_2,
  DECLARATIVES,
  PROCEDURAL_SECONDS_PER_QUESTION,
  shuffleBlock,
  type ProceduralQuestion,
  type DeclarativeQuestion,
} from "@/lib/questions";
import type { RawAnswer } from "@/lib/scoring/compute";

// === Types ===

export type TestPhase =
  | "block1"        // Bloc 1 — accords
  | "transition"    // Écran transition entre les 2 blocs procéduraux
  | "block2"        // Bloc 2 — conjugaison
  | "declaratives"  // 3 questions ADAPTATION
  | "completed";    // Test terminé, prêt pour la capture email

export type CurrentQuestion =
  | { kind: "procedural"; question: ProceduralQuestion; secondsLeft: number }
  | { kind: "declarative"; question: DeclarativeQuestion }
  | { kind: "none" };

export type UseTestState = {
  /** Phase courante du test */
  phase: TestPhase;
  /** Index global (toutes phases procédurales confondues) — 0 à 15 */
  proceduralIndex: number;
  /** Index dans le bloc déclaratif — 0 à 2 */
  declarativeIndex: number;
  /** Question courante avec ses métadonnées */
  current: CurrentQuestion;
  /** Toutes les réponses collectées jusqu'ici */
  answers: RawAnswer[];
  /** Temps de démarrage du test (ms epoch) */
  startedAt: number;
  /** Répondre à la question procédurale courante */
  answerProcedural: (choiceText: string) => void;
  /** Répondre à la question déclarative courante (yes/no) */
  answerDeclarative: (answer: "yes" | "no") => void;
  /** Forcer la fin de la transition (appelé quand l'écran transition se termine) */
  finishTransition: () => void;
  /** Réinitialiser entièrement le test */
  reset: () => void;
};

// === Hook ===

export function useTest(): UseTestState {
  // === Questions mélangées (stables sur toute la durée du test) ===
  // useMemo avec dépendance vide → mélange UNE seule fois au montage
  const block1Questions = useMemo(() => shuffleBlock(BLOCK_1), []);
  const block2Questions = useMemo(() => shuffleBlock(BLOCK_2), []);

  // === États ===
  const [phase, setPhase] = useState<TestPhase>("block1");
  const [proceduralIndex, setProceduralIndex] = useState(0); // 0..15 sur les 16 procédurales
  const [declarativeIndex, setDeclarativeIndex] = useState(0); // 0..2
  const [answers, setAnswers] = useState<RawAnswer[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(PROCEDURAL_SECONDS_PER_QUESTION);
  const [startedAt] = useState(() => Date.now());

  // Timestamp d'affichage de la question courante (pour calculer answeredInMs)
  const questionStartRef = useRef(Date.now());

  // === Quelle question afficher selon la phase et l'index ===
  const currentQuestion = useMemo((): ProceduralQuestion | DeclarativeQuestion | null => {
    if (phase === "block1") {
      // proceduralIndex 0..7 → BLOC 1
      return block1Questions[proceduralIndex] ?? null;
    }
    if (phase === "block2") {
      // proceduralIndex 8..15 → BLOC 2 (offset de 8)
      return block2Questions[proceduralIndex - 8] ?? null;
    }
    if (phase === "declaratives") {
      return DECLARATIVES[declarativeIndex] ?? null;
    }
    return null;
  }, [phase, proceduralIndex, declarativeIndex, block1Questions, block2Questions]);

  // === Reset du timer à chaque changement de question procédurale ===
  useEffect(() => {
    if (phase === "block1" || phase === "block2") {
      setSecondsLeft(PROCEDURAL_SECONDS_PER_QUESTION);
      questionStartRef.current = Date.now();
    } else if (phase === "declaratives") {
      // Pas de timer pour les déclaratives, mais on tracke quand même le temps
      questionStartRef.current = Date.now();
    }
  }, [phase, proceduralIndex, declarativeIndex]);

  // === Tick du timer (uniquement en phase procédurale) ===
  useEffect(() => {
    if (phase !== "block1" && phase !== "block2") return;

    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          // Timeout : on enregistre une réponse vide et on avance
          handleTimeout();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, proceduralIndex]);

  // === Handler de timeout (pas de réponse en 10 sec) ===
  const handleTimeout = useCallback(() => {
    if (!currentQuestion || currentQuestion.type !== "procedural") return;
    const answeredInMs = Date.now() - questionStartRef.current;
    const newAnswer: RawAnswer = {
      questionId: currentQuestion.id,
      answer: null,
      isCorrect: false, // timeout = considéré comme faux
      answeredInMs,
    };
    setAnswers((prev) => [...prev, newAnswer]);
    advanceFromProcedural();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion]);

  // === Avancer après une réponse procédurale (ou un timeout) ===
  const advanceFromProcedural = useCallback(() => {
    setProceduralIndex((idx) => {
      const next = idx + 1;
      // Fin du bloc 1 → transition
      if (next === 8) {
        setPhase("transition");
        return next; // garder l'index à 8, on reprendra block2 ensuite
      }
      // Fin du bloc 2 → déclaratives
      if (next === 16) {
        setPhase("declaratives");
        return next;
      }
      return next;
    });
  }, []);

  // === Avancer après une réponse déclarative ===
  const advanceFromDeclarative = useCallback(() => {
    setDeclarativeIndex((idx) => {
      const next = idx + 1;
      if (next === DECLARATIVES.length) {
        setPhase("completed");
      }
      return next;
    });
  }, []);

  // === Actions exposées ===

  const answerProcedural = useCallback(
    (choiceText: string) => {
      if (!currentQuestion || currentQuestion.type !== "procedural") return;

      const choice = currentQuestion.choices.find((c) => c.text === choiceText);
      const isCorrect = choice?.correct === true;
      const answeredInMs = Date.now() - questionStartRef.current;

      const newAnswer: RawAnswer = {
        questionId: currentQuestion.id,
        answer: choiceText,
        isCorrect,
        answeredInMs,
      };
      setAnswers((prev) => [...prev, newAnswer]);
      advanceFromProcedural();
    },
    [currentQuestion, advanceFromProcedural]
  );

  const answerDeclarative = useCallback(
    (answer: "yes" | "no") => {
      if (!currentQuestion || currentQuestion.type !== "declarative") return;

      const answeredInMs = Date.now() - questionStartRef.current;
      const newAnswer: RawAnswer = {
        questionId: currentQuestion.id,
        answer,
        isCorrect: null, // pas de notion de "correct" pour les déclaratives
        answeredInMs,
      };
      setAnswers((prev) => [...prev, newAnswer]);
      advanceFromDeclarative();
    },
    [currentQuestion, advanceFromDeclarative]
  );

  const finishTransition = useCallback(() => {
    if (phase === "transition") {
      setPhase("block2");
    }
  }, [phase]);

  const reset = useCallback(() => {
    setPhase("block1");
    setProceduralIndex(0);
    setDeclarativeIndex(0);
    setAnswers([]);
    setSecondsLeft(PROCEDURAL_SECONDS_PER_QUESTION);
    questionStartRef.current = Date.now();
  }, []);

  // === Objet `current` exposé proprement ===
  const current: CurrentQuestion = useMemo(() => {
    if (!currentQuestion) return { kind: "none" };
    if (currentQuestion.type === "procedural") {
      return { kind: "procedural", question: currentQuestion, secondsLeft };
    }
    return { kind: "declarative", question: currentQuestion };
  }, [currentQuestion, secondsLeft]);

  return {
    phase,
    proceduralIndex,
    declarativeIndex,
    current,
    answers,
    startedAt,
    answerProcedural,
    answerDeclarative,
    finishTransition,
    reset,
  };
}
